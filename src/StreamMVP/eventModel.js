// Frontend fixtures and illustrative contracts only; nothing is sent to these endpoints.
export const CAPTURE_ENDPOINT = "https://stream.plotune.net/capture";
export const MCP_ENDPOINT = "https://stream.plotune.net/mcp";
export const FREE_ALLOWANCE = 100000;
export const SNAPSHOT = "2026-10-09T12:00:00.000Z";
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
  const enriched = entries.map(([event, timestamp, properties], i) => ({
    id: `${project}-${i}`,
    event,
    timestamp,
    device_id: i % 5 === 0 ? undefined : (project === "battery" ? ["motor-003", "motor-004", "bms-rig-02"][i % 3] : ["robot-01", "robot-02"][i % 2]),
    session_id: i % 6 === 0 ? undefined : (project === "battery" ? ["run-817", "run-818", "thermal-cycle-42"][i % 3] : ["nav-run-22", "nav-run-23"][i % 2]),
    properties,
  }));
  if (project === "battery") {
    enriched.unshift(
      { id: "battery-run-817-1", event: "motor.started", timestamp: "2026-10-09T10:00:00Z", device_id: "motor-003", session_id: "run-817", properties: { rpm: 0, sw_version: "v1.4", controller: { mode: "closed_loop" } } },
      { id: "battery-run-817-2", event: "motor.speed_changed", timestamp: "2026-10-09T10:03:12Z", device_id: "motor-003", session_id: "run-817", properties: { rpm: 4200, sw_version: "v1.4" } },
      { id: "battery-run-817-3", event: "motor.overtemp", timestamp: "2026-10-09T10:05:33Z", device_id: "motor-003", session_id: "run-817", properties: { temperature: 103.5, rpm: 4200, sw_version: "v1.4" } },
      { id: "battery-run-817-4", event: "motor.shutdown", timestamp: "2026-10-09T10:06:02Z", device_id: "motor-003", session_id: "run-817", properties: { reason: "thermal_limit", rpm: 0 } },
      { id: "battery-run-817-5", event: "test.completed", timestamp: "2026-10-09T10:06:08Z", device_id: "test-controller-01", session_id: "run-817", properties: { outcome: "aborted", attempt: 1 } },
      { id: "battery-run-816-1", event: "motor.started", timestamp: "2026-10-08T09:00:00Z", device_id: "motor-003", session_id: "run-816", properties: { rpm: 0, sw_version: "v1.3" } },
      { id: "battery-run-816-2", event: "motor.overtemp", timestamp: "2026-10-08T09:24:14Z", device_id: "motor-003", session_id: "run-816", properties: { temperature: 96.1, rpm: 3800 } },
    );
  }
  return enriched;
}
export function previewValue(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return `[${value.length} items]`;
  if (typeof value === "object") return `{${Object.keys(value).length} keys}`;
  return String(value);
}
export function filterEvents(
  events,
  { search = "", name = "All events", range = "24h", now = SNAPSHOT, deviceId = "all", sessionId = "all", startAt = "", endAt = "" },
) {
  if ((startAt && !Number.isFinite(Date.parse(startAt))) || (endAt && !Number.isFinite(Date.parse(endAt))) || (startAt && endAt && Date.parse(startAt) > Date.parse(endAt))) return [];
  const interval =
    { "1h": 3600000, "24h": 86400000, "7d": 604800000 }[range] ?? Infinity;
  const current = Date.parse(now);
  return events
    .filter(
      (e) =>
        (name === "All events" || e.event === name) &&
        (deviceId === "all" || (deviceId === "unspecified" ? !e.device_id : e.device_id === deviceId)) &&
        (sessionId === "all" || (sessionId === "unspecified" ? !e.session_id : e.session_id === sessionId)) &&
        JSON.stringify({ event: e.event, device_id: e.device_id, session_id: e.session_id, properties: e.properties })
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        (startAt || endAt
          ? (!startAt || Date.parse(e.timestamp) >= Date.parse(startAt)) && (!endAt || Date.parse(e.timestamp) < Date.parse(endAt))
          : Date.parse(e.timestamp) >= current - interval && Date.parse(e.timestamp) <= current),
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
    device_id: undefined,
    session_id: undefined,
    properties: { temperature: 72.4, rpm: 1840, state: "running" },
  };
}

