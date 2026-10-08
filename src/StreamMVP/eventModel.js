// Frontend fixtures and illustrative contracts only; nothing is sent to these endpoints.
export const CAPTURE_ENDPOINT = "https://stream.plotune.net/capture";
export const MCP_ENDPOINT = "https://stream.plotune.net/mcp";
export const FREE_ALLOWANCE = 100000;
export const SNAPSHOT = "2026-10-07T10:46:00.000Z";
export const ONBOARDING_EVENT_NAME = "motor.sample";
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
          ["motor", "2026-10-07T10:45:40.000Z", { temp: 82.1, oil_temp: 76.4, cell_temp: 67.8, rpm: 3800, state: "running" }],
          ["motor", "2026-10-07T10:42:10.000Z", { temp: 83.7, oil_temp: 77.1, cell_temp: 68.2, rpm: 4120, state: "running" }],
          ["motor", "2026-10-07T10:37:20.000Z", { temp: 85.3, oil_temp: 78.6, cell_temp: 69.1, rpm: 4350, state: "running" }],
          ["motor", "2026-10-07T10:28:00.000Z", { temp: 84.2, oil_temp: 78.1, cell_temp: 68.9, rpm: 3980, state: "idle" }],
          ["motor", "2026-10-07T10:12:00.000Z", { temp: 81.8, oil_temp: 75.9, cell_temp: 67.2, rpm: 3650, state: "running" }],
          ["motor", "2026-10-07T09:48:00.000Z", { temp: 79.5, oil_temp: 74.2, cell_temp: 65.8, rpm: 3420, state: "running" }],
          ["environment", "2026-10-07T10:43:10.000Z", { temperature: 22.4, humidity: 41.2, state: "stable" }],
          ["environment", "2026-10-07T10:20:10.000Z", { temperature: 22.1, humidity: 42.0, state: "stable" }],
          ["test.failed", "2026-10-07T10:44:20.000Z", { suite: "thermal_cycle", attempt: 2, result: "failed" }],
          ["test.failed", "2026-10-07T10:16:20.000Z", { suite: "sensor_check", attempt: 1, result: "failed" }],
          ["can.timeout", "2026-10-07T10:05:12.000Z", { channel: "CAN 1", wait_ms: 200, retries: 1 }],
          ["sensor.reading", "2026-10-07T09:58:00.000Z", { temperature: 31.6, pressure: 100.8, unit: "mixed" }],
          ["simulation.completed", "2026-10-07T09:32:41.119Z", { model: "thermal_model", iterations: 240, converged: true }],
          ["firmware.booted", "2026-10-07T09:05:19.005Z", { version: "1.2.1", boot_count: 175, reset_reason: "watchdog" }],
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
          ["robot.position", "2026-10-07T10:45:50.000Z", { x: 4.2, y: 1.8, heading: 92.1, state: "moving" }],
          ["robot.position", "2026-10-07T10:43:50.000Z", { x: 4.8, y: 2.1, heading: 96.4, state: "moving" }],
          ["robot.position", "2026-10-07T10:40:50.000Z", { x: 5.3, y: 2.7, heading: 101.2, state: "turning" }],
          ["robot.position", "2026-10-07T10:35:50.000Z", { x: 6.1, y: 3.0, heading: 108.5, state: "moving" }],
          ["robot.position", "2026-10-07T10:30:50.000Z", { x: 6.8, y: 3.9, heading: 114.0, state: "moving" }],
          ["environment", "2026-10-07T10:44:10.000Z", { temperature: 21.8, humidity: 38.4, state: "stable" }],
          ["environment", "2026-10-07T10:26:10.000Z", { temperature: 22.0, humidity: 39.1, state: "stable" }],
          ["test.failed", "2026-10-07T10:39:20.000Z", { suite: "navigation_check", result: "failed", attempt: 1 }],
          ["test.started", "2026-10-07T10:36:20.000Z", { suite: "obstacle_course", attempt: 3 }],
          ["can.timeout", "2026-10-07T10:32:12.000Z", { channel: "CAN 2", wait_ms: 160, retries: 2 }],
          ["sensor.reading", "2026-10-07T10:28:00.000Z", { range_m: 2.8, confidence: 0.94, state: "valid" }],
          ["simulation.completed", "2026-10-07T10:20:41.119Z", { model: "warehouse_route", iterations: 180, converged: true }],
          ["firmware.booted", "2026-10-07T10:10:19.005Z", { version: "2.1.4", boot_count: 64, reset_reason: "power_on" }],
          ["robot.position", "2026-10-07T09:48:50.000Z", { x: 7.4, y: 4.2, heading: 120.2, state: "stopped" }],
          ["test.failed", "2026-10-07T09:42:20.000Z", { suite: "sensor_check", result: "failed", attempt: 2 }],
          ["environment", "2026-10-07T09:28:10.000Z", { temperature: 21.4, humidity: 39.9, state: "stable" }],
          ["robot.sample", "2026-10-07T10:44:40.000Z", { robot_id: "R-01", environment: "real", sw_version: "v1.4", test_date: "2026-10-07", position: { x: 4.2, y: 1.8 }, motor: { temperature: 71.8 }, rpm: 1680 }],
          ["robot.sample", "2026-10-07T10:38:40.000Z", { robot_id: "R-01", environment: "simulation", sw_version: "v1.5-rc1", test_date: "2026-10-06", position: { x: 4.8, y: 2.1 }, motor: { temperature: 69.4 }, rpm: 1720 }],
          ["robot.sample", "2026-10-07T10:23:40.000Z", { robot_id: "R-01", environment: "real", sw_version: "v1.3", test_date: "2026-10-05", position: { x: 5.3, y: 2.7 }, motor: { temperature: null }, rpm: "1710" }],
          ["drone.error", "2026-10-07T10:18:20.000Z", { drone_id: "D-04", sw_version: "flight-2.7", error_code: 42, message: "GPS lock lost", diagnostic: { satellites: 3, retry: true } }],
          ["drone.error", "2026-10-07T09:54:20.000Z", { drone_id: "D-04", sw_version: "flight-2.6", error_code: "E42", message: "GPS lock lost", diagnostic: null }],
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

