function readHold(content, options) {
  if (typeof window.pauseForRead === 'function') return window.pauseForRead(content, options);
  return wait(options?.baseMs || 320);
}

async function promptUser(text) {
  if (typeof window.flushRenders === 'function') await window.flushRenders();
  window.__demoPromptCount = (window.__demoPromptCount || 0) + 1;
  const isFollowUpTurn = window.__demoPromptCount > 1;
  add(isFollowUpTurn ? 'gap' : 'gap-lg');
  add('lp', isFollowUpTurn ? '$ follow-up' : '$ codex');
  await wait(isFollowUpTurn ? 180 : 250);
  await typeUser(text);
  add('gap');
  await readHold(text, {
    baseMs: isFollowUpTurn ? 420 : 520,
    perCharMs: isFollowUpTurn ? 3.6 : 4.2,
    capMs: isFollowUpTurn ? 980 : 1180,
  });
}

async function think(label, ms = 950) {
  if (typeof window.flushRenders === 'function') await window.flushRenders();
  const s = spin(`Thinking: ${label}`);
  await wait(Math.max(ms, window.DEMO_PACING?.minThinkMs || 1150));
  await s.stop();
  await readHold(label, { baseMs: 140, perCharMs: 0.45, capMs: 240 });
}

function reviewPanel(title, intro, rows) {
  const clean = (value) => typeof pretty === 'function' ? pretty(value) : String(value);
  const body = rows.map((row) => {
    const text = clean(Array.isArray(row) ? row[0] : row);
    const cls = Array.isArray(row) ? (row[1] || '') : '';
    return `<div class="pr ${esc(cls)}">${esc(text)}</div>`;
  }).join('');
  add('panel', `<div class="pt">${esc(clean(title))}</div><div class="pi">${esc(clean(intro))}</div>${body}`);
}

async function contractScan(_names, rows) {
  await think('I should check the connected Nexus request and response shapes before touching hardware.');
  reviewPanel(
    'Contract check',
    'I am matching the planned bench actions to the fields Nexus expects, so a bad channel, session id, or target shape does not break the run halfway through.',
    rows,
  );
  await readHold(
    rows.map((row) => Array.isArray(row) ? row[0] : row).join(' '),
    { baseMs: 700, perCharMs: 0.45, capMs: 1320 },
  );
}

async function reviewer(name, task, rows) {
  reviewPanel(`Spawned reviewer: ${name}`, task, [['agent status: running', 'key']]);
  await readHold(task, { baseMs: 320, perCharMs: 0.35, capMs: 620 });
  reviewPanel(`Reviewer result: ${name}`, 'Independent check returned:', rows.map((row) => [row, row.startsWith('approved') ? 'ok' : row.startsWith('gap') || row.startsWith('required') ? 'warn' : '']));
  await readHold(rows.join(' '), { baseMs: 520, perCharMs: 0.45, capMs: 980 });
}

