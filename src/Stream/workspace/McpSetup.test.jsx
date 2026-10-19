import React, { act } from "react";
import { createRoot } from "react-dom/client";
import McpSetup, { MCP_CLIENTS } from "./McpSetup";
import ConnectionSetup from "./ConnectionSetup";

const URL_ = "https://stream.plotune.net/mcp";

function mount(element) {
  const container = document.createElement("div"), root = createRoot(container);
  document.body.appendChild(container);
  act(() => root.render(element));
  return { container, unmount: () => { act(() => root.unmount()); container.remove(); } };
}
const tabs = (container) => [...container.querySelectorAll('[role="tab"]')];
const codes = (container) => [...container.querySelectorAll("#mcp-setup-steps pre")].map((pre) => pre.textContent);

beforeEach(() => window.localStorage.clear());

test("each client tab shows its own sign-in setup with the project's MCP URL and no secret", () => {
  const { container, unmount } = mount(<McpSetup url={URL_} projectName="Line B" copy={jest.fn()} copied={null} />);
  expect(tabs(container).map((t) => t.textContent)).toEqual(["Claude Code", "Codex", "VS Code", "Cursor", "Other"]);
  expect(codes(container)).toEqual(["claude mcp add --transport http plotune-stream https://stream.plotune.net/mcp"]);
  const expected = {
    codex: ["codex mcp add plotune-stream --url https://stream.plotune.net/mcp", "codex mcp login plotune-stream"],
    vscode: [JSON.stringify({ servers: { "plotune-stream": { type: "http", url: URL_ } } }, null, 2)],
    cursor: [JSON.stringify({ mcpServers: { "plotune-stream": { url: URL_ } } }, null, 2)],
    other: [URL_],
  };
  for (const [id, commands] of Object.entries(expected)) {
    act(() => container.querySelector(`#mcp-tab-${id}`).click());
    expect(codes(container)).toEqual(commands);
    // Every path ends with the same approval step naming this project.
    expect([...container.querySelectorAll("#mcp-setup-steps li")].at(-1).textContent).toContain("choose “Line B” and approve");
    expect(container.textContent).not.toMatch(/plt_|YOUR_PROJECT_KEY|Bearer/);
  }
  unmount();
});

test("tabs follow the WAI-ARIA pattern: one tab stop, arrow keys wrap, choice is remembered", () => {
  const { container, unmount } = mount(<McpSetup url={URL_} projectName="P" copy={jest.fn()} copied={null} />);
  const selected = () => tabs(container).find((t) => t.getAttribute("aria-selected") === "true");
  expect(tabs(container).filter((t) => t.tabIndex === 0)).toHaveLength(1);
  act(() => selected().dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true })));
  expect(selected().textContent).toBe("Other");
  expect(document.activeElement).toBe(selected());
  act(() => selected().dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })));
  expect(selected().textContent).toBe("Claude Code");
  act(() => selected().dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true })));
  act(() => selected().dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true })));
  expect(selected().textContent).toBe("Cursor");
  expect(container.querySelector('[role="tabpanel"]').getAttribute("aria-labelledby")).toBe("mcp-tab-cursor");
  unmount();
  const again = mount(<McpSetup url={URL_} projectName="P" copy={jest.fn()} copied={null} />);
  expect(tabs(again.container).find((t) => t.getAttribute("aria-selected") === "true").textContent).toBe("Cursor");
  again.unmount();
  window.localStorage.setItem("plotune.stream.mcpClient", "unknown-client");
  const fallback = mount(<McpSetup url={URL_} projectName="P" copy={jest.fn()} copied={null} />);
  expect(tabs(fallback.container)[0].getAttribute("aria-selected")).toBe("true");
  fallback.unmount();
});

test("copy buttons copy exactly the shown command and confirm on the button used", () => {
  const copy = jest.fn();
  const { container, unmount } = mount(<McpSetup url={URL_} projectName="P" copy={copy} copied={null} />);
  act(() => container.querySelector("#mcp-tab-codex").click());
  const buttons = [...container.querySelectorAll(".mcp-copy")];
  act(() => buttons[1].click());
  expect(copy).toHaveBeenCalledWith("codex mcp login plotune-stream", "codex-1");
  unmount();
  window.localStorage.clear();
  const confirmed = mount(<McpSetup url={URL_} projectName="P" copy={copy} copied="claude-code-0" />);
  expect(confirmed.container.querySelector(".mcp-copy").textContent).toBe("Copied");
  confirmed.unmount();
  expect(MCP_CLIENTS.every((c) => c.steps(URL_).length >= 1)).toBe(true);
});

test("the MCP view leads with sign-in and keeps project-key access behind one disclosure", async () => {
  Object.assign(navigator, { clipboard: { writeText: jest.fn(async () => {}) } });
  const metadata = { project: { id: "p", name: "Line B", keyPrefix: "plt_abcd" }, keys: {}, role: "Owner", busy: false, rotate: jest.fn() };
  const client = { origin: "https://stream.plotune.net", mcp: jest.fn() };
  const { container, unmount } = mount(<ConnectionSetup client={client} metadata={metadata} mcp />);
  const headings = [...container.querySelectorAll("h2, h3")].map((h) => h.textContent);
  expect(headings.indexOf("Connect your AI client")).toBeLessThan(headings.indexOf("Project key access"));
  const disclosure = container.querySelector("details.mcp-key-alternative");
  expect(disclosure.open).toBe(false);
  expect(disclosure.querySelector("summary").textContent).toBe("Use a project key instead");
  // Key display, rotation and the key-based check all live inside the disclosure.
  for (const text of ["Rotate API key", "Check MCP connection", "Copy example"]) {
    const button = [...container.querySelectorAll("button")].find((b) => b.textContent === text);
    expect(disclosure.contains(button)).toBe(true);
  }
  await act(async () => container.querySelector(".mcp-copy").click());
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith("claude mcp add --transport http plotune-stream https://stream.plotune.net/mcp");
  expect(container.querySelector(".mcp-copy").textContent).toBe("Copied");
  unmount();
  // The API setup view is unchanged: key first, capture guide next, no MCP tabs.
  const api = mount(<ConnectionSetup client={client} metadata={metadata} />);
  expect(api.container.querySelector('[role="tablist"]')).toBeNull();
  expect(api.container.querySelector("details")).toBeNull();
  api.unmount();
});
