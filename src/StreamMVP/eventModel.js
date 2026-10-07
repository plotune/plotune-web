// Frontend fixtures and illustrative contracts only; nothing is sent to these endpoints.
export const CAPTURE_ENDPOINT = "https://stream.plotune.net/capture";
export const MCP_ENDPOINT = "https://stream.plotune.net/mcp";
export const FREE_ALLOWANCE = 100000;
export const SNAPSHOT = "2026-10-07T10:46:00.000Z";
export const initialProjects = [
  {
    id: "battery",
    name: "Battery HIL",
    key: "plt_demo_battery_4a7c29d1",
    events: seedEvents("battery"),
  },
  {
    id: "robot",
    name: "Robot Validation",
    key: "plt_demo_robot_7e3b82a6",
    events: seedEvents("robot"),
  },
  {
    id: "first",
    name: "My first project",
    key: "plt_demo_first_2f9d41c8",
    events: [],
  },
];
function seedEvents(project) {
  const entries =
    project === "battery"
      ? [
          [
            "test.failed",
            "2026-10-07T10:45:05.321Z",
            {
              source: "hil-bench-03",
              ecu: "BMS",
              voltage: 428.4,
              reason: "CAN timeout",
            },
          ],
          [
            "measurement.threshold_exceeded",
            "2026-10-07T10:45:04.912Z",
            { channel: "thermocouple_2", value: 92.4, unit: "°C", limit: 90 },
          ],
          [
            "ecu.connected",
            "2026-10-07T10:45:03.110Z",
            { source: "bench-03", protocol: "CAN FD", bitrate: 500000 },
          ],
          [
            "test.started",
            "2026-10-07T10:44:59.020Z",
            { script: "thermal_cycle.can", operator: "automated", cycle: 12 },
          ],
          [
            "simulation.completed",
            "2026-10-07T10:43:18.207Z",
            {
              model: "pack_thermal_v2",
              solver: "ode45",
              elapsed_s: 3.82,
              convergence: true,
            },
          ],
          [
            "firmware.booted",
            "2026-10-07T10:42:30.048Z",
            {
              device: "sensor-node-07",
              firmware: "v0.9.4",
              reset_reason: "power_on",
              uptime_ms: 42,
            },
          ],
          [
            "can.timeout",
            "2026-10-07T10:40:12.803Z",
            {
              interface: "can0",
              arbitration_id: "0x180",
              wait_ms: 200,
              retries: 2,
            },
          ],
          [
            "ros.node_started",
            "2026-10-07T10:38:01.311Z",
            {
              node: "/vehicle_model",
              namespace: "/simulation",
              ros_version: 2,
              topics: ["/battery/state", "/diagnostics"],
            },
          ],
          [
            "calibration.loaded",
            "2026-10-07T10:34:45.450Z",
            {
              file: "bms_release_18.a2l",
              checksum: "8ac039f1",
              metadata: { branch: "validation", revision: 18 },
            },
          ],
          [
            "test.completed",
            "2026-10-07T10:30:22.003Z",
            {
              script: "boot_check.py",
              checks: 24,
              result: "passed",
              tags: ["smoke", "nightly"],
            },
          ],
          [
            "device.reconnected",
            "2026-10-07T09:21:05.005Z",
            { address: "10.0.3.14", attempts: 3, transport: "ethernet" },
          ],
          [
            "simulation.completed",
            "2026-10-06T16:12:41.119Z",
            {
              model: "cell_balance",
              solver: "fixed_step",
              steps: 4800,
              output: null,
            },
          ],
          [
            "firmware.booted",
            "2026-10-05T08:02:19.088Z",
            {
              board: "stm32g4",
              version: "1.2.0",
              diagnostics: { watchdog: false, boot_count: 174 },
            },
          ],
        ]
      : [
          [
            "ros.node_started",
            "2026-10-07T10:45:29.701Z",
            { node: "/motion_controller", namespace: "/robot_01", pid: 4021 },
          ],
          [
            "simulation.completed",
            "2026-10-07T10:44:01.412Z",
            { scenario: "warehouse_turn", distance_m: 28.2, collisions: 0 },
          ],
          [
            "test.started",
            "2026-10-07T10:42:51.110Z",
            { command: "./check_sensors.sh", host: "robot-dev-02" },
          ],
          [
            "measurement.threshold_exceeded",
            "2026-10-07T10:41:22.815Z",
            {
              signal: "joint_3_torque",
              value: 46.1,
              unit: "Nm",
              expected: { min: 0, max: 45 },
            },
          ],
          [
            "firmware.booted",
            "2026-10-07T09:58:19.005Z",
            { board: "motor-driver", build: 214, bus: "RS485" },
          ],
        ];
  return entries.map(([event, timestamp, properties], i) => ({
    id: `${project}-${i}`,
    event,
    timestamp,
    properties,
  }));
}
export function previewValue(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return `[${value.length} items]`;
  if (typeof value === "object") return `{${Object.keys(value).length} keys}`;
  return String(value);
}
export function filterEvents(
  events,
  { search = "", name = "All events", range = "24h", now = SNAPSHOT },
) {
  const interval =
    { "1h": 3600000, "24h": 86400000, "7d": 604800000 }[range] ?? Infinity;
  const current = Date.parse(now);
  return events
    .filter(
      (e) =>
        (name === "All events" || e.event === name) &&
        JSON.stringify({ event: e.event, properties: e.properties })
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        Date.parse(e.timestamp) >= current - interval &&
        Date.parse(e.timestamp) <= current,
    )
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
}
export function ingestionSnippet(language, apiKey) {
  const payload = {
    api_key: apiKey,
    event: "test.started",
    properties: { source: "my-test-system" },
  };
  if (language === "Python")
    return `import requests\n\nrequests.post(\n    "${CAPTURE_ENDPOINT}",\n    json=${JSON.stringify(payload, null, 4)}\n)`;
  if (language === "C")
    return `/* Illustrative libcurl example; handle errors in your application. */\nCURL *request = curl_easy_init();\nstruct curl_slist *headers = NULL;\nheaders = curl_slist_append(headers, "Content-Type: application/json");\ncurl_easy_setopt(request, CURLOPT_URL, "${CAPTURE_ENDPOINT}");\ncurl_easy_setopt(request, CURLOPT_HTTPHEADER, headers);\ncurl_easy_setopt(request, CURLOPT_POSTFIELDS,\n    "{\\\"api_key\\\":\\\"${apiKey}\\\",\\\"event\\\":\\\"test.started\\\","\n    "\\\"properties\\\":{\\\"source\\\":\\\"my-test-system\\\"}}");\ncurl_easy_perform(request);\ncurl_slist_free_all(headers);\ncurl_easy_cleanup(request);`;
  if (language === "CAPL")
    return `// Illustrative HTTP adapter pseudocode, not native CAPL functions.\n// Use an HTTP-capable adapter appropriate for your test environment.\nhttpPost(\n  "${CAPTURE_ENDPOINT}",\n  "application/json",\n  "{\\\"api_key\\\":\\\"${apiKey}\\\",\\\"event\\\":\\\"test.started\\\","\n  "\\\"properties\\\":{\\\"source\\\":\\\"my-test-system\\\"}}"\n);`;
  return `curl ${CAPTURE_ENDPOINT} \\\n  -H 'Content-Type: application/json' \\\n  -d '${JSON.stringify(payload, null, 2)}'`;
}
export function mcpSnippet(apiKey) {
  return JSON.stringify(
    {
      mcpServers: {
        "plotune-stream": {
          url: MCP_ENDPOINT,
          headers: { Authorization: `Bearer ${apiKey}` },
        },
      },
    },
    null,
    2,
  );
}