// Copy-paste integrations: each example is a complete program or sketch in that
// language's normal HTTP path, sending the same event as the curl example.
export function ingestionSnippet(language, apiKey) {
  const endpoint = CAPTURE_ENDPOINT;
  const event = ONBOARDING_EVENT_NAME;
  const payload = {
    api_key: apiKey,
    event,
    device_id: "motor-003",
    session_id: "test-run-817",
    properties: { temperature: 72.4, rpm: 1840, state: "running" },
  };
  if (language === "Python")
    return String.raw`# send_event.py: Python 3 standard library only.
import json
from urllib.error import URLError
from urllib.request import Request, urlopen

ENDPOINT = "${endpoint}"
API_KEY = "${apiKey}"


def send_event(event, properties, device_id=None, session_id=None):
    payload = {"api_key": API_KEY, "event": event, "properties": properties}
    if device_id:
        payload["device_id"] = device_id
    if session_id:
        payload["session_id"] = session_id
    request = Request(
        ENDPOINT,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urlopen(request, timeout=10) as response:
        return response.status


if __name__ == "__main__":
    try:
        status = send_event(
            "${event}",
            {"temperature": 72.4, "rpm": 1840, "state": "running"},
            device_id="motor-003",
            session_id="test-run-817",
        )
        print("sent", status)
    except URLError as error:
        print("send failed:", error)`;
  if (language === "C/C++")
    return String.raw`/* send_event.c. Build: cc send_event.c -lcurl -o send_event */
#include <stdio.h>
#include <curl/curl.h>

int main(void) {
  char body[512];
  snprintf(body, sizeof body,
    "{\"api_key\":\"%s\",\"event\":\"%s\",\"device_id\":\"motor-003\","
    "\"session_id\":\"test-run-817\",\"properties\":{\"temperature\":%.1f,"
    "\"rpm\":%d,\"state\":\"running\"}}",
    "${apiKey}", "${event}", 72.4, 1840);

  curl_global_init(CURL_GLOBAL_DEFAULT);
  CURL *curl = curl_easy_init();
  if (!curl) return 1;
  struct curl_slist *headers =
    curl_slist_append(NULL, "Content-Type: application/json");
  curl_easy_setopt(curl, CURLOPT_URL, "${endpoint}");
  curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
  curl_easy_setopt(curl, CURLOPT_POSTFIELDS, body);
  curl_easy_setopt(curl, CURLOPT_TIMEOUT, 10L);

  CURLcode rc = curl_easy_perform(curl);
  long status = 0;
  curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &status);
  if (rc != CURLE_OK) fprintf(stderr, "send failed: %s\n", curl_easy_strerror(rc));
  else printf("sent %ld\n", status);

  curl_slist_free_all(headers);
  curl_easy_cleanup(curl);
  curl_global_cleanup();
  return rc == CURLE_OK ? 0 : 1;
}`;
  if (language === "Arduino / ESP32")
    return String.raw`// ESP32 sketch (Arduino core): reads a sensor and sends an event every 5 s.
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>

const char *WIFI_SSID = "your-wifi";
const char *WIFI_PASSWORD = "your-password";
const char *ENDPOINT = "${endpoint}";
const char *API_KEY = "${apiKey}";
const char *ROOT_CA = "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----\n";

void setup() {
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) delay(250);
}

void sendSample(float temperature, int rpm) {
  WiFiClientSecure tls;
  tls.setCACert(ROOT_CA);
  HTTPClient http;
  http.begin(tls, ENDPOINT);
  http.addHeader("Content-Type", "application/json");
  String body = String("{\"api_key\":\"") + API_KEY +
    "\",\"event\":\"${event}\",\"device_id\":\"esp32-motor-003\"," +
    "\"properties\":{\"temperature\":" + String(temperature, 1) +
    ",\"rpm\":" + rpm + ",\"state\":\"running\"}}";
  int status = http.POST(body);
  Serial.printf("sent %d\n", status);
  http.end();
}

void loop() {
  float temperature = analogReadMilliVolts(34) / 10.0;  // LM35: 10 mV per degree C
  sendSample(temperature, 1840);
  delay(5000);
}`;
  if (language === "MATLAB")
    return String.raw`% send_event.m: works in MATLAB R2016b or newer.
endpoint = '${endpoint}';
payload = struct( ...
    'api_key', '${apiKey}', ...
    'event', '${event}', ...
    'device_id', 'motor-003', ...
    'session_id', 'test-run-817', ...
    'properties', struct('temperature', 72.4, 'rpm', 1840, 'state', 'running'));
options = weboptions('MediaType', 'application/json', 'Timeout', 10);
try
    webwrite(endpoint, payload, options);
    disp('sent');
catch err
    warning('send failed: %s', err.message);
end`;
  if (language === "ROS 2")
    return String.raw`# stream_bridge.py: forwards /motor/temperature to Plotune Stream.
# Run: python3 stream_bridge.py (with your ROS 2 environment sourced)
import json
from urllib.request import Request, urlopen

import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32

ENDPOINT = "${endpoint}"
API_KEY = "${apiKey}"


class StreamBridge(Node):
    def __init__(self):
        super().__init__("plotune_stream_bridge")
        self.create_subscription(Float32, "/motor/temperature", self.on_temperature, 10)

    def on_temperature(self, msg):
        payload = {
            "api_key": API_KEY,
            "event": "${event}",
            "device_id": "motor-003",
            "session_id": "test-run-817",
            "properties": {"temperature": round(msg.data, 2), "rpm": 1840, "state": "running"},
        }
        request = Request(
            ENDPOINT,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urlopen(request, timeout=5) as response:
                self.get_logger().info(f"sent {response.status}")
        except OSError as error:
            self.get_logger().warning(f"send failed: {error}")


def main():
    rclpy.init()
    rclpy.spin(StreamBridge())


if __name__ == "__main__":
    main()`;
  if (language === "CAPL")
    return String.raw`/* CANoe CAPL: samples a CAN message and sends one event per second.
   Replace EngineData and its signals with names from your DBC.
   Uses curl.exe (included with Windows 10 and later). */
variables {
  char endpoint[100] = "${endpoint}";
  char apiKey[64] = "${apiKey}";
  float lastTemperature;
  long lastRpm;
  msTimer sendTimer;
}

on start { setTimerCyclic(sendTimer, 1000); }

on message EngineData {
  lastTemperature = this.Temperature.phys;
  lastRpm = (long)this.EngineSpeed.phys;
}

on timer sendTimer {
  char body[256];
  char args[400];
  dword file;
  snprintf(body, elcount(body),
    "{\"api_key\":\"%s\",\"event\":\"${event}\",\"device_id\":\"canoe-bench-01\",\"properties\":{\"temperature\":%.1f,\"rpm\":%d,\"state\":\"running\"}}",
    apiKey, lastTemperature, lastRpm);
  file = openFileWrite("plotune_event.json", 0);
  filePutString(body, elcount(body), file);
  fileClose(file);
  snprintf(args, elcount(args),
    "-s -X POST %s -H \"Content-Type: application/json\" --data @plotune_event.json",
    endpoint);
  sysExecCmd("curl", args);
}`;
  return `curl -X POST ${endpoint} \\\n  -H 'Content-Type: application/json' \\\n  -d '${JSON.stringify(payload, null, 2)}'`;
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