async function s0_brake_release_gate() {
  await promptUser('Is the brake ECU ready for release?');

  await contractScan(
    ['start_can_gateway', 'record_can', 'run_test_sequence', 'wait_dbc_signal'],
    [
      ['Gateway: requires two CAN interfaces and per-direction allowlist rule objects; this prevents a broad bridge.', 'key'],
      ['CAN recording: returns job_id and artifact_path for each bus so the checklist can point to real evidence.', ''],
      ['Test sequence: owns the recordings and DBC waits so the pass result and traces come from the same run.', ''],
      ['DBC wait: pressure checks need message, signal, channel, condition, timeout, and hold time.', ''],
    ],
  );

  await reviewer('tool-contract-reviewer', 'check brake release Nexus calls against scanned input and output fields', [
    'approved: gateway rules are object arrays, not ID lists',
    'approved: sequence definition owns evidence recordings and waits on DBC signals',
  ]);
  await reviewer('bench-safety-reviewer', 'check brake bench limits and CAN-to-CAN gateway direction', [
    'approved: CAN-to-CAN only; command return path limited to two brake actuator frames',
    'approved: pressure command cap 85 bar and hold time 500 ms',
  ]);
  await reviewer('evidence-reviewer', 'check release gate evidence required by brake checklist', [
    'gap found: actuator bus recording must cover the ABS enable window',
    'required: two CAN traces, gateway counters, sequence result, checklist PDF',
  ]);

  await think('I need to confirm both CAN interfaces are up and find the release inputs before starting a gateway.');
  tool('list_can_interfaces_tool', '')([
    ['⎿', 'can0   PCAN-USB FD   up   bitrate: 500000   available: true', 'key'],
    [' ', 'can1   Kvaser Leaf   up   bitrate: 500000   available: true', 'key'],
  ]);
  await wait(220);
  tool('list_artifact_drives', '')([
    ['⎿', 'program-share   provider: sharepoint   root: BrakeRelease', 'ok'],
  ]);
  await wait(220);
  tool('search_in_drive', 'drive_id="program-share", query="BRK-219 release gate DBC checklist procedure", remote_path="BRK-219", limit=20')([
    ['⎿', 'BRK-219/network/Brake_CAN_Release.dbc', 'key'],
    [' ', 'BRK-219/procedures/brake_release_gate.json', 'key'],
    [' ', 'BRK-219/checklists/brake_release_gate.pdf', 'key'],
  ]);
  await wait(240);
  tool('download_from_artifact_drive', 'drive_id="program-share", remote_path="BRK-219/network/Brake_CAN_Release.dbc", local_path="/var/lib/plotune-nexus/data/Brake_CAN_Release.dbc", overwrite=true')([
    ['⎿', 'downloaded   bytes: 184 KB   sha256: 23f8a4b7...', 'ok'],
  ]);

  await think('The interfaces are available, so I can start a narrow CAN-to-CAN gateway and record both sides.');
  tool('start_can_gateway', 'source_interface="can0", destination_interface="can1", bus_interface="socketcan", source_to_destination_rules=[{"rule_id":"brake-status","arbitration_id":"181","is_extended_id":false},{"rule_id":"wheel-speed","arbitration_id":"182","is_extended_id":false},{"rule_id":"pedal-request","arbitration_id":"301","is_extended_id":false}], destination_to_source_rules=[{"rule_id":"actuator-ack","arbitration_id":"201","is_extended_id":false},{"rule_id":"pressure-feedback","arbitration_id":"202","is_extended_id":false}], max_runtime_seconds=900, metadata={"case":"BRK-219-release-gate"}')([
    ['⎿', 'job_id: gw-brk-219   status: running   source: can0   destination: can1', 'ok'],
    [' ', 'source_to_destination_rules: 3   destination_to_source_rules: 2', 'key'],
  ]);
  await wait(220);
  tool('record_can', 'channel="can0", duration_seconds=300, interface="socketcan", bitrate=500000')([
    ['⎿', 'job_id: rec-brk-can0   status: running   artifact_path: /var/lib/plotune-nexus/recordings/brk-can0.asc', 'ok'],
  ]);
  await wait(180);
  tool('record_can', 'channel="can1", duration_seconds=300, interface="socketcan", bitrate=500000')([
    ['⎿', 'job_id: rec-brk-can1   status: running   artifact_path: /var/lib/plotune-nexus/recordings/brk-can1.asc', 'ok'],
  ]);

  await think('Before judging release, I need live signal waits and recordings from the same run.', 1200);
  tool('run_test_sequence', 'definition={"recordings":[{"id":"ecu-bus","protocol":"can","channel":"can0","duration_seconds":300},{"id":"actuator-bus","protocol":"can","channel":"can1","duration_seconds":300}],"steps":[{"id":"start-ecu-recording","type":"start_recording","target":{"kind":"recording","recording_id":"ecu-bus"}},{"id":"start-actuator-recording","type":"start_recording","target":{"kind":"recording","recording_id":"actuator-bus"}},{"id":"wait-pressure-ready","type":"wait_dbc_signal","target":{"kind":"dbc_signal","dbc_file_path":"/var/lib/plotune-nexus/data/Brake_CAN_Release.dbc","message_name":"BrakeStatus","signal_name":"PressureReady","channel":"can0"},"condition":{"operator":">=","value":1},"timeout_seconds":20},{"id":"apply-release-stop","type":"send_dbc_message","target":{"kind":"dbc_message","dbc_file_path":"/var/lib/plotune-nexus/data/Brake_CAN_Release.dbc","message_name":"BrakeCommand","channel":"can0","signal_values":{"TargetPressureBar":80,"ABSRequest":1}}},{"id":"wait-actuator-ack","type":"wait_dbc_signal","target":{"kind":"dbc_signal","dbc_file_path":"/var/lib/plotune-nexus/data/Brake_CAN_Release.dbc","message_name":"ActuatorFeedback","signal_name":"PressureActualBar","channel":"can1"},"condition":{"operator":"within_band","lower_bound":77,"upper_bound":83},"hold_time_seconds":0.5,"timeout_seconds":10},{"id":"stop-actuator-recording","type":"stop_recording","target":{"kind":"recording","recording_id":"actuator-bus"}},{"id":"stop-ecu-recording","type":"stop_recording","target":{"kind":"recording","recording_id":"ecu-bus"}}],"metadata":{"case":"BRK-219-release-gate"}}')([
    ['⎿', 'job_id: seq-brk-219   status: running   steps: 7   recordings: 2', 'ok'],
  ]);
  await wait(240);
  tool('wait_for_test_sequence', 'job_id="seq-brk-219", timeout_seconds=420, poll_interval_seconds=1.0')([
    ['⎿', 'status: completed   related_artifact_ids: brk-can0-asc, brk-can1-asc', 'ok'],
    [' ', 'step wait-actuator-ack: matched   signal_value: 80.4', 'key'],
  ]);
  await wait(220);
  tool('get_can_gateway', 'job_id="gw-brk-219"')([
    ['⎿', 'status: running   forwarded_frame_count: 42618   dropped_frame_count: 93110', 'ok'],
    [' ', 'source_to_destination_forwarded_count: 39224   destination_to_source_forwarded_count: 3394', 'key'],
  ]);
  await wait(220);
  tool('stop_can_gateway', 'job_id="gw-brk-219", wait_timeout_seconds=1.0')([
    ['⎿', 'stopped: true   status: cancelled', 'ok'],
  ]);

  await promptUser('Rerun the missing actuator-bus evidence.');

  await think('The main run passed, but the checklist needs a cleaner actuator-bus window.');
  tool('record_can', 'channel="can1", duration_seconds=90, interface="socketcan", bitrate=500000')([
    ['⎿', 'job_id: rec-brk-actuator-rerun   status: running   artifact_path: /var/lib/plotune-nexus/recordings/brk-actuator-rerun.asc', 'ok'],
  ]);
  await wait(180);
  tool('wait_dbc_signal', 'dbc_file_path="/var/lib/plotune-nexus/data/Brake_CAN_Release.dbc", message_name="ActuatorFeedback", signal_name="PressureActualBar", operator="within_band", lower_bound=77, upper_bound=83, timeout_seconds=12, channel="can1", interface="socketcan", hold_time_seconds=0.5')([
    ['⎿', 'matched: true   signal_value: 80.1   sample_count: 38   elapsed_seconds: 3.4', 'ok'],
  ]);
  await wait(180);
  tool('wait_for_job', 'job_id="rec-brk-actuator-rerun", timeout_seconds=120, poll_interval_seconds=1.0')([
    ['⎿', 'status: completed   artifact_path: /var/lib/plotune-nexus/recordings/brk-actuator-rerun.asc   bytes_written: 12801472', 'ok'],
  ]);

  await promptUser('Have someone else check the gateway rules.');

  await reviewer('gateway-rule-reviewer', 'independent check of BRK-219 gateway allowlists and counters', [
    'approved: no transparent bridge; each direction has explicit frame IDs',
    'approved: dropped counts are expected non-allowlisted traffic',
  ]);

  await promptUser('Give me the release checklist.');

  await think('Now I can assemble the checklist from verified gateway counters and trace evidence.');
  tool('upload_to_artifact_drive', 'drive_id="program-share", local_path="/var/lib/plotune-nexus/recordings/brk-actuator-rerun.asc", remote_path="BRK-219/evidence/actuator-bus-rerun.asc", overwrite=true')([
    ['⎿', 'uploaded   bytes: 12.8 MB', 'ok'],
  ]);
  await wait(220);
  command('build_brake_release_checklist --case BRK-219 --sequence seq-brk-219 --gateway gw-brk-219 --out BRK-219_release_checklist.pdf', [
    'checks: 18 passed, 0 blocked',
    'evidence: ecu-bus trace, actuator-bus trace, gateway counters, DBC signal waits',
    'decision: ready for release gate review',
  ]);
  await wait(260);
  await prose('<span class="hl">Brake ECU release gate passed.</span> The rerun filled the actuator-bus evidence gap, and the independent gateway review confirmed the CAN-to-CAN allowlists stayed narrow.');
}

