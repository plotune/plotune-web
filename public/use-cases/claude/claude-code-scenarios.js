// ── Scenario 0: HIL firmware gate ────────────────────────────────────────────
// Automotive HIL rig: a new ADAS controller firmware PR must pass a HIL
// acceptance matrix before it can be promoted to the release branch.
// Nexus runs the managed controller container on vcan0, mirrors live vehicle
// signals from can0 through a policy gateway, and records evidence on both buses.
async function s0_hil_firmware_gate() {
  add('gap-lg');
  await wait(250);
  await typeUser('Gate PR-319 for the ADAS controller firmware on the HIL rig.');
  add('gap');
  await wait(450);

  let s = spin('Reading workspace and acceptance rules…'); await wait(1200); s.stop();
  command('rg --files . | rg "AGENTS|hil|dbc|a2l|xlsx|pdf|Containerfile|pytest|adas"');
  add('out', [
    'AGENTS.md',
    'plotune/rules/hil-acceptance.md',
    'plotune/rules/gateway-policy.md',
    'hil/rig-01.yaml',
    'network/ADAS_CAN_2026Q2.dbc',
    'calibration/ADAS_Ctrl_PR319.a2l',
    'release/ADAS_PR319_acceptance_matrix.xlsx',
    'procedures/hil_adas_gate_procedure.pdf',
    'containers/adas-controller/Containerfile',
    'tests/hil/test_adas_pr319_gate.py',
  ].join('<br>'));
  await wait(350);
  await prose('PR-319 acceptance matrix: run local HIL tests, package the controller image, stage it to Nexus, run it on <span class="cd">vcan0</span> behind a policy gateway mirroring <span class="cd">can0</span> vehicle signals, and gate promotion on trace evidence.');
  await wait(400);

  s = spin('Extracting acceptance limits from matrix…'); await wait(1400); s.stop();
  command('python tools/parse_acceptance_matrix.py --xlsx release/ADAS_PR319_acceptance_matrix.xlsx --rig hil/rig-01.yaml', [
    'rig: nexus-hil-01',
    'interfaces: can0=vehicle_bus, vcan0=controller_bus',
    'candidate: adas-controller PR-319',
    'DBC: network/ADAS_CAN_2026Q2.dbc',
    'limits: LaneOffset <= 0.12 m, BrakeLatency <= 65 ms, FalsePositiveRate = 0',
    'gateway policy: vehicle→controller [0x1A0,0x1A1,0x210], controller→vehicle [0x300,0x301]',
  ]);
  await wait(400);

  s = spin('Running local HIL unit tests (1m 52s elapsed, 14× playback)…'); await wait(1800); s.stop();
  command('uv run pytest tests/hil/test_adas_pr319_gate.py -q', [
    'test_loads_adas_dbc PASSED',
    'test_lane_offset_limit_from_matrix PASSED',
    'test_brake_latency_budget PASSED',
    'test_gateway_allowlist_contract PASSED',
    'test_false_positive_threshold PASSED',
    '11 passed in 112.38s',
  ]);
  await wait(350);

  s = spin('Building ADAS controller image (5m 14s elapsed, 14× playback)…'); await wait(2200); s.stop();
  command('podman build -t registry.customer.local/adas/adas-controller:PR-319 containers/adas-controller');
  add('out', 'Successfully tagged registry.customer.local/adas/adas-controller:PR-319');
  command('podman save -o /tmp/adas-controller-PR-319.tar registry.customer.local/adas/adas-controller:PR-319');
  add('out', 'wrote /tmp/adas-controller-PR-319.tar  sha256: e71d3b08…  size: 84.2 MB');
  await wait(400);

  s = spin('Reading HIL rig state…'); await wait(1200); s.stop();
  tool('plotune://device/context', '', 'resource')([
    ['⎿', 'device_id: nexus-hil-01   active_jobs: 0   active_gateways: 0   active_containers: 0   clock_offset: 0.4 ms', 'key'],
  ]);
  await wait(240);
  tool('plotune://device/interfaces', '', 'resource')([
    ['⎿', 'can0    vehicle_bus     500kbit/s  up   leases: 0', 'ok'],
    [' ', 'vcan0   controller_bus  virtual    up   leases: 0', 'ok'],
  ]);
  await wait(400);

  s = spin('Acquiring rig interfaces…'); await wait(900); s.stop();
  tool('acquire_can_interface', '"can0", agent_id="claude", session_id="adas-pr319-hil01", purpose="vehicle-bus-evidence"')([
    ['⎿', 'status: acquired   lease_id: lease-can0-pr319', 'ok'],
  ]);
  await wait(220);
  tool('acquire_can_interface', '"vcan0", agent_id="claude", session_id="adas-pr319-hil01", purpose="controller-candidate"')([
    ['⎿', 'status: acquired   lease_id: lease-vcan0-pr319', 'ok'],
  ]);
  await wait(350);

  s = spin('Uploading controller archive to Nexus…'); await wait(1100); s.stop();
  tool('prepare_put_artifact', 'file_name="adas-controller-PR-319.tar", size=84200000, sha256="e71d3b08…", folder_name="containers"')([
    ['⎿', 'transfer_id: put-adas-pr319   signed_upload_url: https://transfer.plotune.net/put/put-adas-pr319…', 'key'],
  ]);
  await wait(250);
  tool('put_artifact', '"put-adas-pr319"')([
    ['⎿', 'artifact_id: ctr-adas-controller-pr319   path: /var/lib/plotune-nexus/containers/adas-controller-PR-319.tar', 'ok'],
  ]);
  await wait(450);

  s = spin('Starting candidate container and CAN policy gateway…'); await wait(1400); s.stop();
  tool('start_container', 'name="adas-controller-candidate", artifact_id="ctr-adas-controller-pr319", network_mode="host", can_interfaces=["vcan0"], max_runtime_seconds=3600')([
    ['⎿', 'container_id: adas-controller-candidate   status: running   can_interfaces: vcan0', 'ok'],
  ]);
  await wait(240);
  tool('start_can_gateway', 'source_interface="can0", destination_interface="vcan0", source_to_destination_rules=[0x1A0,0x1A1,0x210], destination_to_source_rules=[0x300,0x301], max_runtime_seconds=3600')([
    ['⎿', 'job_id: gw-adas-pr319   status: running   policy: allowlist', 'ok'],
  ]);
  await wait(300);
  tool('get_container_status', '"adas-controller-candidate"')([
    ['⎿', 'status: running   logs: PR-319 ready; dbc=ADAS_CAN_2026Q2; a2l=ADAS_Ctrl_PR319; bus=vcan0', 'ok'],
  ]);
  await wait(400);

  s = spin('Running HIL acceptance matrix (14m 22s elapsed, 14× playback)…'); await wait(2800); s.stop();
  tool('run_test_sequence', 'definition=ADAS_PR319_acceptance_matrix.xlsx with ADAS_CAN_2026Q2.dbc and ADAS_Ctrl_PR319.a2l, max_runtime_seconds=1200')([
    ['⎿', 'job_id: seq-adas-pr319-hil01   status: running', 'key'],
  ]);
  await wait(350);
  tool('wait_for_job', '"seq-adas-pr319-hil01", timeout_seconds=1260')([
    ['⎿', 'completed: true   failed_steps: 0   duration: 862.4 s', 'ok'],
    [' ', 'step lane-offset-closed-loop   pass   max=0.09 m   limit=0.12 m', 'ok'],
    [' ', 'step brake-latency-p99         pass   p99=52 ms   limit=65 ms', 'ok'],
    [' ', 'step false-positive-count       pass   count=0', 'ok'],
    [' ', 'step gateway-policy-audit       pass   unexpected_to_can0=0', 'ok'],
  ]);
  await wait(450);

  s = spin('Capturing evidence traces on both buses…'); await wait(1600); s.stop();
  tool('record_can', 'channel="can0", duration_seconds=120, interface="socketcan"')([
    ['⎿', 'job_id: record-can0-pr319   status: running', 'key'],
  ]);
  await wait(180);
  tool('record_can', 'channel="vcan0", duration_seconds=120, interface="socketcan"')([
    ['⎿', 'job_id: record-vcan0-pr319   status: running', 'key'],
  ]);
  await wait(260);
  tool('wait_for_job', '["record-can0-pr319","record-vcan0-pr319"], timeout_seconds=180')([
    ['⎿', 'record-can0-pr319   completed   artifact: asc-can0-adas-pr319   frames: 94,207', 'ok'],
    [' ', 'record-vcan0-pr319  completed   artifact: asc-vcan0-adas-pr319  frames: 97,841', 'ok'],
  ]);
  await wait(350);

  s = spin('Checking gateway counters and reading inline slice…'); await wait(1200); s.stop();
  tool('get_can_gateway', '"gw-adas-pr319"')([
    ['⎿', 'can0→vcan0 forwarded: 22,104   dropped: 94', 'ok'],
    [' ', 'vcan0→can0 forwarded: 5,312    dropped: 40,218', 'ok'],
    [' ', 'last_drop_reason: no_rule_match   unexpected_to_can0: 0', 'ok'],
  ]);
  await wait(260);
  tool('read_artifact', '"asc-can0-adas-pr319", offset_bytes=0, max_bytes=65536')([
    ['⎿', '0.000000 can0 1A0 Rx d 8 00 1F C4 03 00 00 00 00', ''],
    [' ', '0.004118 vcan0 300 Tx d 8 00 00 04 02 00 00 00 00', ''],
    [' ', '… allowlisted IDs only in first 65,536 bytes', 'key'],
  ]);
  await wait(350);

  s = spin('Publishing evidence and promoting candidate…'); await wait(1400); s.stop();
  tool('upload_to_artifact_drive', 'drive_id="customer-sharepoint", local_path="/var/lib/plotune-nexus/recordings/asc-can0-adas-pr319.asc", remote_path="ADAS/releases/PR-319/hil-01/can0.asc"')([
    ['⎿', 'uploaded   provider: sharepoint   bytes: 21.4 MB', 'ok'],
  ]);
  await wait(200);
  tool('upload_to_artifact_drive', 'drive_id="customer-sharepoint", local_path="/var/lib/plotune-nexus/recordings/asc-vcan0-adas-pr319.asc", remote_path="ADAS/releases/PR-319/hil-01/vcan0.asc"')([
    ['⎿', 'uploaded   provider: sharepoint   bytes: 22.2 MB', 'ok'],
  ]);
  await wait(200);
  tool('stop_can_gateway', '"gw-adas-pr319"')([['⎿', 'status: stopped   final_counters_saved: true', 'ok']]);
  await wait(180);
  tool('stop_container', '"adas-controller-candidate"')([['⎿', 'status: stopped   exit_code: 0', 'ok']]);
  await wait(180);
  tool('release_can_interface', '"can0", "vcan0", session_id="adas-pr319-hil01"')([['⎿', 'released: can0, vcan0', 'ok']]);
  await wait(400);

  await prose('<span class="hl">PR-319 gate passed.</span> All four HIL matrix checks passed — lane offset, brake latency, zero false positives, and clean gateway audit. Evidence traces uploaded to SharePoint.');
  add('gap');
  await prose('<span class="hl">Evidence:</span> <span class="cd">seq-adas-pr319-hil01</span>, <span class="cd">asc-can0-adas-pr319</span>, <span class="cd">asc-vcan0-adas-pr319</span>, gateway counters from <span class="cd">gw-adas-pr319</span>.');
}

