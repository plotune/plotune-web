import{t as e}from"./jsx-runtime-LKYXHABd.js";import{n as t}from"./lib-CTTP4Es4.js";var n=e();function r(e){let r={a:`a`,code:`code`,h2:`h2`,li:`li`,ol:`ol`,p:`p`,strong:`strong`,ul:`ul`,...t(),...e.components},{Note:i}=r;return i||a(`Note`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h2,{children:`Recording path`}),`
`,(0,n.jsxs)(r.ol,{children:[`
`,(0,n.jsx)(r.li,{children:`An agent calls an MCP tool, either directly on the device or through Plotune's cloud router.`}),`
`,(0,n.jsxs)(r.li,{children:[`The device may first serve read-only context through MCP resources (`,(0,n.jsx)(r.code,{children:`plotune://device/context`}),`, `,(0,n.jsx)(r.code,{children:`plotune://device/interfaces`}),`, `,(0,n.jsx)(r.code,{children:`plotune://artifacts/recent`}),`) before any mutating call.`]}),`
`,(0,n.jsx)(r.li,{children:`The device validates the request and creates an async job when the work is long-running or stateful, rather than blocking the MCP call itself.`}),`
`,(0,n.jsx)(r.li,{children:`The job reads from the relevant DAQ interface and writes local output to the device's own artifact store first.`}),`
`,(0,n.jsxs)(r.li,{children:[`Small textual results can return directly in the MCP response; bounded local reads are available through `,(0,n.jsx)(r.code,{children:`read_artifact`}),` before any export happens.`]}),`
`,(0,n.jsxs)(r.li,{children:[`Larger or externalized outputs move through one of two current paths: Plotune-managed transfer-cloud handoff (`,(0,n.jsx)(r.code,{children:`prepare_put_artifact`}),` / `,(0,n.jsx)(r.code,{children:`put_artifact`}),` / `,(0,n.jsx)(r.code,{children:`get_artifact`}),`), or a configured artifact drive (`,(0,n.jsx)(r.code,{children:`upload_to_artifact_drive`}),` / `,(0,n.jsx)(r.code,{children:`download_from_artifact_drive`}),`).`]}),`
`,(0,n.jsx)(r.li,{children:`The job's final result returns status, timestamps, artifact metadata, and a signed retrieval path where relevant.`}),`
`]}),`
`,(0,n.jsx)(r.p,{children:`Async execution is a deliberate choice, not an implementation detail: DAQ operations can be slow, stateful, and produce large outputs, and tying MCP request lifetime to recording duration would make retries, cancellation, and upload handling far harder to reason about.`}),`
`,(0,n.jsx)(r.h2,{children:`Where data actually lands`}),`
`,(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`Device-local storage is the first landing zone for every completed job.`}),` Nothing skips this step to go straight to a cloud destination.`]}),`
`,(0,n.jsx)(r.li,{children:(0,n.jsx)(r.strong,{children:`Bounded local reads are available before export.`})}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`Configured artifact-drive integrations today`}),`: local files, plus `,(0,n.jsx)(r.code,{children:`rclone`}),`-managed remotes such as SFTP, Google Drive, and OneDrive/SharePoint.`]}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`Bring-your-own cloud object storage is a stated design direction`}),`, but it is not the only current transfer path; the shipped default handoff is Plotune-managed rather than a customer's own object storage bucket.`]}),`
`]}),`
`,(0,n.jsx)(r.h2,{children:`Data classes`}),`
`,(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`Control metadata`}),`: job status, session IDs, tool inputs, timestamps.`]}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`Small results`}),`: plain JSON or text, returned inline in the MCP response.`]}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`Artifacts`}),`: raw traces, binary captures, logs, and derived files, handled through the artifact-store and export paths above rather than inline responses.`]}),`
`]}),`
`,(0,n.jsx)(r.h2,{children:`Deploying into a closed network`}),`
`,(0,n.jsxs)(r.p,{children:[`Nexus supports deployment into a lab network, air-gapped test cell, or customer site with no outbound internet route, under one specific model: `,(0,n.jsx)(r.strong,{children:`provision online, then air-gap.`})]}),`
`,(0,n.jsxs)(r.p,{children:[`Ownership bootstrap is deliberately tied to verifying a real Plotune account, which requires reaching Plotune's platform API at least once (see `,(0,n.jsx)(r.a,{href:`/docs/nexus/security-model`,children:`Security & Trust Model`}),`). Claiming a device with zero internet access from first boot is not supported. This is a stated product position, not a gap the team is working around.`]}),`
`,(0,n.jsx)(r.p,{children:(0,n.jsx)(r.strong,{children:`Checklist:`})}),`
`,(0,n.jsxs)(r.ol,{children:[`
`,(0,n.jsxs)(r.li,{children:[`Provision the device with internet access reachable to `,(0,n.jsx)(r.code,{children:`nexus.plotune.net`}),`.`]}),`
`,(0,n.jsx)(r.li,{children:`Confirm registration actually completed, not just that the device booted. Registration failures don't stop the install, so a booted device isn't proof of a registered one. Check the device registration status file or the console MOTD auth-status line.`}),`
`,(0,n.jsx)(r.li,{children:`Complete first-owner login while still online.`}),`
`,(0,n.jsx)(r.li,{children:`Set a local fallback password from the device's Security page before disconnecting. This is what makes local UI login and MCP bearer-token verification both fully local afterward, with no further dependency on reaching the router at request time.`}),`
`,(0,n.jsx)(r.li,{children:`Only then move the device into the closed network.`}),`
`]}),`
`,(0,n.jsx)(i,{children:(0,n.jsxs)(r.p,{children:[`A device moved into the closed network `,(0,n.jsx)(r.strong,{children:`before`}),` registration reaches a confirmed registered state will keep retrying forever with no way to reach `,(0,n.jsx)(r.code,{children:`nexus.plotune.net`}),` from inside an air-gapped network. This doesn't block local operation, but the device will never show as registered in the router's inventory, and nothing in the software resolves it automatically. It's an operator-checklist step, not a self-healing one.`]})}),`
`,(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.strong,{children:`What still works once air-gapped:`}),` local UI login via the fallback password, MCP tool calls authenticated with a bearer token issued before disconnecting (or a new owner-generated manual token), and all local DAQ operations (CAN, UART, XCP, DoIP, recording). None of these ever depended on the router or the Plotune platform API. The device also always listens at a fixed fallback address on any connected interface, useful when the closed network has no DHCP server.`]}),`
`,(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.strong,{children:`What doesn't work offline:`}),` claiming ownership on a device with no owner yet, and adding a new authorized user or transferring ownership. Both require a live Plotune-account login, the same as first-owner bootstrap.`]}),`
`,(0,n.jsx)(r.h2,{children:`References`}),`
`,(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.a,{href:`https://rclone.org/`,children:(0,n.jsx)(r.code,{children:`rclone`})}),`, used for configured artifact-drive remotes`]}),`
`,(0,n.jsx)(r.li,{children:(0,n.jsx)(r.a,{href:`https://modelcontextprotocol.io/specification/server/resources`,children:`Model Context Protocol resources and tools`})}),`
`]})]})}function i(e={}){let{wrapper:i}={...t(),...e.components};return i?(0,n.jsx)(i,{...e,children:(0,n.jsx)(r,{...e})}):r(e)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};