export const EVENTS_PER_PAGE = 20;

const compareEventsNewestFirst = (a, b) => {
  const byTime = Date.parse(b.timestamp) - Date.parse(a.timestamp);
  return byTime || String(a.id).localeCompare(String(b.id));
};

// A cursor is the last event rendered on the current page. The local fixture
// array stands in for a bounded backend response during this frontend-only MVP.
export function cursorPage(events, cursor = null, limit = EVENTS_PER_PAGE) {
  const ordered = [...events].sort(compareEventsNewestFirst);
  const remaining = cursor
    ? ordered.filter((event) => compareEventsNewestFirst(event, cursor) > 0)
    : ordered;
  const items = remaining.slice(0, limit);
  return {
    items,
    nextCursor:
      remaining.length > limit && items.length
        ? { id: items[items.length - 1].id, timestamp: items[items.length - 1].timestamp }
        : null,
  };
}
export function createSimulatedFirstEvent(id, timestamp) {
  return {
    id,
    event: ONBOARDING_EVENT_NAME,
    timestamp,
    properties: { temperature: 72.4, rpm: 1840, state: "running" },
  };
}

export function ingestionSnippet(language, apiKey) {
  const payload = {
    api_key: apiKey,
    event: ONBOARDING_EVENT_NAME,
    properties: { temperature: 72.4, rpm: 1840, state: "running" },
  };
  const body = JSON.stringify(payload);
  if (language === "Python")
    return `import json\nfrom urllib.request import Request, urlopen\n\npayload = ${JSON.stringify(payload, null, 4)}\nrequest = Request(\n    "${CAPTURE_ENDPOINT}",\n    data=json.dumps(payload).encode("utf-8"),\n    headers={"Content-Type": "application/json"},\n    method="POST",\n)\nwith urlopen(request, timeout=10) as response:\n    print(response.status)`;
  if (language === "C/C++")
    return `/* Illustrative libcurl example; handle errors in your application. */\nCURL *request = curl_easy_init();\nstruct curl_slist *headers = NULL;\nconst char *payload = ${JSON.stringify(body)};\nheaders = curl_slist_append(headers, "Content-Type: application/json");\ncurl_easy_setopt(request, CURLOPT_URL, "${CAPTURE_ENDPOINT}");\ncurl_easy_setopt(request, CURLOPT_HTTPHEADER, headers);\ncurl_easy_setopt(request, CURLOPT_POSTFIELDS, payload);\ncurl_easy_perform(request);\ncurl_slist_free_all(headers);\ncurl_easy_cleanup(request);`;
  if (language === "Arduino / ESP32")
    return `// ESP32 Arduino core example, after Wi-Fi connects.\n// Define rootCACertificate as the CA certificate for stream.plotune.net.\n#include <WiFiClientSecure.h>\n#include <HTTPClient.h>\nWiFiClientSecure tls;\ntls.setCACert(rootCACertificate);\nHTTPClient http;\nhttp.begin(tls, "${CAPTURE_ENDPOINT}");\nhttp.addHeader("Content-Type", "application/json");\nconst char *payload = R"json(${body})json";\nint status = http.POST(payload);\nhttp.end();`;
  if (language === "MATLAB")
    return `payload = struct( ...\n    'api_key', '${apiKey}', ...\n    'event', 'motor.sample', ...\n    'properties', struct('temperature', 72.4, 'rpm', 1840, 'state', 'running'));\noptions = weboptions('MediaType', 'application/json');\nresponse = webwrite('${CAPTURE_ENDPOINT}', payload, options);`;
  if (language === "ROS 2")
    return `# Inside an rclpy subscription callback, with sensor message "msg"\nimport json\nfrom urllib.request import Request, urlopen\n\npayload = {\n    "api_key": "${apiKey}",\n    "event": "motor.sample",\n    "properties": {"temperature": float(msg.data), "rpm": 1840, "state": "running"},\n}\nrequest = Request(\n    "${CAPTURE_ENDPOINT}",\n    data=json.dumps(payload).encode("utf-8"),\n    headers={"Content-Type": "application/json"},\n    method="POST",\n)\nwith urlopen(request, timeout=10) as response:\n    print(response.status)`;
  if (language === "CAPL")
    return `// Illustrative HTTP adapter pseudocode, not native CAPL functions.\n// Map this request to an HTTP-capable adapter in your test environment.\nhttpPost(\n  "${CAPTURE_ENDPOINT}",\n  "application/json",\n  ${JSON.stringify(body)}\n);`;
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