// ── Scenario 1: Gateway regression ───────────────────────────────────────────
// A new gateway ECU firmware must pass a regression check: no unexpected IDs
// shall cross the powertrain/body boundary. Nexus runs the regression sequence,
// validates counters, and cross-checks against the known-good baseline trace.
async function s1_gateway_regression() {
  add('gap-lg');
  await wait(250);
  await typeUser('Run the gateway regression for firmware 0503 and compare against the baseline.');
  add('gap');
  await wait(450);

  let s = spin('Locating regression files and baseline…'); await wait(1200); s.stop();
  command('rg --files . | rg "AGENTS|gateway|dbc|xlsx|pdf|Containerfile|pytest|baseline"');
  add('out', [
    'AGENTS.md',
    'plotune/rules/gateway-regression.md',
    'network/PT_CAN_R07.dbc',
    'network/Body_CAN_R07.dbc',
    'release/GW_0503_regression_matrix.xlsx',
    'baseline/GW_0499_can0_baseline.asc',
    'procedures/gateway_regression_procedure.pdf',
    'tests/regression/test_gateway_0503.py',
  ].join('<br>'));
  await wait(350);
  await prose('Regression plan: run the 0503 firmware on the bench gateway, replay the baseline stimuli on <span class="cd">can0</span> through a policy gateway into <span class="cd">can1</span> (body bus), capture both buses, and verify no unexpected IDs crossed. I\'ll diff the counter summary against the 0499 baseline.');
  await wait(400);

  s = spin('Running local regression tests (2m 04s elapsed, 14× playback)…'); await wait(1700); s.stop();
  command('uv run pytest tests/regression/test_gateway_0503.py -q', [
    'test_loads_pt_can_dbc PASSED',
    'test_loads_body_can_dbc PASSED',
    'test_regression_matrix_complete PASSED',
    'test_baseline_asc_readable PASSED',
    'test_id_allowlist_symmetric PASSED',
    '8 passed in 124.17s',
  ]);
  await wait(350);

  s = spin('Reading bench state…'); await wait(1100); s.stop();
  tool('plotune://device/context', '', 'resource')([
    ['⎿', 'device_id: nexus-gw-bench-03   active_jobs: 0   active_gateways: 0   clock_offset: 0.7 ms', 'key'],
  ]);
  await wait(240);
  tool('plotune://device/interfaces', '', 'resource')([
    ['⎿', 'can0   powertrain_can  500kbit/s  up   leases: 0', 'ok'],
    [' ', 'can1   body_can        500kbit/s  up   leases: 0', 'ok'],
  ]);
  await wait(350);
  tool('get_clock_sync_status', '')([
    ['⎿', 'ntp_synced: true   offset: 0.7 ms   stratum: 2', 'ok'],
  ]);
  await wait(350);

  s = spin('Acquiring interfaces…'); await wait(900); s.stop();
  tool('acquire_can_interface', '"can0", agent_id="claude", session_id="gw-regr-0503", purpose="powertrain-stimulus"')([
    ['⎿', 'status: acquired   lease_id: lease-gw-can0', 'ok'],
  ]);
  await wait(220);
  tool('acquire_can_interface', '"can1", agent_id="claude", session_id="gw-regr-0503", purpose="body-bus-audit"')([
    ['⎿', 'status: acquired   lease_id: lease-gw-can1', 'ok'],
  ]);
  await wait(350);

  s = spin('Staging policy gateway and starting captures…'); await wait(1300); s.stop();
  tool('start_can_gateway', 'source_interface="can0", destination_interface="can1", source_to_destination_rules=[0x101,0x102,0x110,0x111], destination_to_source_rules=[0x201,0x202], max_runtime_seconds=900')([
    ['⎿', 'job_id: gw-0503-regr   status: running   policy: allowlist', 'ok'],
  ]);
  await wait(250);
  tool('record_can', 'channel="can0", duration_seconds=300, interface="socketcan"')([
    ['⎿', 'job_id: record-gw-can0   status: running', 'key'],
  ]);
  await wait(180);
  tool('record_can', 'channel="can1", duration_seconds=300, interface="socketcan"')([
    ['⎿', 'job_id: record-gw-can1   status: running', 'key'],
  ]);
  await wait(350);

  s = spin('Running gateway regression sequence (8m 22s elapsed, 14× playback)…'); await wait(2600); s.stop();
  tool('run_test_sequence', 'definition=GW_0503_regression_matrix.xlsx with PT_CAN_R07.dbc and Body_CAN_R07.dbc, max_runtime_seconds=600')([
    ['⎿', 'job_id: seq-gw-0503-regr   status: running', 'key'],
  ]);
  await wait(260);
  tool('wait_for_job', '"seq-gw-0503-regr", timeout_seconds=660')([
    ['⎿', 'completed: true   failed_steps: 0   duration: 502.1 s', 'ok'],
    [' ', 'step allowlist-forward-check    pass   unexpected_to_body: 0', 'ok'],
    [' ', 'step id-isolation-body-to-pt    pass   unexpected_to_pt: 0', 'ok'],
    [' ', 'step latency-through-gateway    pass   p95=3.2 ms   limit=8 ms', 'ok'],
    [' ', 'step high-load-stability        pass   no missed frames at 70% bus load', 'ok'],
  ]);
  await wait(450);

  s = spin('Collecting counters and completing recordings…'); await wait(1700); s.stop();
  tool('get_can_gateway', '"gw-0503-regr"')([
    ['⎿', 'can0→can1 forwarded: 31,204   dropped: 14,892', 'ok'],
    [' ', 'can1→can0 forwarded: 9,618    dropped: 22,381', 'ok'],
    [' ', 'unexpected_to_can0: 0   unexpected_to_can1: 0   last_drop_reason: no_rule_match', 'ok'],
  ]);
  await wait(300);
  tool('wait_for_job', '["record-gw-can0","record-gw-can1"], timeout_seconds=360')([
    ['⎿', 'record-gw-can0   completed   artifact: asc-gw0503-can0   frames: 186,012', 'ok'],
    [' ', 'record-gw-can1   completed   artifact: asc-gw0503-can1   frames: 82,416', 'ok'],
  ]);
  await wait(350);

  s = spin('Diffing against 0499 baseline…'); await wait(1400); s.stop();
  command('python tools/compare_gateway_trace.py --candidate asc-gw0503-can0 --baseline baseline/GW_0499_can0_baseline.asc --dbc network/PT_CAN_R07.dbc', [
    'forwarded_ids: identical (4 IDs, can0→can1)',
    'dropped_ids:   identical (body-only IDs, can1→can0)',
    'latency_delta: +0.1 ms p95 vs baseline (within tolerance)',
    'unexpected_ids_new: 0',
    'result: PASS — no regressions detected',
  ]);
  await wait(400);

  s = spin('Publishing artifacts and cleaning up…'); await wait(1300); s.stop();
  tool('upload_to_artifact_drive', 'drive_id="customer-sharepoint", local_path="/var/lib/plotune-nexus/recordings/asc-gw0503-can0.asc", remote_path="Gateway/releases/GW-0503/regression/can0.asc"')([
    ['⎿', 'uploaded   provider: sharepoint   bytes: 42.7 MB', 'ok'],
  ]);
  await wait(200);
  tool('upload_to_artifact_drive', 'drive_id="customer-sharepoint", local_path="/var/lib/plotune-nexus/recordings/asc-gw0503-can1.asc", remote_path="Gateway/releases/GW-0503/regression/can1.asc"')([
    ['⎿', 'uploaded   provider: sharepoint   bytes: 18.9 MB', 'ok'],
  ]);
  await wait(200);
  tool('stop_can_gateway', '"gw-0503-regr"')([['⎿', 'status: stopped   final_counters_saved: true', 'ok']]);
  await wait(180);
  tool('release_can_interface', '"can0", "can1", session_id="gw-regr-0503"')([['⎿', 'released: can0, can1', 'ok']]);
  await wait(400);

  await prose('<span class="hl">Gateway regression passed.</span> Zero unexpected IDs crossed the PT/body boundary in either direction. Latency delta vs 0499 baseline is +0.1 ms — well within the 1 ms tolerance.');
  add('gap');
  await prose('<span class="hl">Evidence:</span> <span class="cd">seq-gw-0503-regr</span>, <span class="cd">asc-gw0503-can0</span>, <span class="cd">asc-gw0503-can1</span>, baseline diff, and SharePoint release folder.');
}

