import{t as e}from"./jsx-runtime-LKYXHABd.js";import{n as t}from"./lib-CTTP4Es4.js";var n=e();function r(e){let r={a:`a`,code:`code`,em:`em`,h2:`h2`,li:`li`,ol:`ol`,p:`p`,strong:`strong`,ul:`ul`,...t(),...e.components},{Note:i}=r;return i||a(`Note`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h2,{children:`What's in the box`}),`
`,(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`The Nexus appliance (a Plotune-provisioned mini-PC)`}),`
`,(0,n.jsx)(r.li,{children:`Power cable`}),`
`,(0,n.jsx)(r.li,{children:`An Ethernet cable, if included with your unit`}),`
`]}),`
`,(0,n.jsx)(r.p,{children:`Nexus units are sealed managed appliances: don't open the chassis or remove or replace internal components. If a unit arrives damaged or looks wrong, contact Plotune support before powering it on.`}),`
`,(0,n.jsx)(r.h2,{children:`Step 1: Power on and find the device`}),`
`,(0,n.jsxs)(r.ol,{children:[`
`,(0,n.jsx)(r.li,{children:`Connect the appliance to your network with Ethernet, and connect power. First boot can take a few minutes.`}),`
`,(0,n.jsxs)(r.li,{children:[`How you find its address depends on what it's plugged into:`,`
`,(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`A router or gateway running DHCP`}),` (the common case). Nexus takes an address the same way any other device on that network would. Check your router's connected-devices list.`]}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`No DHCP, or you're not sure`}),`: Nexus always also listens at a fixed fallback address on any interface with a cable plugged in; try that directly.`]}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`A direct cable from Nexus straight into your own computer`}),`, no router in between. There's no DHCP server on that link, so set your computer's Ethernet adapter to a static IP in the same subnet first, then open the fallback address. A static IP on the Nexus side alone isn't enough; your computer needs a compatible address too.`]}),`
`]}),`
`]}),`
`]}),`
`,(0,n.jsx)(r.p,{children:`No software installation is required on the appliance itself. It arrives already provisioned and licensed.`}),`
`,(0,n.jsx)(r.h2,{children:`Step 2: First login and owner bootstrap`}),`
`,(0,n.jsxs)(r.ol,{children:[`
`,(0,n.jsx)(r.li,{children:`From a computer on the same network, open a browser to the device's address.`}),`
`,(0,n.jsx)(r.li,{children:`Sign in with your Plotune account through the local login flow.`}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`The first successful login on a new device automatically becomes the device owner.`}),` There's no separate claim-code step: signing in first is what establishes ownership. See `,(0,n.jsx)(r.a,{href:`/docs/nexus/security-model`,children:`Security & Trust Model`}),` for the full mechanics.`]}),`
`,(0,n.jsx)(r.li,{children:`You're then taken into a short guided setup review covering access and recovery basics. Most defaults are already usable, so accepting them and moving on is fine unless your deployment needs something different.`}),`
`]}),`
`,(0,n.jsx)(r.p,{children:`If you're setting this up for a team, make sure the right person performs this first login. Whoever logs in first becomes the owner and later manages delegated access for everyone else.`}),`
`,(0,n.jsx)(i,{children:(0,n.jsxs)(r.p,{children:[`If your Plotune account can't sign in but you can still reach the device, an `,(0,n.jsx)(r.em,{children:`existing`}),` owner can use a local recovery password (configured from the device's Security page) for degraded local access. This path only works after a device already has an owner. It's not available for first-time setup on a brand-new device.`]})}),`
`,(0,n.jsx)(r.h2,{children:`Step 3: Review access and security (optional but recommended)`}),`
`,(0,n.jsxs)(r.p,{children:[`From the device UI, `,(0,n.jsx)(r.code,{children:`Security`}),` is where the owner manages delegated access, the local recovery password, and the redirect-URI allow-list used for MCP OAuth clients. `,(0,n.jsx)(r.code,{children:`Settings`}),` covers device configuration. Both are worth a one-time read before your first real workflow, but you can skip a deep review if the defaults work for you.`]}),`
`,(0,n.jsx)(r.h2,{children:`Step 4: Connect an agent client`}),`
`,(0,n.jsxs)(r.p,{children:[`Once you're logged in and the appliance is reachable, connect an MCP-capable client (Claude Code, Codex, Cursor, VS Code, or an automation tool like n8n) to the device's MCP endpoint. Full per-client commands, the OAuth flow, and the manual bearer-token fallback are in `,(0,n.jsx)(r.a,{href:`/docs/nexus/mcp-api`,children:`MCP Tools & API Reference`}),`.`]}),`
`,(0,n.jsx)(r.h2,{children:`Step 5: Run your first workflow`}),`
`,(0,n.jsx)(r.p,{children:`You don't need your own hardware connected yet. Nexus ships with runnable CAN, UART/XCP, and DDS simulators that stand in for real hardware, so you can exercise a full observe → act → measure loop on day one. All three follow the same shape:`}),`
`,(0,n.jsxs)(r.ol,{children:[`
`,(0,n.jsx)(r.li,{children:`Start a plant/ECU stand-in (a simulator, packaged as a Nexus-managed container).`}),`
`,(0,n.jsx)(r.li,{children:`Observe current state through an MCP client.`}),`
`,(0,n.jsx)(r.li,{children:`Act on it through a bounded MCP tool call.`}),`
`,(0,n.jsx)(r.li,{children:`Measure the result and capture it as an artifact.`}),`
`]}),`
`,(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.strong,{children:`CAN example`}),`: create a virtual CAN interface, start the bundled reactive CAN simulator, observe a quiet bus with `,(0,n.jsx)(r.code,{children:`capture_can_snapshot`}),`, send a DBC-encoded speed command with `,(0,n.jsx)(r.code,{children:`send_dbc_message`}),`, then gate on the simulator actually responding with `,(0,n.jsx)(r.code,{children:`wait_dbc_signal`}),` rather than just checking the command was sent, and capture the whole exchange with `,(0,n.jsx)(r.code,{children:`record_can`}),`.`]}),`
`,(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.strong,{children:`UART/XCP example`}),`: a UART bring-up check against a deterministic PTY-backed echo simulator (`,(0,n.jsx)(r.code,{children:`PING`}),` → `,(0,n.jsx)(r.code,{children:`PONG`}),`), followed by an XCP-on-CAN measurement and calibration read/write loop against an XCP ECU stub.`]}),`
`,(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.strong,{children:`DDS/ROS 2 example`}),`: join the simulated vehicle's DDS domain, discover its published topics, publish a throttle command (or let a bundled PID drive-cycle controller run the loop), gate on the vehicle actually reaching a target speed, and record the run to a single MCAP artifact.`]}),`
`,(0,n.jsx)(r.p,{children:`Each example has a documented real-hardware equivalent: swap the simulator for your own interface, DBC, A2L, or ROS 2 graph, and the same tool calls apply unchanged.`}),`
`,(0,n.jsx)(r.h2,{children:`What's next`}),`
`,(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsxs)(r.li,{children:[`Deploying into a network with no internet access? See `,(0,n.jsx)(r.a,{href:`/docs/nexus/data-handling`,children:`Data Handling & Deployment Model`}),` for the provision-online-then-air-gap checklist.`]}),`
`,(0,n.jsx)(r.li,{children:`Once a single-step workflow runs cleanly, the natural next step is wrapping the same calls into a repeatable multi-step sequence.`}),`
`,(0,n.jsxs)(r.li,{children:[`For anything not covered here, standard product support is available. See `,(0,n.jsx)(r.a,{href:`/contact`,children:`Contact`}),`.`]}),`
`]}),`
`,(0,n.jsx)(r.h2,{children:`References`}),`
`,(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:(0,n.jsx)(r.a,{href:`https://modelcontextprotocol.io/quickstart`,children:`Model Context Protocol quickstart`})}),`
`]})]})}function i(e={}){let{wrapper:i}={...t(),...e.components};return i?(0,n.jsx)(i,{...e,children:(0,n.jsx)(r,{...e})}):r(e)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};