async function s1_inverter_calibration() {
  await promptUser('Why did the current-limit gate nearly fail?');

  await contractScan(
    ['record_xcp', 'read_xcp_calibration', 'set_xcp_job_calibration', 'record_can', 'run_test_sequence'],
    [
      ['XCP DAQ: needs trusted A2L and LAB paths before live measurements can be trusted.', 'key'],
      ['Calibration readback: confirms the current derate value before any write.', ''],
      ['Live calibration write: must reuse the active XCP DAQ job_id so a second master does not collide.', ''],
      ['CAN recording: captures the dyno request and ECU response beside the MF4 evidence.', ''],
      ['Test sequence: drives the current request while the active XCP session supplies live margin checks.', ''],
    ],
  );

  await reviewer('xcp-contract-reviewer', 'validate XCP DAQ and calibration calls for INV-0426', [
    'approved: live calibration writes reuse the active record_xcp job_id',
    'approved: A2L and LAB are passed as trusted device paths',
  ]);
  await reviewer('calibration-safety-reviewer', 'check allowed range for current-limit change', [
    'approved: proposed value must stay between 420 A and 435 A',
    'approved: restore point captured before write',
  ]);
  await reviewer('evidence-reviewer', 'compare near-fail and rerun evidence requirements', [
    'required: MF4 DAQ, CAN trace, sequence result, readback before and after',
    'acceptance: no negative torque intervention and margin >= 6 A',
  ]);

  await think('I need the calibration files, measurement list, and prior gate evidence before reading the ECU.');
  tool('list_artifact_drives', '')([
    ['⎿', 'program-share   provider: sharepoint   root: InverterRelease', 'ok'],
  ]);
  await wait(200);
  tool('search_in_drive', 'drive_id="program-share", query="INV-0426 current limit A2L LAB DBC gate", remote_path="INV-0426", limit=30')([
    ['⎿', 'INV-0426/cal/INV_0426.a2l', 'key'],
    [' ', 'INV-0426/cal/current_limit_gate.lab', 'key'],
    [' ', 'INV-0426/network/INV_CAN_500k.dbc', 'key'],
    [' ', 'INV-0426/evidence/near-fail-current-limit.mf4', 'key'],
  ]);
  await wait(220);
  tool('download_from_artifact_drive', 'drive_id="program-share", remote_path="INV-0426/cal/INV_0426.a2l", local_path="/var/lib/plotune-nexus/data/INV_0426.a2l", overwrite=true')([
    ['⎿', 'downloaded   bytes: 2.8 MB   sha256: d6c941a2...', 'ok'],
  ]);
  await wait(180);
  tool('download_from_artifact_drive', 'drive_id="program-share", remote_path="INV-0426/cal/current_limit_gate.lab", local_path="/var/lib/plotune-nexus/data/current_limit_gate.lab", overwrite=true')([
    ['⎿', 'downloaded   bytes: 3 KB   sha256: 81efda09...', 'ok'],
  ]);
  await wait(180);
  tool('download_from_artifact_drive', 'drive_id="program-share", remote_path="INV-0426/network/INV_CAN_500k.dbc", local_path="/var/lib/plotune-nexus/data/INV_CAN_500k.dbc", overwrite=true')([
    ['⎿', 'downloaded   bytes: 211 KB   sha256: 6ca922f1...', 'ok'],
  ]);

  await think('I should capture the current value and start DAQ before I change any calibration.');
  tool('read_xcp_calibration', 'a2l_file_path="/var/lib/plotune-nexus/data/INV_0426.a2l", calibration_name="CurrLimit_DerateStart_A", channel="can0", interface="socketcan", bitrate=500000')([
    ['⎿', 'calibration_name: CurrLimit_DerateStart_A   value: 438   verified: true', 'key'],
  ]);
  await wait(200);
  tool('record_xcp', 'lab_file_path="/var/lib/plotune-nexus/data/current_limit_gate.lab", a2l_file_path="/var/lib/plotune-nexus/data/INV_0426.a2l", channel="can0", duration_seconds=160, interface="socketcan", bitrate=500000, event_channel=0, artifact_format="mf4"')([
    ['⎿', 'job_id: xcp-inv-0426-live   status: running   measurement_count: 12   capture_mode: daq', 'ok'],
  ]);
  await wait(200);
  tool('record_can', 'channel="can0", duration_seconds=160, interface="socketcan", bitrate=500000')([
    ['⎿', 'job_id: can-inv-0426-live   status: running   artifact_path: /var/lib/plotune-nexus/recordings/inv-current-limit.asc', 'ok'],
  ]);

  await think('Now I need to reproduce the near-fail at the current value before trying a safer one.', 1300);
  tool('run_test_sequence', 'definition={"recordings":[{"id":"can-trace","protocol":"can","channel":"can0","duration_seconds":160}],"steps":[{"id":"start-can","type":"start_recording","target":{"kind":"recording","recording_id":"can-trace"}},{"id":"read-limit","type":"wait_measurement","target":{"kind":"xcp_measurement","a2l_file_path":"/var/lib/plotune-nexus/data/INV_0426.a2l","measurement_name":"CurrentLimitMargin_A","channel":"can0"},"condition":{"operator":">=","value":0},"timeout_seconds":8},{"id":"apply-current-step","type":"send_dbc_message","target":{"kind":"dbc_message","dbc_file_path":"/var/lib/plotune-nexus/data/INV_CAN_500k.dbc","message_name":"DynoCurrentRequest","channel":"can0","signal_values":{"CurrentRequestA":430}}},{"id":"wait-margin","type":"wait_measurement","target":{"kind":"xcp_measurement","a2l_file_path":"/var/lib/plotune-nexus/data/INV_0426.a2l","measurement_name":"CurrentLimitMargin_A","channel":"can0"},"condition":{"operator":">=","value":2},"hold_time_seconds":0.3,"timeout_seconds":20},{"id":"stop-can","type":"stop_recording","target":{"kind":"recording","recording_id":"can-trace"}}],"metadata":{"case":"INV-0426-current-limit"}}')([
    ['⎿', 'job_id: seq-inv-0426-base   status: running   steps: 5', 'ok'],
  ]);
  await wait(220);
  tool('wait_for_test_sequence', 'job_id="seq-inv-0426-base", timeout_seconds=240, poll_interval_seconds=1.0')([
    ['⎿', 'status: completed   minimum CurrentLimitMargin_A: 2.4', 'warn'],
    [' ', 'near-fail reason: derate start set 3 A above the approved gate window', 'warn'],
  ]);

  await promptUser('Try the safer value.');

  await think('The margin is too close, so I should apply only the bounded value through the active XCP job.');
  tool('set_xcp_job_calibration', 'job_id="xcp-inv-0426-live", calibration_name="CurrLimit_DerateStart_A", value=428, timeout_seconds=5.0')([
    ['⎿', 'job_id: xcp-inv-0426-live   value: 428   verified: true', 'ok'],
  ]);
  await wait(220);
  tool('run_test_sequence', 'definition={"recordings":[{"id":"can-rerun","protocol":"can","channel":"can0","duration_seconds":120}],"steps":[{"id":"start-can-rerun","type":"start_recording","target":{"kind":"recording","recording_id":"can-rerun"}},{"id":"apply-current-step","type":"send_dbc_message","target":{"kind":"dbc_message","dbc_file_path":"/var/lib/plotune-nexus/data/INV_CAN_500k.dbc","message_name":"DynoCurrentRequest","channel":"can0","signal_values":{"CurrentRequestA":430}}},{"id":"wait-new-margin","type":"wait_measurement","target":{"kind":"xcp_measurement","a2l_file_path":"/var/lib/plotune-nexus/data/INV_0426.a2l","measurement_name":"CurrentLimitMargin_A","channel":"can0"},"condition":{"operator":">=","value":6},"hold_time_seconds":0.5,"timeout_seconds":20},{"id":"stop-can-rerun","type":"stop_recording","target":{"kind":"recording","recording_id":"can-rerun"}}],"metadata":{"case":"INV-0426-current-limit-rerun"}}')([
    ['⎿', 'job_id: seq-inv-0426-rerun   status: running   steps: 4', 'ok'],
  ]);
  await wait(220);
  tool('wait_for_test_sequence', 'job_id="seq-inv-0426-rerun", timeout_seconds=180, poll_interval_seconds=1.0')([
    ['⎿', 'status: completed   minimum CurrentLimitMargin_A: 8.7   related_artifact_ids: inv-rerun-asc', 'ok'],
  ]);

  await promptUser('Have another agent verify the XCP calls.');

  await reviewer('second-xcp-reviewer', 'independent verification of INV-0426 XCP read/write/record flow', [
    'approved: write used set_xcp_job_calibration with active DAQ job',
    'approved: readback verified value 428 A and rerun met the 6 A margin',
  ]);

  await promptUser('Write the calibration note.');

  await think('The rerun has enough margin; now I should package the readback and evidence into a calibration note.');
  tool('wait_for_job', 'job_id="xcp-inv-0426-live", timeout_seconds=180, poll_interval_seconds=1.0')([
    ['⎿', 'status: completed   artifact_path: /var/lib/plotune-nexus/recordings/inv-current-limit.mf4   bytes_written: 42090496', 'ok'],
  ]);
  await wait(180);
  tool('wait_for_job', 'job_id="can-inv-0426-live", timeout_seconds=180, poll_interval_seconds=1.0')([
    ['⎿', 'status: completed   artifact_path: /var/lib/plotune-nexus/recordings/inv-current-limit.asc   bytes_written: 18820414', 'ok'],
  ]);
  await wait(220);
  command('write_calibration_note --case INV-0426 --before 438 --after 428 --evidence seq-inv-0426-base,seq-inv-0426-rerun --out INV-0426_current_limit_note.pdf', [
    'created INV-0426_current_limit_note.pdf',
    'decision: accept 428 A pending calibration board approval',
  ]);
  await wait(220);
  tool('upload_to_artifact_drive', 'drive_id="program-share", local_path="INV-0426_current_limit_note.pdf", remote_path="INV-0426/reports/INV-0426_current_limit_note.pdf", overwrite=true')([
    ['⎿', 'uploaded   bytes: 884 KB', 'ok'],
  ]);
  await wait(260);
  await prose('<span class="hl">Current-limit gate explained.</span> The original value left only <span class="cd">2.4 A</span> of margin; the bounded change to <span class="cd">428 A</span> raised the rerun margin to <span class="cd">8.7 A</span> with verified XCP readback.');
}