// ── Scenario 2: BMS field triage ─────────────────────────────────────────────
// A field-returned BMS pack trips a latent fault after a high-current discharge.
// The mobile service kit (SLCAN + USB console) captures the event, correlates
// CAN fault frames with the UART console log, and uploads a service bundle.
async function s2_bms_field_triage() {
  add('gap-lg');
  await wait(250);
  await typeUser('Find why the BMS pack V72 faults after a high-current discharge cycle.');
  add('gap');
  await wait(450);

  let s = spin('Locating service files, runbook, and field report…'); await wait(1300); s.stop();
  command('rg --files . | rg "AGENTS|bms|DTC|xlsx|pdf|dbc|uart|runbook|fault"');
  add('out', [
    'AGENTS.md',
    'field/BMS_high_current_fault_runbook.pdf',
    'field/BMS_fault_matrix.xlsx',
    'network/BMS_CAN_2026.dbc',
    'procedures/bms_discharge_fault_procedure.pdf',
    'tests/diagnostics/test_bms_discharge_fault.py',
    'plotune/benches/mobile-service-kit.yaml',
  ].join('<br>'));
  await wait(350);
  await prose('The runbook flags a latent contactor-weld fault that surfaces 800 ms after discharge end. I\'ll synchronise CAN and UART captures, reproduce the cycle, correlate timestamps, and upload a service bundle.');
  await wait(400);

  s = spin('Pulling field report from SharePoint…'); await wait(1300); s.stop();
  tool('search_in_drive', 'drive_id="customer-sharepoint", query="BMS V72 high current discharge fault 2026-05", remote_path="FieldReports/BMS", limit=10')([
    ['⎿', 'FieldReports/BMS/V72_discharge_fault_2026-05-09.xlsx', 'key'],
    [' ', 'FieldReports/BMS/V72_scope_capture.pdf', ''],
  ]);
  await wait(240);
  tool('download_from_artifact_drive', 'drive_id="customer-sharepoint", remote_path="FieldReports/BMS/V72_discharge_fault_2026-05-09.xlsx", local_path="/var/lib/plotune-nexus/imports/V72_fault_report.xlsx"')([
    ['⎿', 'downloaded   bytes: 618 KB   sha256: 4a91fd22…', 'ok'],
  ]);
  await wait(350);

  s = spin('Running local diagnostic checks (1m 28s elapsed, 14× playback)…'); await wait(1500); s.stop();
  command('uv run pytest tests/diagnostics/test_bms_discharge_fault.py -q', [
    'test_fault_matrix_loads PASSED',
    'test_uart_patterns_match_runbook PASSED',
    'test_can_dbc_has_contactor_status PASSED',
    'test_uds_requests_match_procedure PASSED',
    '6 passed in 88.44s',
  ]);
  await wait(350);

  s = spin('Reading mobile service Nexus state…'); await wait(1100); s.stop();
  tool('plotune://device/interfaces', '', 'resource')([
    ['⎿', 'slcan0        bms_can      500kbit/s   up     leases: 0', 'ok'],
    [' ', '/dev/ttyUSB0  bms_console  115200      idle', 'ok'],
  ]);
  await wait(300);
  tool('get_clock_sync_status', '')([
    ['⎿', 'ntp_synced: true   offset: 1.4 ms   stratum: 2', 'ok'],
  ]);
  await wait(350);

  s = spin('Acquiring CAN interface and opening UART console…'); await wait(1200); s.stop();
  tool('acquire_can_interface', '"slcan0", agent_id="claude", session_id="bms-v72-triage", purpose="bms-fault-capture"')([
    ['⎿', 'status: acquired   lease_id: lease-slcan-bms-v72', 'ok'],
  ]);
  await wait(220);
  tool('open_uart_session', 'device_path="/dev/ttyUSB0", baud_rate=115200, line_ending="\\r\\n", encoding="utf-8"')([
    ['⎿', 'session_id: uart-bms-v72   status: open', 'ok'],
  ]);
  await wait(220);
  tool('record_can', 'channel="slcan0", duration_seconds=240, interface="socketcan"')([
    ['⎿', 'job_id: record-bms-can-v72   status: running', 'key'],
  ]);
  await wait(180);
  tool('record_uart', 'session_id="uart-bms-v72", duration_seconds=240, artifact_format="txt"')([
    ['⎿', 'job_id: record-bms-uart-v72   status: running', 'key'],
  ]);
  await wait(350);

  s = spin('Reading ECU identity and pre-cycle DTC state…'); await wait(1300); s.stop();
  tool('send_uds_request', 'target={transport:"can_isotp", channel:"slcan0", tx_id:"7E4", rx_id:"7EC"}, request_hexes=["22F190","1901FF"], timeout_seconds=2.0')([
    ['⎿', '22F190 → positive   VIN: WBABMS0V72PK04192', 'ok'],
    [' ', '1901FF → positive   DTC count: 0   (clean before cycle)', 'ok'],
  ]);
  await wait(400);

  s = spin('Triggering high-current discharge cycle (4m 12s elapsed, 14× playback)…'); await wait(2300); s.stop();
  tool('send_uart', 'session_id="uart-bms-v72", mode="text", text="discharge --current 280A --duration 45s", append_line_ending=true')([
    ['⎿', 'bytes_written: 43', 'ok'],
  ]);
  await wait(220);
  tool('wait_uart', 'session_id="uart-bms-v72", mode="text", operator="contains", value="DISCHARGE_COMPLETE", timeout_seconds=60')([
    ['⎿', 'matched: true   elapsed: 47.2 s   line: DISCHARGE_COMPLETE current=280.4A soc=68.1%', 'ok'],
  ]);
  await wait(260);
  // The latent fault appears 800 ms after discharge completes
  tool('wait_can_until', 'channel="slcan0", arbitration_id="18FF82E4", data_mask_hex="FF00", data_pattern_hex="C200", timeout_seconds=10')([
    ['⎿', 'matched: true   elapsed: 0.82 s   frame: 18FF82E4 C2 04 02 00 18 00 00 00', 'warn'],
  ]);
  await wait(350);
  tool('wait_uart', 'session_id="uart-bms-v72", mode="text", operator="contains", value="CONTACTOR_WELD_DETECTED", timeout_seconds=5')([
    ['⎿', 'matched: true   elapsed: 0.09 s   line: CONTACTOR_WELD_DETECTED ch=B residual_I=2.4A', 'warn'],
  ]);
  await wait(400);

  s = spin('Reading post-cycle DTC state…'); await wait(1300); s.stop();
  tool('send_uds_request', 'target={transport:"can_isotp", channel:"slcan0", tx_id:"7E4", rx_id:"7EC"}, request_hexes=["1902FF","22F191"], timeout_seconds=2.0')([
    ['⎿', '1902FF → positive   P1C44:28 Contactor B weld detected — active this cycle', 'warn'],
    [' ', '22F191 → positive   SW version: BMS_2026Q1_R04   calibration: CAL-BMS-0419', 'ok'],
  ]);
  await wait(350);

  s = spin('Completing recordings and extracting inline evidence…'); await wait(1800); s.stop();
  tool('wait_for_job', '["record-bms-can-v72","record-bms-uart-v72"], timeout_seconds=280')([
    ['⎿', 'record-bms-can-v72   completed   artifact: asc-bms-v72-discharge   frames: 52,844', 'ok'],
    [' ', 'record-bms-uart-v72  completed   artifact: txt-bms-v72-console     lines: 2,316', 'ok'],
  ]);
  await wait(260);
  tool('read_artifact', '"txt-bms-v72-console", offset_bytes=0, max_bytes=65536')([
    ['⎿', '47.201s DISCHARGE_COMPLETE current=280.4A soc=68.1%', ''],
    [' ', '48.002s CONTACTOR_WELD_DETECTED ch=B residual_I=2.4A threshold=0.5A', 'warn'],
    [' ', '48.004s FAULT_LATCHED P1C44', 'warn'],
  ]);
  await wait(350);

  s = spin('Uploading service bundle and releasing bench…'); await wait(1400); s.stop();
  tool('upload_to_artifact_drive', 'drive_id="customer-sharepoint", local_path="/var/lib/plotune-nexus/recordings/asc-bms-v72-discharge.asc", remote_path="FieldReports/BMS/V72/evidence/discharge.asc"')([
    ['⎿', 'uploaded   provider: sharepoint   bytes: 11.6 MB', 'ok'],
  ]);
  await wait(220);
  tool('upload_to_artifact_drive', 'drive_id="customer-sharepoint", local_path="/var/lib/plotune-nexus/recordings/txt-bms-v72-console.txt", remote_path="FieldReports/BMS/V72/evidence/console.txt"')([
    ['⎿', 'uploaded   provider: sharepoint   bytes: 312 KB', 'ok'],
  ]);
  await wait(220);
  tool('close_uart_session', '"uart-bms-v72"')([['⎿', 'status: closed', 'ok']]);
  await wait(180);
  tool('release_can_interface', '"slcan0", session_id="bms-v72-triage"')([['⎿', 'released: slcan0', 'ok']]);
  await wait(400);

  await prose('<span class="hl">Root cause found.</span> Contactor B latent weld — CAN fault frame 0x18FF82E4 and UART log agree on a residual current of 2.4 A (threshold 0.5 A) appearing 820 ms after discharge end. Active <span class="cd">P1C44:28</span> confirmed by UDS.');
  add('gap');
  await prose('<span class="hl">Evidence:</span> <span class="cd">asc-bms-v72-discharge</span>, <span class="cd">txt-bms-v72-console</span>, UDS exchange history, and SharePoint service bundle.');
}

