const quoteShell = (value) => `'${value.replace(/'/g, `'"'"'`)}'`;
export function captureExample(language, key, origin) {
  const payload = {
    api_key: key,
    event: "motor.sample",
    properties: { motor_id: "M-001", rpm: 1680, motor: { temperature: 81 } },
  };
  const endpoint = `${origin}/capture`;
  if (language === "Python")
    return `import json\nfrom urllib.request import Request, urlopen\n\npayload = json.loads(${JSON.stringify(JSON.stringify(payload))})\nrequest = Request(${JSON.stringify(endpoint)}, data=json.dumps(payload).encode("utf-8"),\n                  headers={"Content-Type": "application/json"}, method="POST")\nwith urlopen(request, timeout=10) as response:\n    print(response.status)`;
  if (language === "JavaScript")
    return `const response = await fetch(${JSON.stringify(endpoint)}, {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify(${JSON.stringify(payload, null, 2)})\n});\nif (!response.ok) throw new Error(\`Capture failed: \${response.status}\`);`;
  return `curl --fail-with-body ${quoteShell(endpoint)} \\\n  -H 'Content-Type: application/json' \\\n  --data ${quoteShell(JSON.stringify(payload))}`;
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