async function s2_charger_restart_fault() {
  await promptUser('Can you reproduce the charger warm-restart trip?');

  await contractScan(
    ['send_uart', 'record_uart', 'wait_uart', 'record_can', 'send_uds_request', 'run_test_sequence'],
    [
      ['UART session: I need an open session_id before I can send the restart command, wait for console text, or record the log.', 'key'],
      ['CAN capture: the SLCAN channel and bitrate must be confirmed before recording the charger frames.', ''],
      ['UDS read: the DTC request needs a CAN ISO-TP target with channel, tx_id, rx_id, and normal addressing.', ''],
      ['Procedure run: the sequence will own CAN evidence and DTC reads while the direct UART session captures console text.', ''],
    ],
  );

  await reviewer('uart-uds-type-reviewer', 'validate charger UART and UDS request shapes', [
    'approved: UART waits use mode="text" with value field',
    'approved: UDS target uses can_isotp with normal addressing',
  ]);
  await reviewer('trace-correlation-reviewer', 'plan charger console, CAN, and DTC correlation', [
    'approved: align FAULT_LATCHED console line with CAN charge-state frame',
    'approved: read DTCs after the trip, not before',
  ]);
  await reviewer('report-reviewer', 'check service report evidence requirements', [
    'required: UART text artifact, CAN ASC, UDS DTC batch, repeated failing window',
    'required: technician-facing cause and next action',
  ]);

  await think('I need to check the attached CAN and UART paths before I try to reproduce the charger trip.');
  tool('list_can_interfaces_tool', '')([
    ['⎿', 'slcan0   USB-CAN adapter   up   bitrate: 500000   available: true', 'key'],
  ]);
  await wait(200);
  tool('list_uart_devices', '')([
    ['⎿', '/dev/ttyUSB0   charger console   trusted: true', 'key'],
  ]);
  await wait(200);
  tool('list_uds_transports', '')([
    ['⎿', 'can_isotp   available   required target fields: channel, tx_id, rx_id', 'ok'],
    [' ', 'doip        available   coordinated through target leases when used', ''],
  ]);
  await wait(220);
  tool('search_in_drive', 'drive_id="program-share", query="charger warm restart DBC procedure", remote_path="CHG-77", limit=20')([
    ['⎿', 'CHG-77/network/Charger_CAN.dbc', 'key'],
    [' ', 'CHG-77/procedures/warm_restart_trip.json', 'key'],
  ]);
  await wait(180);
  tool('download_from_artifact_drive', 'drive_id="program-share", remote_path="CHG-77/network/Charger_CAN.dbc", local_path="/var/lib/plotune-nexus/data/Charger_CAN.dbc", overwrite=true')([
    ['⎿', 'downloaded   bytes: 147 KB   sha256: 1ce45a99...', 'ok'],
  ]);

  await think('The adapters are present, so I should start console and CAN capture before triggering the restart.');
  tool('open_uart_session', 'device_path="/dev/ttyUSB0", baud_rate=115200, data_bits=8, parity="none", stop_bits=1, flow_control="none", read_timeout_seconds=0.2, line_ending="\\n", encoding="utf-8"')([
    ['⎿', 'session_id: uart-charger-console   status: open   device_path: /dev/ttyUSB0', 'ok'],
  ]);
  await wait(180);
  tool('record_uart', 'session_id="uart-charger-console", duration_seconds=180, artifact_format="txt"')([
    ['⎿', 'job_id: uart-chg-77   status: running   artifact_path: /var/lib/plotune-nexus/recordings/charger-console.txt', 'ok'],
  ]);
  await wait(180);
  tool('record_can', 'channel="slcan0", duration_seconds=180, interface="socketcan", bitrate=500000')([
    ['⎿', 'job_id: can-chg-77   status: running   artifact_path: /var/lib/plotune-nexus/recordings/charger-warm-restart.asc', 'ok'],
  ]);

  await think('With capture running, I can trigger the warm restart and wait for the fault before reading DTCs.', 1300);
  tool('send_uart', 'session_id="uart-charger-console", mode="text", text="warm_restart now", append_line_ending=true')([
    ['⎿', 'sent: true   bytes_written: 17', 'ok'],
  ]);
  await wait(180);
  tool('wait_uart', 'session_id="uart-charger-console", mode="text", operator="contains", value="FAULT_LATCHED", timeout_seconds=60, hold_time_seconds=0.0')([
    ['⎿', 'matched: true   bytes_read: 1884   elapsed_seconds: 22.4', 'warn'],
  ]);
  await wait(180);
  tool('run_test_sequence', 'definition={"recordings":[{"id":"can-window","protocol":"can","channel":"slcan0","duration_seconds":180}],"steps":[{"id":"start-can","type":"start_recording","target":{"kind":"recording","recording_id":"can-window"}},{"id":"wait-precharge-delta","type":"wait_dbc_signal","target":{"kind":"dbc_signal","dbc_file_path":"/var/lib/plotune-nexus/data/Charger_CAN.dbc","message_name":"ChargerStatus","signal_name":"PrechargeDeltaV","channel":"slcan0"},"condition":{"operator":">","value":25},"hold_time_seconds":0.2,"timeout_seconds":45},{"id":"read-dtc-after-trip","type":"send_uds_request","target":{"kind":"uds_request","transport":"can_isotp","channel":"slcan0","tx_id":"7E0","rx_id":"7E8","addressing_mode":"normal"},"request_hexes":["1902FF"],"expectations":[{"outcome":"positive_response","response_service_id":"59"}]},{"id":"stop-can","type":"stop_recording","target":{"kind":"recording","recording_id":"can-window"}}],"metadata":{"case":"CHG-77-warm-restart"}}')([
    ['⎿', 'job_id: seq-chg-77   status: running   steps: 4', 'ok'],
  ]);
  await wait(220);
  tool('wait_for_test_sequence', 'job_id="seq-chg-77", timeout_seconds=240, poll_interval_seconds=1.0')([
    ['⎿', 'status: completed   related_artifact_ids: chg-warm-can-asc', 'ok'],
    [' ', 'step wait-precharge-delta: matched   signal_value: 47.6', 'warn'],
  ]);

  await promptUser('Rerun just the failing window.');

  await think('The broad run reproduced it; now I should collect a shorter window around the failing condition.');
  tool('record_can', 'channel="slcan0", duration_seconds=45, interface="socketcan", bitrate=500000')([
    ['⎿', 'job_id: can-chg-77-window   status: running   artifact_path: /var/lib/plotune-nexus/recordings/charger-trip-window.asc', 'ok'],
  ]);
  await wait(180);
  tool('record_uart', 'session_id="uart-charger-console", duration_seconds=45, artifact_format="txt"')([
    ['⎿', 'job_id: uart-chg-77-window   status: running   artifact_path: /var/lib/plotune-nexus/recordings/charger-trip-window.txt', 'ok'],
  ]);
  await wait(180);
  tool('wait_dbc_signal', 'dbc_file_path="/var/lib/plotune-nexus/data/Charger_CAN.dbc", message_name="ChargerStatus", signal_name="PrechargeDeltaV", operator=">", value=25, timeout_seconds=45, channel="slcan0", interface="socketcan", hold_time_seconds=0.2')([
    ['⎿', 'matched: true   signal_value: 47.6   sample_count: 12', 'warn'],
  ]);

  await promptUser('Read the DTCs after it trips.');

  await think('The trip is present, so the useful DTC read is the post-fault snapshot.');
  tool('send_uds_request', 'target={"transport":"can_isotp","channel":"slcan0","tx_id":"7E0","rx_id":"7E8","addressing_mode":"normal"}, request_hexes=["1902FF","22F190"], timeout_seconds=2.0, wait_for_response=true')([
    ['⎿', 'batch_id: uds-chg-77   request_count: 2   transport: can_isotp', 'ok'],
    [' ', '1902FF -> positive_response   response_service_id: 59   dtc: P0D67:28', 'warn'],
    [' ', '22F190 -> positive_response   VIN: 7F3CHG77A6R042118', 'key'],
  ]);

  await promptUser('Make a service report.');

  await think('Now I can correlate console, CAN, and DTC evidence instead of guessing from one trace.');
  command('correlate_charger_trip --can can-chg-77-window --uart uart-chg-77-window --uds uds-chg-77 --dbc Charger_CAN.dbc', [
    'fault window: 22.184s to 22.432s',
    'PrechargeDeltaV: 47.6 V against 25.0 V limit',
    'DTC: P0D67:28 matched after reproduced trip',
  ]);
  await wait(220);
  command('write_service_report --case CHG-77 --correlation charger-trip-correlation.json --out CHG-77_service_report.pdf', [
    'created CHG-77_service_report.pdf',
    'root cause: warm restart enters precharge while bus delta remains above limit',
  ]);
  await wait(220);
  tool('upload_to_artifact_drive', 'drive_id="program-share", local_path="CHG-77_service_report.pdf", remote_path="CHG-77/reports/CHG-77_service_report.pdf", overwrite=true')([
    ['⎿', 'uploaded   bytes: 1.1 MB', 'ok'],
  ]);
  await wait(260);
  await prose('<span class="hl">Fault reproduced.</span> The charger latched <span class="cd">P0D67:28</span> when precharge delta stayed at <span class="cd">47.6 V</span>, and the narrow CAN/UART window backs the service report.');
}

