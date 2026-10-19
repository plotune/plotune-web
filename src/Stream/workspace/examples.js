const quoteShell = (value) => `'${value.replace(/'/g, `'"'"'`)}'`;
export const CAPTURE_LANGUAGES = ["curl", "Python", "C/C++", "Arduino / ESP32", "MATLAB", "ROS 2", "CAPL", "JavaScript"];
export const EXAMPLE_NOTES = {
  curl: "Run in a POSIX shell with curl installed. Sends one illustrative motor event.",
  Python: "Python 3, standard library only. Save as send_event.py and run once.",
  "C/C++": "Requires libcurl development headers. Build: cc send_event.c -lcurl -o send_event. Sends one event with illustrative readings.",
  "Arduino / ESP32": "ESP32 Arduino core. Set Wi-Fi credentials and the server's trusted root CA certificate. Sends one illustrative event after connecting; reset to send again.",
  MATLAB: "Uses webwrite and jsondecode. Run once in MATLAB with network access to the endpoint.",
  "ROS 2": "Source your ROS 2 environment. Requires rclpy and std_msgs. Waits up to 30 seconds for one /motor/temperature reading, then sends outside the subscription callback and exits.",
  CAPL: "CANoe CAPL on Windows with curl.exe on PATH. Set the measurement's write directory. Press S once to send illustrative readings; replace them with your DBC signals when integrating.",
  JavaScript: "Run with Node.js 18 or newer. Keep the project key in your own system; do not embed it in a public website.",
};

