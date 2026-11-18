import{t as e}from"./jsx-runtime-LKYXHABd.js";import{n as t}from"./lib-CTTP4Es4.js";var n=e();function r(e){let r={a:`a`,code:`code`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...t(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h2,{children:`Endpoint`}),`
`,(0,n.jsx)(r.p,{children:`Nexus exposes its tool surface over the Model Context Protocol (MCP), HTTP transport:`}),`
`,(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`Direct to a device on your network`}),`: `,(0,n.jsx)(r.code,{children:`http://<device-ip>/mcp`})]}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`Through Plotune's cloud router`}),`, device-scoped: `,(0,n.jsx)(r.code,{children:`https://nexus.plotune.net/devices/<device-uuid>/mcp/`})]}),`
`]}),`
`,(0,n.jsx)(r.p,{children:`The direct path is HTTP-only, because Nexus is a networked device rather than a local stdio process. The router path is HTTPS and owns OAuth discovery plus dynamic client registration for that public endpoint; the device UUID is part of the URL because the router has to resolve the correct device route before it can present that device's OAuth surface.`}),`
`,(0,n.jsx)(r.h2,{children:`Authenticating`}),`
`,(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.strong,{children:`OAuth is the preferred path.`}),` It keeps redirect, consent, and client-registration behavior on the standard, auditable MCP surface, and it's the only path that can grant a session the full owner-level permission set.`]}),`
`,(0,n.jsxs)(r.p,{children:[`Some clients fall back from device-scoped OAuth discovery to origin-level paths (`,(0,n.jsx)(r.code,{children:`/.well-known/oauth-protected-resource`}),`, `,(0,n.jsx)(r.code,{children:`/.well-known/oauth-authorization-server`}),`, `,(0,n.jsx)(r.code,{children:`/register`}),`) that don't carry a device UUID, which means the router can't safely infer which device to route to from the URL alone. For those clients, pass the device UUID as a static header instead:`]}),`
`,(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-json`,children:`{
  "servers": {
    "plotune-nexus": {
      "type": "http",
      "url": "https://nexus.plotune.net/devices/<device-uuid>/mcp/",
      "headers": { "X-Plotune-Device-UUID": "<device-uuid>" }
    }
  }
}
`})}),`
`,(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.strong,{children:`Manual bearer tokens are the fallback`}),` for clients that can't complete OAuth at all. An authorized device user generates a time-bound token from the device's Security page, then sends it as either `,(0,n.jsx)(r.code,{children:`Authorization: Bearer <token>`}),` or `,(0,n.jsx)(r.code,{children:`X-Plotune-MCP-Bearer-Token: <token>`}),`. Manual token generation is unavailable from a degraded local-recovery session; see `,(0,n.jsx)(r.a,{href:`/docs/nexus/security-model`,children:`Security & Trust Model`}),` for why.`]}),`
`,(0,n.jsx)(r.p,{children:`OAuth dynamic client registration generally requires HTTPS. A client set to OAuth mode will fail against a plain-HTTP local device deployment before the request even reaches the device, since that's the client's own OAuth library rejecting a non-HTTPS authorization server, not a Nexus restriction. If that happens, switch the client to its static-header / manual-token configuration instead of its OAuth path.`}),`
`,(0,n.jsx)(r.h2,{children:`Client setup`}),`
`,(0,n.jsx)(r.p,{children:(0,n.jsx)(r.strong,{children:`Claude Code`})}),`
`,(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-bash`,children:`claude mcp add --transport http plotune-nexus http://<device-ip>/mcp
`})}),`
`,(0,n.jsx)(r.p,{children:(0,n.jsx)(r.strong,{children:`Codex`})}),`
`,(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-bash`,children:`codex mcp add plotuneNexus --url http://<device-ip>/mcp
`})}),`
`,(0,n.jsx)(r.p,{children:`For the cloud router endpoint, Codex's dynamic client registration works directly against the device-scoped URL:`}),`
`,(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-bash`,children:`codex mcp add plotune-nexus --url https://nexus.plotune.net/devices/<device-uuid>/mcp/
codex mcp login plotune-nexus
`})}),`
`,(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.strong,{children:`VS Code`}),`, in `,(0,n.jsx)(r.code,{children:`.vscode/mcp.json`}),`:`]}),`
`,(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-json`,children:`{
  "servers": {
    "plotune-nexus": { "type": "http", "url": "http://<device-ip>/mcp" }
  }
}
`})}),`
`,(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.strong,{children:`Cursor`}),`, in `,(0,n.jsx)(r.code,{children:`~/.cursor/mcp.json`}),`:`]}),`
`,(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-json`,children:`{
  "mcpServers": {
    "plotune-nexus": { "url": "http://<device-ip>/mcp" }
  }
}
`})}),`
`,(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.strong,{children:`OpenCode`}),`, using the manual bearer token path directly (the most reliable route for a local HTTP device deployment):`]}),`
`,(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-bash`,children:`opencode mcp add plotune-nexus --url http://<device-ip>/mcp \\
  --header "Authorization=Bearer <token>"
`})}),`
`,(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.strong,{children:`n8n`}),` can call Nexus MCP tools from ordinary workflows, without an LLM in the loop, using n8n's MCP Client node against the same `,(0,n.jsx)(r.code,{children:`/mcp`}),` endpoint and bearer-token model.`]}),`
`,(0,n.jsx)(r.h2,{children:`Resources vs. tools`}),`
`,(0,n.jsx)(r.p,{children:`Nexus separates read-only state from mutating actions. Use resources first for current-state reads, then tools for anything that changes state, transfers data, or runs a longer workflow:`}),`
`,(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.code,{children:`plotune://device/interfaces`}),`: currently attached/available interfaces`]}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.code,{children:`plotune://device/context`}),`: device identity and runtime status`]}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.code,{children:`plotune://artifacts/recent`}),`: recently produced recordings and artifacts`]}),`
`]}),`
`,(0,n.jsx)(r.h2,{children:`Representative tool surface`}),`
`,(0,n.jsxs)(r.p,{children:[`This is not the complete tool list, and the exact signature of any tool can change; it's meant to show the shape of the surface, not serve as a frozen spec. Confirm current tools and their parameters against your own connected device (`,(0,n.jsx)(r.code,{children:`get_runtime_capabilities_tool()`}),` and `,(0,n.jsx)(r.code,{children:`get_tooling_health_tool()`}),` report what's actually live).`]}),`
`,(0,n.jsxs)(r.table,{children:[(0,n.jsx)(r.thead,{children:(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.th,{children:`Category`}),(0,n.jsx)(r.th,{children:`Example tools`})]})}),(0,n.jsxs)(r.tbody,{children:[(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:`CAN`}),(0,n.jsxs)(r.td,{children:[(0,n.jsx)(r.code,{children:`create_virtual_can`}),`, `,(0,n.jsx)(r.code,{children:`acquire_can_interface`}),`, `,(0,n.jsx)(r.code,{children:`attach_slcan`}),`, `,(0,n.jsx)(r.code,{children:`configure_can_bitrate`}),`, `,(0,n.jsx)(r.code,{children:`send_dbc_message`}),`, `,(0,n.jsx)(r.code,{children:`wait_dbc_signal`}),`, `,(0,n.jsx)(r.code,{children:`record_can`}),`, `,(0,n.jsx)(r.code,{children:`release_stale_can_leases`})]})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:`UART`}),(0,n.jsxs)(r.td,{children:[(0,n.jsx)(r.code,{children:`open_uart_session`}),`, `,(0,n.jsx)(r.code,{children:`send_uart`}),`, `,(0,n.jsx)(r.code,{children:`read_uart`}),`, `,(0,n.jsx)(r.code,{children:`record_uart`}),`, `,(0,n.jsx)(r.code,{children:`get_uart_modem_lines`}),`, `,(0,n.jsx)(r.code,{children:`set_uart_modem_lines`}),`, `,(0,n.jsx)(r.code,{children:`close_uart_session`})]})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:`XCP`}),(0,n.jsxs)(r.td,{children:[(0,n.jsx)(r.code,{children:`record_xcp`}),`, `,(0,n.jsx)(r.code,{children:`read_xcp_calibration`}),`, `,(0,n.jsx)(r.code,{children:`set_xcp_calibration`})]})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:`DDS / ROS 2`}),(0,n.jsxs)(r.td,{children:[(0,n.jsx)(r.code,{children:`join_dds_session`}),`, `,(0,n.jsx)(r.code,{children:`list_dds_participants_tool`}),`, `,(0,n.jsx)(r.code,{children:`list_dds_topics_tool`}),`, `,(0,n.jsx)(r.code,{children:`capture_dds_snapshot`}),`, `,(0,n.jsx)(r.code,{children:`publish_dds_message`}),`, `,(0,n.jsx)(r.code,{children:`wait_dds_signal`}),`, `,(0,n.jsx)(r.code,{children:`record_dds_topics`}),`, `,(0,n.jsx)(r.code,{children:`leave_dds_session`})]})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:`Artifacts`}),(0,n.jsxs)(r.td,{children:[(0,n.jsx)(r.code,{children:`read_artifact`}),`, `,(0,n.jsx)(r.code,{children:`prepare_put_artifact`}),`, `,(0,n.jsx)(r.code,{children:`put_artifact`}),`, `,(0,n.jsx)(r.code,{children:`get_artifact`}),`, `,(0,n.jsx)(r.code,{children:`upload_to_artifact_drive`}),`, `,(0,n.jsx)(r.code,{children:`download_from_artifact_drive`})]})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:`Orchestration`}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:`run_test_sequence`})})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:`Containers`}),(0,n.jsxs)(r.td,{children:[(0,n.jsx)(r.code,{children:`start_container`}),` (used to run bundled protocol simulators or customer workloads under Nexus's managed container runtime)`]})]})]})]}),`
`,(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{children:`configure_can_bitrate`}),` takes standard CAN timing parameters directly: bitrate, sample point, SJW, and the phase-segment values, rather than only accepting a fixed preset list.`]}),`
`,(0,n.jsx)(r.h2,{children:`Job model`}),`
`,(0,n.jsx)(r.p,{children:`DAQ operations are asynchronous jobs, not blocking MCP calls, because recording and control work can be slow, stateful, and produce large outputs. A tool call that starts a job returns status, timestamps, and either an inline small result or a retrieval reference for larger artifacts, not the raw data itself for anything nontrivial in size.`}),`
`,(0,n.jsx)(r.h2,{children:`References`}),`
`,(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:(0,n.jsx)(r.a,{href:`https://modelcontextprotocol.io/specification/`,children:`Model Context Protocol specification`})}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.a,{href:`https://modelcontextprotocol.io/specification/basic/transports`,children:`MCP transport`}),`, HTTP + OAuth`]}),`
`,(0,n.jsx)(r.li,{children:(0,n.jsx)(r.a,{href:`https://datatracker.ietf.org/doc/html/rfc7591`,children:`OAuth 2.0 Dynamic Client Registration`})}),`
`]})]})}function i(e={}){let{wrapper:i}={...t(),...e.components};return i?(0,n.jsx)(i,{...e,children:(0,n.jsx)(r,{...e})}):r(e)}export{i as default};