async function s3_endurance_container_signoff() {
  await promptUser('Check the endurance anomaly before signoff.');

  await contractScan(
    ['start_container', 'get_container_status', 'record_can', 'record_uart', 'run_test_sequence', 'stop_container'],
    [
      ['Container start: must use the imported OCI artifact_id and request only the CAN and serial devices this monitor needs.', 'key'],
      ['Status check: confirms the monitor is actually running before DAQ capture starts.', ''],
      ['DAQ capture: CAN and UART recordings provide raw evidence independent of the container logs.', ''],
      ['Focused sequence: waits on DBC signals from the anomaly window and returns related artifact IDs.', ''],
      ['Container stop: closes the managed lifecycle before the signoff addendum is published.', ''],
    ],
  );

  await reviewer('container-config-reviewer', 'check R42 endurance container access request', [
    'approved: artifact_id comes from put_artifact, not the transfer id',
    'approved: CAN access is explicit and serial access is limited to one trusted device',
  ]);
  await reviewer('baseline-reviewer', 'check R42 anomaly against prior release baseline plan', [
    'approved: compare the same 20 minute thermal window and same DBC signals',
    'approved: no signoff claim until container is stopped and evidence is uploaded',
  ]);
  await reviewer('evidence-pack-reviewer', 'check signoff addendum evidence pack', [
    'required: imported container artifact, container status, CAN traces, UART log, sequence result, baseline delta',
  ]);

  await think('I need the baseline, DBC, procedure, and container package before touching the endurance bench.');
  tool('search_in_drive', 'drive_id="program-share", query="R42 endurance anomaly R41 baseline monitor oci", remote_path="Endurance", limit=30')([
    ['⎿', 'Endurance/R41/baseline/R41_thermal_window.json', 'key'],
    [' ', 'Endurance/R42/inputs/R42_Endurance_CAN.dbc', 'key'],
    [' ', 'Endurance/R42/containers/r42-endurance-monitor.oci.tar', 'key'],
    [' ', 'Endurance/R42/procedures/focused_anomaly_window.json', 'key'],
  ]);
  await wait(200);
  tool('download_from_artifact_drive', 'drive_id="program-share", remote_path="Endurance/R42/inputs/R42_Endurance_CAN.dbc", local_path="/var/lib/plotune-nexus/data/R42_Endurance_CAN.dbc", overwrite=true')([
    ['⎿', 'downloaded   bytes: 244 KB   sha256: 7d42f9a1...', 'ok'],
  ]);
  await wait(180);
  tool('download_from_artifact_drive', 'drive_id="program-share", remote_path="Endurance/R41/baseline/R41_thermal_window.json", local_path="/var/lib/plotune-nexus/data/R41_thermal_window.json", overwrite=true')([
    ['⎿', 'downloaded   bytes: 78 KB   sha256: 4c2b8e17...', 'ok'],
  ]);

  await think('I should import the OCI tar and use the returned artifact ID, not start from a file name.');
  tool('prepare_put_artifact', 'file_name="r42-endurance-monitor.oci.tar", size=187432960, sha256="651d7b40f2a838e14a8dd21d5b8b7b912f8c7bca6b51d35a2f7fdc44c0986c1a", content_type="application/vnd.oci.image.layer.v1.tar", folder_name="containers"')([
    ['⎿', 'transfer_id: put-r42-monitor   status: prepared   upload_method: PUT   expires_in: 900', 'key'],
  ]);
  await wait(200);
  command('upload_container_tar --transfer put-r42-monitor --source Endurance/R42/containers/r42-endurance-monitor.oci.tar', [
    'uploaded bytes: 187432960',
    'sha256 verified: 651d7b40f2a838e14a8dd21d5b8b7b912f8c7bca6b51d35a2f7fdc44c0986c1a',
  ]);
  await wait(200);
  tool('put_artifact', 'transfer_id="put-r42-monitor"')([
    ['⎿', 'status: completed   artifact_id: ctr-r42-endurance-monitor   path: /var/lib/plotune-nexus/containers/r42-endurance-monitor.oci.tar', 'ok'],
  ]);

  await think('The container artifact is ready; I should start it with explicit device access and verify status.');
  tool('start_container', 'name="r42-endurance-monitor", artifact_id="ctr-r42-endurance-monitor", command="/app/monitor", args=["--window","thermal-pump"], env={"RUN_ID":"R42-endurance-signoff"}, volumes=[{"name":"evidence","mount_path":"/work/evidence","read_only":false}], can_interfaces=["can0","can1"], serial_devices=["/dev/ttyUSB1"], network_mode="host", max_runtime_seconds=7200, metadata={"case":"R42-endurance-signoff"}')([
    ['⎿', 'job_id: ctr-job-r42-monitor   name: r42-endurance-monitor   status: running', 'ok'],
    [' ', 'can_interfaces: can0, can1   serial_devices: /dev/ttyUSB1   network_mode: host', 'key'],
  ]);
  await wait(220);
  tool('get_container_status', 'container_id_or_name="r42-endurance-monitor"')([
    ['⎿', 'status: running   recent_log_lines: monitor ready; waiting for focused window trigger', 'ok'],
  ]);
  await wait(200);
  tool('open_uart_session', 'device_path="/dev/ttyUSB1", baud_rate=115200, data_bits=8, parity="none", stop_bits=1, flow_control="none", read_timeout_seconds=0.2, line_ending="\\n", encoding="utf-8"')([
    ['⎿', 'session_id: uart-endurance-bms   status: open   device_path: /dev/ttyUSB1', 'ok'],
  ]);
  await wait(180);
  tool('record_can', 'channel="can0", duration_seconds=1200, interface="socketcan", bitrate=500000')([
    ['⎿', 'job_id: can-r42-powertrain-window   status: running   artifact_path: /var/lib/plotune-nexus/recordings/r42-powertrain-window.asc', 'ok'],
  ]);
  await wait(180);
  tool('record_can', 'channel="can1", duration_seconds=1200, interface="socketcan", bitrate=500000')([
    ['⎿', 'job_id: can-r42-thermal-window   status: running   artifact_path: /var/lib/plotune-nexus/recordings/r42-thermal-window.asc', 'ok'],
  ]);
  await wait(180);
  tool('record_uart', 'session_id="uart-endurance-bms", duration_seconds=1200, artifact_format="txt"')([
    ['⎿', 'job_id: uart-r42-bms-window   status: running   artifact_path: /var/lib/plotune-nexus/recordings/r42-bms-window.txt', 'ok'],
  ]);

  await think('The monitor is healthy, so I can capture the focused window with the signoff DBC signals.', 1300);
  tool('run_test_sequence', 'definition={"recordings":[{"id":"powertrain","protocol":"can","channel":"can0","duration_seconds":1200},{"id":"thermal","protocol":"can","channel":"can1","duration_seconds":1200}],"steps":[{"id":"start-powertrain","type":"start_recording","target":{"kind":"recording","recording_id":"powertrain"}},{"id":"start-thermal","type":"start_recording","target":{"kind":"recording","recording_id":"thermal"}},{"id":"wait-pump-rise","type":"wait_dbc_signal","target":{"kind":"dbc_signal","dbc_file_path":"/var/lib/plotune-nexus/data/R42_Endurance_CAN.dbc","message_name":"ThermalStatus","signal_name":"PumpDutyPct","channel":"can1"},"condition":{"operator":">=","value":78},"hold_time_seconds":2.0,"timeout_seconds":180},{"id":"wait-current-stable","type":"wait_dbc_signal","target":{"kind":"dbc_signal","dbc_file_path":"/var/lib/plotune-nexus/data/R42_Endurance_CAN.dbc","message_name":"PowertrainStatus","signal_name":"DcCurrentA","channel":"can0"},"condition":{"operator":"within_band","lower_bound":112,"upper_bound":120},"hold_time_seconds":3.0,"timeout_seconds":180},{"id":"stop-thermal","type":"stop_recording","target":{"kind":"recording","recording_id":"thermal"}},{"id":"stop-powertrain","type":"stop_recording","target":{"kind":"recording","recording_id":"powertrain"}}],"metadata":{"case":"R42-endurance-anomaly"}}')([
    ['⎿', 'job_id: seq-r42-endurance-window   status: running   steps: 6', 'ok'],
  ]);
  await wait(220);
  tool('wait_for_test_sequence', 'job_id="seq-r42-endurance-window", timeout_seconds=1500, poll_interval_seconds=2.0')([
    ['⎿', 'status: completed   related_artifact_ids: r42-powertrain-asc, r42-thermal-asc', 'ok'],
    [' ', 'PumpDutyPct p95: 81.4   DcCurrentA band: 112.8..119.2', 'key'],
  ]);
  await wait(200);
  tool('get_container_status', 'container_id_or_name="r42-endurance-monitor"')([
    ['⎿', 'status: running   recent_log_lines: window complete; evidence checks passed', 'ok'],
  ]);
  await wait(200);
  tool('stop_container', 'container_id_or_name="r42-endurance-monitor", wait_timeout_seconds=3.0')([
    ['⎿', 'stopped: true   name: r42-endurance-monitor   status: cancelled', 'ok'],
  ]);

  await promptUser('Rerun just the failing window.');

  await think('The first window completed; I should rerun only that window to check repeatability.');
  tool('run_test_sequence', 'definition={"recordings":[{"id":"thermal-rerun","protocol":"can","channel":"can1","duration_seconds":300},{"id":"powertrain-rerun","protocol":"can","channel":"can0","duration_seconds":300}],"steps":[{"id":"start-thermal-rerun","type":"start_recording","target":{"kind":"recording","recording_id":"thermal-rerun"}},{"id":"start-powertrain-rerun","type":"start_recording","target":{"kind":"recording","recording_id":"powertrain-rerun"}},{"id":"wait-pump-rise-rerun","type":"wait_dbc_signal","target":{"kind":"dbc_signal","dbc_file_path":"/var/lib/plotune-nexus/data/R42_Endurance_CAN.dbc","message_name":"ThermalStatus","signal_name":"PumpDutyPct","channel":"can1"},"condition":{"operator":">=","value":78},"hold_time_seconds":2.0,"timeout_seconds":120},{"id":"wait-current-stable-rerun","type":"wait_dbc_signal","target":{"kind":"dbc_signal","dbc_file_path":"/var/lib/plotune-nexus/data/R42_Endurance_CAN.dbc","message_name":"PowertrainStatus","signal_name":"DcCurrentA","channel":"can0"},"condition":{"operator":"within_band","lower_bound":112,"upper_bound":120},"hold_time_seconds":3.0,"timeout_seconds":120},{"id":"stop-powertrain-rerun","type":"stop_recording","target":{"kind":"recording","recording_id":"powertrain-rerun"}},{"id":"stop-thermal-rerun","type":"stop_recording","target":{"kind":"recording","recording_id":"thermal-rerun"}}],"metadata":{"case":"R42-endurance-window-rerun"}}')([
    ['⎿', 'job_id: seq-r42-endurance-rerun   status: running   steps: 6', 'ok'],
  ]);
  await wait(220);
  tool('wait_for_test_sequence', 'job_id="seq-r42-endurance-rerun", timeout_seconds=480, poll_interval_seconds=1.0')([
    ['⎿', 'status: completed   PumpDutyPct p95: 81.1   related_artifact_ids: r42-thermal-rerun-asc, r42-powertrain-rerun-asc', 'ok'],
  ]);

  await promptUser('Compare it against R41 baseline.');

  await think('The rerun is repeatable, so I should compare it against the prior release before calling signoff.');
  command('compare_endurance_window --baseline /var/lib/plotune-nexus/data/R41_thermal_window.json --candidate seq-r42-endurance-rerun --out R42_endurance_delta.json', [
    'pump duty p95: +4.6 percentage points versus R41',
    'coolant inlet p95: +0.8 C versus R41',
    'current stability: within prior release envelope',
    'classification: watch item, not a signoff blocker',
  ]);

  await promptUser('Publish the signoff addendum.');

  await reviewer('report-reviewer', 'final review of R42 endurance signoff addendum', [
    'approved: addendum states watch item and links raw CAN/UART evidence',
    'approved: managed container lifecycle is closed before publishing',
  ]);
  await think('The container is stopped and the delta is classified; now I can publish the addendum.');
  command('write_signoff_addendum --case R42-endurance --delta R42_endurance_delta.json --sequence seq-r42-endurance-rerun --out R42_endurance_signoff_addendum.pdf', [
    'created R42_endurance_signoff_addendum.pdf',
    'evidence pack: 5 recordings, container status, baseline delta',
  ]);
  await wait(220);
  tool('upload_to_artifact_drive', 'drive_id="program-share", local_path="R42_endurance_signoff_addendum.pdf", remote_path="Endurance/R42/signoff/R42_endurance_signoff_addendum.pdf", overwrite=true')([
    ['⎿', 'uploaded   bytes: 1.6 MB', 'ok'],
  ]);
  await wait(240);
  await prose('<span class="hl">Endurance signoff addendum published.</span> The managed container completed the focused window, the rerun matched the anomaly, and R42 remains within signoff limits with a pump-duty watch item.');
}

window.DEMO_SCENARIOS = [
  s0_brake_release_gate,
  s1_inverter_calibration,
  s2_charger_restart_fault,
  s3_endurance_container_signoff,
];