export function captureExample(language, key, origin) {
  const payload = {
    api_key: key,
    event: "motor.sample",
    device_id: "motor-003",
    session_id: "test-run-817",
    properties: { temperature: 72.4, rpm: 1840, state: "running" },
  };
  const endpoint = `${origin}/capture`;
  const body = JSON.stringify(payload);
  const bodyLiteral = JSON.stringify(body);
  const urlLiteral = JSON.stringify(endpoint);
  if (language === "Python")
    return `# send_event.py — sends one illustrative event
import json
from urllib.request import Request, urlopen
from urllib.error import URLError

payload = json.loads(${bodyLiteral})
request = Request(${urlLiteral},
    data=json.dumps(payload).encode("utf-8"),
    headers={"Content-Type": "application/json"}, method="POST")
try:
    with urlopen(request, timeout=10) as response:
        print("Accepted:", response.status)
except URLError as error:
    raise SystemExit(f"Capture failed: {error}")`;
  if (language === "C/C++")
    return `/* send_event.c — cc send_event.c -lcurl -o send_event */
#include <stdio.h>
#include <curl/curl.h>

int main(void) {
  const char *body = ${bodyLiteral};
  if (curl_global_init(CURL_GLOBAL_DEFAULT) != CURLE_OK) return 1;
  CURL *client = curl_easy_init();
  if (!client) { curl_global_cleanup(); return 1; }
  struct curl_slist *headers = curl_slist_append(NULL, "Content-Type: application/json");
  curl_easy_setopt(client, CURLOPT_URL, ${urlLiteral});
  curl_easy_setopt(client, CURLOPT_HTTPHEADER, headers);
  curl_easy_setopt(client, CURLOPT_POSTFIELDS, body);
  curl_easy_setopt(client, CURLOPT_CONNECTTIMEOUT, 5L);
  curl_easy_setopt(client, CURLOPT_TIMEOUT, 10L);
  CURLcode result = curl_easy_perform(client);
  long status = 0;
  curl_easy_getinfo(client, CURLINFO_RESPONSE_CODE, &status);
  if (result != CURLE_OK) fprintf(stderr, "Capture failed: %s\\n", curl_easy_strerror(result));
  else fprintf(stderr, "HTTP %ld\\n", status);
  curl_slist_free_all(headers);
  curl_easy_cleanup(client);
  curl_global_cleanup();
  return result == CURLE_OK && status >= 200 && status < 300 ? 0 : 1;
}`;
  if (language === "Arduino / ESP32")
    return `// ESP32 Arduino sketch — one illustrative event per reset
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <time.h>

const char *WIFI_SSID = "YOUR_WIFI";
const char *WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
// Replace with the PEM root CA trusted for your HTTPS endpoint.
const char *ROOT_CA = R"PEM(-----BEGIN CERTIFICATE-----
PASTE_ROOT_CA_HERE
-----END CERTIFICATE-----
)PEM";

void setup() {
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  unsigned long started = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - started < 15000) delay(250);
  if (WiFi.status() != WL_CONNECTED) { Serial.println("Wi-Fi connection failed"); return; }
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
  struct tm clock;
  if (!getLocalTime(&clock, 15000)) { Serial.println("Clock sync failed"); return; }
  WiFiClientSecure tls;
  tls.setCACert(ROOT_CA);
  HTTPClient http;
  http.setConnectTimeout(5000);
  http.setTimeout(10000);
  if (!http.begin(tls, ${urlLiteral})) { Serial.println("HTTPS setup failed"); return; }
  http.addHeader("Content-Type", "application/json");
  int status = http.POST(String(${bodyLiteral}));
  Serial.printf("Capture HTTP status: %d\\n", status);
  http.end();
}

void loop() {} // No recurring capture. Replace illustrative readings when integrating.`;
  if (language === "MATLAB")
    return `% send_event.m — sends one illustrative event
endpoint = '${endpoint.replace(/'/g, "''")}';
payload = jsondecode('${body.replace(/'/g, "''")}');
options = weboptions('MediaType', 'application/json', 'Timeout', 10);
try
    webwrite(endpoint, payload, options);
    disp('Event accepted');
catch err
    error('Capture failed: %s', err.message);
end`;
  if (language === "ROS 2")
    return `# stream_sample.py — source your ROS 2 environment, then python3 stream_sample.py
import json
import math
import time
from urllib.request import Request, urlopen
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32

rclpy.init()
node = Node("plotune_stream_sample")
readings = []
subscription = node.create_subscription(
    Float32, "/motor/temperature", lambda msg: readings.append(msg.data), 10)
try:
    deadline = time.monotonic() + 30
    while rclpy.ok() and not readings and time.monotonic() < deadline:
        rclpy.spin_once(node, timeout_sec=0.5)
    if not readings or not math.isfinite(readings[0]):
        raise SystemExit("No finite temperature reading received within 30 seconds")
    payload = json.loads(${bodyLiteral})
    # Only temperature comes from ROS; rpm/state are illustrative.
    payload["properties"]["temperature"] = round(readings[0], 2)
    request = Request(${urlLiteral}, data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}, method="POST")
    # HTTP runs after sampling, outside the subscription callback.
    with urlopen(request, timeout=10) as response:
        node.get_logger().info(f"Accepted: {response.status}")
finally:
    node.destroy_node()
    rclpy.shutdown()`;
  if (language === "CAPL")
    return `/* CANoe CAPL — press S to send one illustrative event.
   Set a writable measurement directory; curl.exe must be on PATH. */
on key 's' {
  char body[${body.length * 4 + 1}] = ${bodyLiteral};
  char args[${endpoint.length * 4 + 160}];
  dword file;
  file = openFileWrite("plotune_event.json", 0);
  if (file == 0) { write("Cannot write plotune_event.json"); return; }
  filePutString(body, strlen(body), file);
  fileClose(file);
  snprintf(args, elcount(args),
    "--fail-with-body --connect-timeout 5 --max-time 10 %s -H \\"Content-Type: application/json\\" --data-binary @plotune_event.json",
    ${urlLiteral});
  sysExecCmd("curl.exe", args);
  write("curl.exe started; check its output for the capture result.");
}`;
  if (language === "JavaScript")
    return `// Node.js 18+ — sends one illustrative event
const response = await fetch(${urlLiteral}, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(${JSON.stringify(payload, null, 2)}),
  signal: AbortSignal.timeout(10000)
});
if (!response.ok) throw new Error(\`Capture failed: \${response.status}\`);
console.log("Accepted:", response.status);`;
  return `curl --fail-with-body --connect-timeout 5 --max-time 10 ${quoteShell(endpoint)} \\\n  -H 'Content-Type: application/json' \\\n  --data ${quoteShell(JSON.stringify(payload, null, 2))}`;
}
export function mcpExample(key, origin) {
  return JSON.stringify(
    {
      mcpServers: {
        "plotune-stream": {
          url: `${origin}/mcp`,
          headers: { Authorization: `Bearer ${key}` },
        },
      },
    },
    null,
    2,
  );
}
