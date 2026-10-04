# Quick Start

[← Nexus documentation](https://www.plotune.net/docs/nexus)

Onboarding



From power-on to your first bounded hardware workflow: network setup, owner bootstrap, connecting an MCP client, and three runnable simulator-based examples that need no hardware yet.

Onboarding  6 min read  Updated 2026-09-26

## What's in the box

 

- The Nexus appliance (a Plotune-provisioned mini-PC)
 
- Power cable
 
- An Ethernet cable, if included with your unit

 

Nexus units are sealed managed appliances: don't open the chassis or remove or replace internal components. If a unit arrives damaged or looks wrong, contact Plotune support before powering it on.

 

## Step 1: Power on and find the device

 

- Connect the appliance to your network with Ethernet, and connect power. First boot can take a few minutes.
 
- How you find its address depends on what it's plugged into: 

- A router or gateway running DHCP  (the common case). Nexus takes an address the same way any other device on that network would. Check your router's connected-devices list.
 
- No DHCP, or you're not sure : Nexus always also listens at a fixed fallback address on any interface with a cable plugged in; try that directly.
 
- A direct cable from Nexus straight into your own computer , no router in between. There's no DHCP server on that link, so set your computer's Ethernet adapter to a static IP in the same subnet first, then open the fallback address. A static IP on the Nexus side alone isn't enough; your computer needs a compatible address too.

 

No software installation is required on the appliance itself. It arrives already provisioned and licensed.

 

## Step 2: First login and owner bootstrap

 

- From a computer on the same network, open a browser to the device's address.
 
- Sign in with your Plotune account through the local login flow.
 
- The first successful login on a new device automatically becomes the device owner.  There's no separate claim-code step: signing in first is what establishes ownership. See [Security & Trust Model](https://www.plotune.net/docs/nexus/security-model) for the full mechanics.
 
- You're then taken into a short guided setup review covering access and recovery basics. Most defaults are already usable, so accepting them and moving on is fine unless your deployment needs something different.

 

If you're setting this up for a team, make sure the right person performs this first login. Whoever logs in first becomes the owner and later manages delegated access for everyone else.

 

If your Plotune account can't sign in but you can still reach the device, an  existing  owner can use a local recovery password (configured from the device's Security page) for degraded local access. This path only works after a device already has an owner. It's not available for first-time setup on a brand-new device.

 

## Step 3: Review access and security (optional but recommended)

 

From the device UI, `Security` is where the owner manages delegated access, the local recovery password, and the redirect-URI allow-list used for MCP OAuth clients. `Settings` covers device configuration. Both are worth a one-time read before your first real workflow, but you can skip a deep review if the defaults work for you.

 

## Step 4: Connect an agent client

 

Once you're logged in and the appliance is reachable, connect an MCP-capable client (Claude Code, Codex, Cursor, VS Code, or an automation tool like n8n) to the device's MCP endpoint. Full per-client commands, the OAuth flow, and the manual bearer-token fallback are in [MCP Tools & API Reference](https://www.plotune.net/docs/nexus/mcp-api).

 

## Step 5: Run your first workflow

 

You don't need your own hardware connected yet. Nexus ships with runnable CAN, UART/XCP, and DDS simulators that stand in for real hardware, so you can exercise a full observe → act → measure loop on day one. All three follow the same shape:

 

- Start a plant/ECU stand-in (a simulator, packaged as a Nexus-managed container).
 
- Observe current state through an MCP client.
 
- Act on it through a bounded MCP tool call.
 
- Measure the result and capture it as an artifact.

 

CAN example : create a virtual CAN interface, start the bundled reactive CAN simulator, observe a quiet bus with `capture_can_snapshot`, send a DBC-encoded speed command with `send_dbc_message`, then gate on the simulator actually responding with `wait_dbc_signal` rather than just checking the command was sent, and capture the whole exchange with `record_can`.

 

UART/XCP example : a UART bring-up check against a deterministic PTY-backed echo simulator (`PING` → `PONG`), followed by an XCP-on-CAN measurement and calibration read/write loop against an XCP ECU stub.

 

DDS/ROS 2 example : join the simulated vehicle's DDS domain, discover its published topics, publish a throttle command (or let a bundled PID drive-cycle controller run the loop), gate on the vehicle actually reaching a target speed, and record the run to a single MCAP artifact.

 

Each example has a documented real-hardware equivalent: swap the simulator for your own interface, DBC, A2L, or ROS 2 graph, and the same tool calls apply unchanged.

 

## What's next

 

- Deploying into a network with no internet access? See [Data Handling & Deployment Model](https://www.plotune.net/docs/nexus/data-handling) for the provision-online-then-air-gap checklist.
 
- Once a single-step workflow runs cleanly, the natural next step is wrapping the same calls into a repeatable multi-step sequence.
 
- For anything not covered here, standard product support is available. See [Contact](https://www.plotune.net/contact).

 

## References

 

- [Model Context Protocol quickstart](https://modelcontextprotocol.io/quickstart)

Plotune Nexus: the appliance this guide sets up.

[See the product page](https://www.plotune.net/nexus?article=quick-start&entry_source=direct)

More Nexus documentation

[SecuritySecurity & Trust Model](https://www.plotune.net/docs/nexus/security-model)[CompatibilityHardware & Protocol Compatibility](https://www.plotune.net/docs/nexus/hardware-compatibility)[API ReferenceMCP Tools & API Reference](https://www.plotune.net/docs/nexus/mcp-api)[ArchitectureSystem Architecture](https://www.plotune.net/docs/nexus/architecture)[DeploymentData Handling & Deployment Model](https://www.plotune.net/docs/nexus/data-handling)[ProtocolsProtocol Notes: CAN, UDS, DoIP, XCP](https://www.plotune.net/docs/nexus/protocols)

Source: https://www.plotune.net/docs/nexus/quick-start
