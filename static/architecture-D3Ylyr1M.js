import{t as e}from"./jsx-runtime-LKYXHABd.js";import{n as t}from"./lib-CTTP4Es4.js";var n=e();function r(e){let r={a:`a`,code:`code`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...t(),...e.components},{Note:i}=r;return i||a(`Note`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h2,{children:`System boundary`}),`
`,(0,n.jsx)(r.p,{children:`Plotune Nexus is an appliance-style DAQ and MCP server, built around three planes rather than one monolithic service:`}),`
`,(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`Device plane`}),`: runs on the Nexus appliance itself, on customer premises, and owns hardware interaction.`]}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`Control plane`}),`: runs in Plotune's cloud and owns device registration, remote routing, and policy.`]}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`Data plane`}),`: owns recorded artifacts, specifically where they land, how they move, and how long they're kept.`]}),`
`]}),`
`,(0,n.jsx)(r.p,{children:`The standard deployment model is Plotune-defined hardware plus Plotune-managed software lifecycle, not software a customer self-installs on an arbitrary bench PC. That contract is what the rest of this document explains and protects.`}),`
`,(0,n.jsx)(r.h2,{children:`What the customer gets`}),`
`,(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-text`,children:`              Plotune standard product

    +----------------------------------------------+
    | Plotune-defined Nexus appliance               |
    | - qualified hardware                          |
    | - Nexus software pre-integrated               |
    | - updates, support, and lifecycle handling    |
    +----------------------+-----------------------+
                           |
                           v
    +----------------------------------------------+
    | One managed box for real hardware workflows   |
    | - local UI for setup and access               |
    | - MCP/API surface for agents and tools        |
    | - async jobs for capture, send, record        |
    +----------------------+-----------------------+
                           |
                           v
    +----------------------------------------------+
    | Bench, rig, or vehicle interfaces             |
    | - CAN (classical + CAN FD)                    |
    | - UART (RS-485, modem-control lines)          |
    | - XCP-on-CAN and XCP-on-Ethernet              |
    | - UDS-over-DoIP                               |
    +----------------------------------------------+
`})}),`
`,(0,n.jsx)(r.h2,{children:`What stays local vs. what touches Plotune cloud`}),`
`,(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-text`,children:`  customer site boundary

  +---------------------------------------------------------------+
  | Plotune Nexus appliance                                       |
  |                                                                |
  |  operators / local browser / MCP clients                      |
  |                 |                                              |
  |                 v                                              |
  |         local UI + local API (auth session + job control)      |
  |                 |                                              |
  |                 v                                              |
  |         CAN / UART / XCP / DoIP  -----> real hardware          |
  |                 |                                              |
  |                 v                                              |
  |         local artifacts first (logs, traces, recordings)       |
  +-----------------------|----------------------------------------+
                          |
                          | optional routing, identity, export
                          v
  +---------------------------------------------------------------+
  | Plotune cloud / customer-selected storage                     |
  | - remote MCP routing and policy                               |
  | - identity and entitlement integration                        |
  | - transfer-cloud handoff or configured artifact drives         |
  +---------------------------------------------------------------+
`})}),`
`,(0,n.jsxs)(r.p,{children:[`The rule this diagram is drawn to protect: `,(0,n.jsx)(r.strong,{children:`hardware interaction and first-write artifacts happen on the device.`}),` Cloud services help with routing, identity, licensing, and export, but Nexus is designed to stay useful even when the cloud path is degraded.`]}),`
`,(0,n.jsx)(r.h2,{children:`The three planes in detail`}),`
`,(0,n.jsx)(r.h3,{children:`Device plane`}),`
`,(0,n.jsxs)(r.p,{children:[`Runs on the appliance. Owns local MCP tools for DAQ actions, the shipped hardware adapters (see `,(0,n.jsx)(r.a,{href:`/docs/nexus/hardware-compatibility`,children:`Hardware & Protocol Compatibility`}),`), job execution, local buffering and session state, device lifecycle (deployment, update, rollback, recovery), and uploads to object storage.`]}),`
`,(0,n.jsx)(r.h3,{children:`Control plane`}),`
`,(0,n.jsx)(r.p,{children:`Runs in Plotune's cloud. Owns device registration and device-signed verification, reachability/heartbeat, remote MCP routing, authorization checks before routing MCP traffic, and license/entitlement integration. External identity providers stay outside this layer; the control plane integrates with them rather than reimplementing authentication.`}),`
`,(0,n.jsx)(r.h3,{children:`Data plane`}),`
`,(0,n.jsxs)(r.p,{children:[`Owns recorded artifacts and analysis handoff: upload targets for raw recordings, presigned upload/download URLs, retention policy, and the metadata returned to an agent once a job completes. See `,(0,n.jsx)(r.a,{href:`/docs/nexus/data-handling`,children:`Data Handling & Deployment Model`}),` for the full artifact lifecycle.`]}),`
`,(0,n.jsx)(r.h2,{children:`Core flows`}),`
`,(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.strong,{children:`Device registration and owner bootstrap`}),`, covered in full in `,(0,n.jsx)(r.a,{href:`/docs/nexus/security-model`,children:`Security & Trust Model`}),`: a locally generated keypair, router registration of public identity, and ownership established by the first verified local login.`]}),`
`,(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.strong,{children:`Recording`}),`: an agent calls a local or routed MCP tool; the device starts an async job; the job writes local temporary data first; large or binary outputs move through transfer-cloud handoff or a configured artifact drive as needed; the MCP response returns status, metadata, and a retrieval path.`]}),`
`,(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.strong,{children:`Remote MCP access`}),`: the user authenticates against Plotune-managed identity services; the router resolves the correct device route, applies policy, and preserves device-scoped OAuth; the router forwards MCP traffic to the correct device session.`]}),`
`,(0,n.jsx)(r.h2,{children:`Stated constraints, not hidden ones`}),`
`,(0,n.jsx)(i,{children:(0,n.jsx)(r.p,{children:`The device runtime currently runs with broad host privileges. Reducing this to explicit, minimal device capabilities over time is acknowledged, ongoing engineering work, not a finished guarantee. Offline trust policy for a degraded control-plane connection is likewise still being formally defined, even though local operation already continues without it (see Data Handling & Deployment Model). Recording is deliberately modeled as async work rather than a blocking call specifically because DAQ operations don't fit a synchronous request lifecycle.`})}),`
`,(0,n.jsx)(r.h2,{children:`References`}),`
`,(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:(0,n.jsx)(r.a,{href:`https://modelcontextprotocol.io/docs/learn/architecture`,children:`Model Context Protocol architecture overview`})}),`
`,(0,n.jsx)(r.li,{children:(0,n.jsx)(r.a,{href:`https://www.kernel.org/doc/html/latest/networking/can.html`,children:`Linux SocketCAN documentation`})}),`
`]})]})}function i(e={}){let{wrapper:i}={...t(),...e.components};return i?(0,n.jsx)(i,{...e,children:(0,n.jsx)(r,{...e})}):r(e)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};