// ── Scenario 3: Multi-ECU handshake verification ──────────────────────────────
// A new vehicle bring-up requires confirming that four ECUs on the DoIP
// diagnostic network are all reachable, return correct VINs and SW versions,
// and are DTC-clean before the final sign-off trace is recorded.
async function s3_multinode_doip_handshake() {
  add('gap-lg');
  await wait(250);
  await typeUser('Verify all four ECU nodes on the DoIP bench are reachable, DTC-clean, and ready for sign-off.');
  add('gap');
  await wait(450);

  let s = spin('Locating bring-up procedure and ECU map…'); await wait(1200); s.stop();
  command('rg --files . | rg "AGENTS|doip|ecu|signoff|xlsx|pdf|uds|dbc"');
  add('out', [
    'AGENTS.md',
    'plotune/rules/doip-bringup.md',
    'network/DiagNet_R07.dbc',
    'release/R07_ecu_bringup_matrix.xlsx',
    'procedures/doip_multinode_bringup.pdf',
    'tests/bringup/test_r07_doip_nodes.py',
    'ecu-map/R07_logical_addresses.yaml',
  ].join('<br>'));
  await wait(350);
  await prose('Four ECUs are expected on the DoIP bench: Gateway (0x0001), Powertrain (0x0010), Thermal (0x0020), and BMS (0x0030). I\'ll discover them, verify each one individually, then record a sign-off trace with all four healthy.');
  await wait(400);

  s = spin('Running local bring-up unit tests (1m 36s elapsed, 14× playback)…'); await wait(1600); s.stop();
  command('uv run pytest tests/bringup/test_r07_doip_nodes.py -q', [
    'test_ecu_map_loads PASSED',
    'test_expected_logical_addresses PASSED',
    'test_uds_request_sequences PASSED',
    'test_doip_discovery_format PASSED',
    '7 passed in 96.22s',
  ]);
  await wait(350);

  s = spin('Reading bench DoIP and CAN state…'); await wait(1100); s.stop();
  tool('plotune://device/interfaces', '', 'resource')([
    ['⎿', 'eth0   diagnet   1000baseT   up   leases: 0', 'ok'],
    [' ', 'can0   pt_can    500kbit/s   up   leases: 0', 'ok'],
  ]);
  await wait(300);
  tool('plotune://diagnostics/uds/transports', '', 'resource')([
    ['⎿', 'can_isotp   shipped', 'ok'],
    [' ', 'doip        shipped   outbound DoIP client (ISO 13400)', 'ok'],
  ]);
  await wait(350);
  tool('get_clock_sync_status', '')([
    ['⎿', 'ntp_synced: true   offset: 0.9 ms   stratum: 2', 'ok'],
  ]);
  await wait(350);

  s = spin('Discovering DoIP nodes…'); await wait(1300); s.stop();
  tool('discover_doip_vehicles', 'interface_name="eth0", timeout_seconds=2.0, port=13400, max_results=10')([
    ['⎿', '192.168.10.1   eid: 00:00:00:00:10:01   logical_addresses: [0x0001]   (Gateway)', 'ok'],
    [' ', '192.168.10.2   eid: 00:00:00:00:10:02   logical_addresses: [0x0010]   (Powertrain)', 'ok'],
    [' ', '192.168.10.3   eid: 00:00:00:00:10:03   logical_addresses: [0x0020]   (Thermal)', 'ok'],
    [' ', '192.168.10.4   eid: 00:00:00:00:10:04   logical_addresses: [0x0030]   (BMS)', 'ok'],
  ]);
  await wait(450);
  await prose('All four expected nodes discovered. I\'ll lease each one and fire the VIN + SW version + DTC read in batches.');
  await wait(400);

  // Gateway
  s = spin('Verifying Gateway ECU (0x0001)…'); await wait(1200); s.stop();
  tool('acquire_doip_target_lease', 'target={transport:"doip",host:"192.168.10.1",ecu_logical_address:"0001"}, agent_id="claude", session_id="r07-bringup"')([
    ['⎿', 'status: acquired   lease_id: lease-doip-gw', 'ok'],
  ]);
  await wait(200);
  tool('send_uds_request', 'target={transport:"doip",host:"192.168.10.1",ecu_logical_address:"0001"}, request_hexes=["22F190","22F189","1901FF"], timeout_seconds=2.0')([
    ['⎿', '22F190 → positive   VIN: WDDR07GW0000001', 'ok'],
    [' ', '22F189 → positive   SW: GW_R07_FW_1.4.2', 'ok'],
    [' ', '1901FF → positive   DTC count: 0', 'ok'],
  ]);
  await wait(300);
  tool('release_doip_target_lease', 'target={host:"192.168.10.1",ecu_logical_address:"0001"}, session_id="r07-bringup"')([['⎿', 'released: 192.168.10.1/0001', 'ok']]);
  await wait(280);

  // Powertrain
  s = spin('Verifying Powertrain ECU (0x0010)…'); await wait(1200); s.stop();
  tool('acquire_doip_target_lease', 'target={transport:"doip",host:"192.168.10.2",ecu_logical_address:"0010"}, agent_id="claude", session_id="r07-bringup"')([
    ['⎿', 'status: acquired   lease_id: lease-doip-pt', 'ok'],
  ]);
  await wait(200);
  tool('send_uds_request', 'target={transport:"doip",host:"192.168.10.2",ecu_logical_address:"0010"}, request_hexes=["22F190","22F189","1901FF"], timeout_seconds=2.0')([
    ['⎿', '22F190 → positive   VIN: WDDR07PT0000001', 'ok'],
    [' ', '22F189 → positive   SW: PT_R07_FW_2.1.0', 'ok'],
    [' ', '1901FF → positive   DTC count: 0', 'ok'],
  ]);
  await wait(300);
  tool('release_doip_target_lease', 'target={host:"192.168.10.2",ecu_logical_address:"0010"}, session_id="r07-bringup"')([['⎿', 'released: 192.168.10.2/0010', 'ok']]);
  await wait(280);

  // Thermal
  s = spin('Verifying Thermal ECU (0x0020)…'); await wait(1200); s.stop();
  tool('acquire_doip_target_lease', 'target={transport:"doip",host:"192.168.10.3",ecu_logical_address:"0020"}, agent_id="claude", session_id="r07-bringup"')([
    ['⎿', 'status: acquired   lease_id: lease-doip-th', 'ok'],
  ]);
  await wait(200);
  tool('send_uds_request', 'target={transport:"doip",host:"192.168.10.3",ecu_logical_address:"0020"}, request_hexes=["22F190","22F189","1901FF"], timeout_seconds=2.0')([
    ['⎿', '22F190 → positive   VIN: WDDR07TH0000001', 'ok'],
    [' ', '22F189 → positive   SW: THERMAL_R07_FW_1.2.1', 'ok'],
    [' ', '1901FF → positive   DTC count: 0', 'ok'],
  ]);
  await wait(300);
  tool('release_doip_target_lease', 'target={host:"192.168.10.3",ecu_logical_address:"0020"}, session_id="r07-bringup"')([['⎿', 'released: 192.168.10.3/0020', 'ok']]);
  await wait(280);

  // BMS
  s = spin('Verifying BMS ECU (0x0030)…'); await wait(1200); s.stop();
  tool('acquire_doip_target_lease', 'target={transport:"doip",host:"192.168.10.4",ecu_logical_address:"0030"}, agent_id="claude", session_id="r07-bringup"')([
    ['⎿', 'status: acquired   lease_id: lease-doip-bms', 'ok'],
  ]);
  await wait(200);
  tool('send_uds_request', 'target={transport:"doip",host:"192.168.10.4",ecu_logical_address:"0030"}, request_hexes=["22F190","22F189","1901FF"], timeout_seconds=2.0')([
    ['⎿', '22F190 → positive   VIN: WDDR07BM0000001', 'ok'],
    [' ', '22F189 → positive   SW: BMS_R07_FW_3.0.1', 'ok'],
    [' ', '1901FF → positive   DTC count: 0', 'ok'],
  ]);
  await wait(300);
  tool('release_doip_target_lease', 'target={host:"192.168.10.4",ecu_logical_address:"0030"}, session_id="r07-bringup"')([['⎿', 'released: 192.168.10.4/0030', 'ok']]);
  await wait(400);

  tool('plotune://diagnostics/uds/recent', '', 'resource')([
    ['⎿', '12 exchanges recorded — 4 ECUs × 3 requests   all positive   session: r07-bringup', 'key'],
  ]);
  await wait(350);

  s = spin('Recording sign-off trace on can0…'); await wait(1400); s.stop();
  tool('acquire_can_interface', '"can0", agent_id="claude", session_id="r07-bringup", purpose="signoff-trace"')([
    ['⎿', 'status: acquired   lease_id: lease-can0-r07', 'ok'],
  ]);
  await wait(200);
  tool('record_can', 'channel="can0", duration_seconds=60, interface="socketcan"')([
    ['⎿', 'job_id: record-r07-signoff-can0   status: running', 'key'],
  ]);
  await wait(220);
  tool('wait_for_job', '"record-r07-signoff-can0", timeout_seconds=90')([
    ['⎿', 'completed   artifact: asc-r07-signoff-can0   frames: 31,204', 'ok'],
  ]);
  await wait(300);
  tool('release_can_interface', '"can0", session_id="r07-bringup"')([['⎿', 'released: can0', 'ok']]);
  await wait(300);

  s = spin('Uploading sign-off package…'); await wait(1200); s.stop();
  tool('upload_to_artifact_drive', 'drive_id="customer-sharepoint", local_path="/var/lib/plotune-nexus/recordings/asc-r07-signoff-can0.asc", remote_path="Releases/R07/bringup/signoff-can0.asc"')([
    ['⎿', 'uploaded   provider: sharepoint   bytes: 7.1 MB', 'ok'],
  ]);
  await wait(400);

  await prose('<span class="hl">All four ECUs verified.</span> Gateway, Powertrain, Thermal, and BMS all responded to DoIP discovery, returned consistent VINs, correct SW versions, and zero DTCs.');
  add('gap');
  await prose('<span class="hl">Evidence:</span> 12 UDS exchanges in <span class="cd">plotune://diagnostics/uds/recent</span>, sign-off trace <span class="cd">asc-r07-signoff-can0</span>, and SharePoint R07 bringup folder.');
}

window.DEMO_SCENARIOS = [
  s0_hil_firmware_gate,
  s1_gateway_regression,
  s2_bms_field_triage,
  s3_multinode_doip_handshake,
];
