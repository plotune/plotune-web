// Deterministic, project-scoped demo fixtures. No integrations or customer data.
export const projects = [
  {
    id: "battery",
    name: "Battery HIL",
    bench: "HIL-03",
    ecu: "BMS",
    software: "2026.10.184",
    suite: "ThermalValidation",
    total: 46,
    passed: 42,
    duration: "18.4",
    color: "#00796b",
  },
  {
    id: "regen",
    name: "Regen Validation",
    bench: "Bench-03",
    ecu: "VCU 4.12",
    software: "2026.10.184",
    suite: "RegenValidation",
    total: 32,
    passed: 29,
    duration: "6.8",
    color: "#6266ad",
  },
  {
    id: "sandbox",
    name: "Engineering Sandbox",
    bench: "Not assigned",
    ecu: "Not assigned",
    software: "—",
    suite: "—",
    total: 0,
    passed: 0,
    duration: "—",
    color: "#7a8590",
  },
];
export const sourceTypes = [
  {
    name: "Plotune Nexus",
    hint: "Bring a connected bench into your project.",
    code: "Nexus → Stream\nProject: PROJECT_NAME\nBench: HIL-03\nSelect “Share with Stream” on your Nexus device.",
    guide:
      "Choose your project on Nexus, then select the runs and measurements to share. Nexus is optional; every other source can connect directly.",
  },
  {
    name: "HTTP API",
    hint: "Send events from any test application.",
    code: 'POST /demo/stream/events\nContent-Type: application/json\n\n{ "event": "test.completed",\n  "project": "PROJECT_ID",\n  "run_id": "1843",\n  "properties": { "result": "passed" } }',
    guide:
      "Associate events with a project and run ID. Send meaningful state changes; keep continuous signal samples in measurements.",
  },
  {
    name: "Python",
    hint: "Instrument your test scripts.",
    code: '# Illustrative SDK; not a released package\nstream = Stream(project="PROJECT_ID")\nrun = stream.start_run("ThermalValidation")\nrun.measure("pack_voltage", 398.2, unit="V")\nrun.event("test.completed", result="passed")',
    guide:
      "Start a run, attach measurement values, and emit test outcomes. The run ID ties the evidence together.",
  },
  {
    name: "CAPL",
    hint: "Capture test outcomes from your bench.",
    code: '// Illustrative adapter calls\non start {\n  streamRunStart("ThermalValidation");\n}\n// After a test verdict:\nstreamEvent("test.completed", "passed");',
    guide:
      "Add an event adapter to your test suite and include the ECU and software version with each run.",
  },
  {
    name: "ROS 2",
    hint: "Track robot and vehicle model activity.",
    code: "# Illustrative configuration\nproject: PROJECT_ID\nevents:\n  - /test/verdict\n  - /diagnostics\nmeasurements:\n  - /battery/temperature\n  - /vehicle/motor_speed",
    guide:
      "Map diagnostic transitions to events and numeric topics to measurements. Keep both associated with the current run.",
  },
  {
    name: "MQTT",
    hint: "Connect existing hardware telemetry.",
    code: "# Illustrative topic mapping\nproject: PROJECT_ID\nevent_topic: bench/03/events\nmeasurement_topic: bench/03/measurements\nrun_id_property: run_id",
    guide:
      "Map your event and measurement topics separately, then include run_id in payloads for traceability.",
  },
];
export function makeData(project) {
  if (!project.total)
    return {
      sources: [],
      runs: [],
      events: [],
      alarms: [],
      measurements: [],
      records: [],
    };
  const battery = project.id === "battery";
  const sources = [
    {
      id: "nexus",
      name: "Nexus Bench-03",
      type: "Plotune Nexus",
      status: "Connected",
      rate: "24 Hz",
      last: "1 s ago",
    },
    {
      id: "capl",
      name: "CAPL Test Suite",
      type: "CAPL",
      status: "Connected",
      rate: "8 events/min",
      last: "2 s ago",
    },
    {
      id: "ros",
      name: "ROS 2 Vehicle Model",
      type: "ROS 2",
      status: "Delayed",
      rate: "10 Hz",
      last: "38 s ago",
    },
  ];
  const runs = Array.from({ length: 8 }, (_, i) => ({
    id: (battery ? 1843 : 2843) - i,
    time: `10:${String(48 - i * 3).padStart(2, "0")}:01`,
    result: i === 1 || i === 5 ? "Failed" : "Passed",
    duration: i === 0 ? "18.4" : i === 1 ? "6.2" : (16.2 + i * 1.3).toFixed(1),
    suite:
      i === 1
        ? battery
          ? "ThermalValidation"
          : "RegenValidation"
        : project.suite,
    ecu: project.ecu,
    bench: project.bench,
    software: project.software,
    source: "CAPL Test Suite",
  }));
  const failureEvent = battery
    ? "temperature.limit_exceeded"
    : "motor.overspeed_detected";
  const events = [
    {
      name: "test.completed",
      severity: "Info",
      source: "CAPL Test Suite",
      run: runs[0].id,
      time: "10:48:19",
      properties: { result: "passed", checks_passed: 24, duration_s: 18.4 },
    },
    {
      name: "test.started",
      severity: "Info",
      source: "CAPL Test Suite",
      run: runs[0].id,
      time: "10:48:01",
      properties: { suite: project.suite, software: project.software },
    },
    {
      name: "test.failed",
      severity: "Critical",
      source: "CAPL Test Suite",
      run: runs[1].id,
      time: "10:45:05",
      properties: {
        requirement: battery ? "REQ-BMS-042" : "REQ-VCU-018",
        reason: battery
          ? "Cell temperature exceeded 55 °C"
          : "Motor speed exceeded 6500 rpm",
      },
    },
    {
      name: failureEvent,
      severity: "Critical",
      source: "Nexus Bench-03",
      run: runs[1].id,
      time: "10:45:04",
      properties: battery
        ? { peak_temperature_c: 58.4, threshold_c: 55, duration_ms: 438 }
        : { peak_rpm: 6820, threshold: 6500, duration_ms: 438 },
    },
    {
      name: "dtc.detected",
      severity: "Warning",
      source: "Nexus Bench-03",
      run: runs[1].id,
      time: "10:45:04",
      properties: {
        code: "P0A7E",
        ecu: project.ecu,
        description: "Battery pack over temperature",
      },
    },
    {
      name: "ecu.connected",
      severity: "Info",
      source: "Nexus Bench-03",
      run: runs[1].id,
      time: "10:45:03",
      properties: { ecu: project.ecu, protocol: "CAN FD", bitrate_kbps: 500 },
    },
    {
      name: "test.started",
      severity: "Info",
      source: "CAPL Test Suite",
      run: runs[1].id,
      time: "10:45:01",
      properties: { suite: project.suite, bench: project.bench },
    },
    {
      name: "can.timeout",
      severity: "Warning",
      source: "ROS 2 Vehicle Model",
      run: runs[2].id,
      time: "10:42:08",
      properties: { frame_id: "0x180", timeout_ms: 200, channel: "CAN 1" },
    },
    {
      name: "requirement.failed",
      severity: "Critical",
      source: "CAPL Test Suite",
      run: runs[5].id,
      time: "10:33:09",
      properties: { requirement: "REQ-BMS-017", actual_v: 312, minimum_v: 320 },
    },
    {
      name: "ecu.booted",
      severity: "Info",
      source: "Nexus Bench-03",
      run: runs[6].id,
      time: "10:30:02",
      properties: { boot_duration_ms: 842, software: project.software },
    },
  ].map((e, i) => ({ ...e, id: `${project.id}-e${i}` }));
  const alarms = [
    {
      id: "a1",
      title: battery
        ? "Cell temperature above threshold"
        : "Motor overspeed detected",
      severity: "Critical",
      detail: battery
        ? "58.4 °C · limit 55 °C · Cell 12"
        : "6820 rpm · limit 6500 rpm",
      source: "Nexus Bench-03",
      run: runs[1].id,
      time: "10:45:04",
    },
    {
      id: "a2",
      title: "CAN heartbeat lost",
      severity: "Warning",
      detail: "CAN 1 · frame 0x180 · 200 ms",
      source: "ROS 2 Vehicle Model",
      run: runs[2].id,
      time: "10:42:08",
    },
    {
      id: "a3",
      title: "ECU boot timeout",
      severity: "Warning",
      detail: "Boot duration 2400 ms · limit 2000 ms",
      source: "Nexus Bench-03",
      run: runs[5].id,
      time: "10:33:09",
    },
  ];
  const measurements = [
    {
      name: "Pack Voltage",
      value: 398.2,
      unit: "V",
      range: "320–420 V",
      values: [380, 384, 382, 392, 391, 397, 393, 398, 396, 398.2],
    },
    {
      name: "Pack Current",
      value: -42.6,
      unit: "A",
      range: "−200–200 A",
      values: [-20, -30, -26, -35, -40, -37, -45, -40, -43, -42.6],
    },
    {
      name: "Cell Temperature Max",
      value: 48.2,
      unit: "°C",
      range: "0–55 °C",
      values: [32, 35, 36, 39, 43, 48, 58.4, 53, 49, 48.2],
    },
    {
      name: "SOC",
      value: 72.4,
      unit: "%",
      range: "10–95 %",
      values: [78, 77, 76.5, 76, 75, 74.8, 74, 73.2, 72.9, 72.4],
    },
    {
      name: "Motor Speed",
      value: 6430,
      unit: "rpm",
      range: "0–6500 rpm",
      values: [4100, 4600, 5100, 5800, 5900, 6200, 6820, 6400, 6500, 6430],
    },
    {
      name: "DC Link Voltage",
      value: 402.8,
      unit: "V",
      range: "320–450 V",
      values: [395, 397, 396, 398, 400, 398, 402, 401, 403, 402.8],
    },
  ];
  const records = runs.slice(0, 4).map((run, i) => ({
    id: `rec${i}`,
    name: `${project.ecu.split(" ")[0]}_${run.id}_capture.mf4`,
    run: run.id,
    duration: `${run.duration} s`,
    size: `${(2.4 + i * 1.7).toFixed(1)} MB`,
    signals: 64,
    source: "Nexus Bench-03",
    time: run.time,
  }));
  return { sources, runs, events, alarms, measurements, records };
}
export const initialProcessors = [
  {
    id: "thermal",
    name: "Calculate thermal drift",
    type: "Calculation",
    trigger: "test.completed",
    condition: "Every completed run",
    input: "Current run · cell temperatures",
    process: "Compare initial and peak cell temperature",
    output: "thermal_drift · °C",
    status: "Active",
    count: 42,
  },
  {
    id: "investigate",
    name: "Investigate critical alarms",
    type: "Action",
    trigger: "alarm.created",
    condition: "severity == critical",
    input: "Alarm + linked run evidence",
    process: "Ask managed agent to investigate run",
    output: "Investigation report · run artifact",
    status: "Active",
    count: 4,
  },
  {
    id: "model",
    name: "Battery thermal model",
    type: "Simulation",
    trigger: "Manual",
    condition: "Engineer starts a simulation",
    input: "Current run · pack current + ambient temperature",
    process: "Compare measured temperature with model prediction",
    output: "temperature_residual · °C",
    status: "Draft",
    count: 0,
  },
];
