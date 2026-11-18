import{t as e}from"./jsx-runtime-LKYXHABd.js";import{n as t}from"./lib-CTTP4Es4.js";var n=e();function r(e){let r={a:`a`,code:`code`,em:`em`,h2:`h2`,li:`li`,ol:`ol`,p:`p`,strong:`strong`,ul:`ul`,...t(),...e.components},{Note:i}=r;return i||a(`Note`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h2,{children:`Why this document exists`}),`
`,(0,n.jsx)(r.p,{children:`Giving an AI agent access to real test hardware raises a different question than giving it access to a shell: what happens when it's wrong, and who can prove what actually happened. This document describes how Plotune Nexus establishes device ownership, where cryptographic trust lives, what a degraded-access session can and cannot do, and which parts of the current design are still being hardened. Nothing below is a roadmap promise; it describes the shipped behavior as of this writing, with open items marked as open.`}),`
`,(0,n.jsx)(r.h2,{children:`Device identity and ownership`}),`
`,(0,n.jsx)(r.p,{children:`Ownership is bootstrapped on the device itself, not issued from the cloud.`}),`
`,(0,n.jsxs)(r.ol,{children:[`
`,(0,n.jsx)(r.li,{children:`During installation, the device generates and stores its own keypair locally.`}),`
`,(0,n.jsxs)(r.li,{children:[`The device registers public identity metadata (device ID, hardware ID, MAC address, public key) with Plotune's cloud router. This registration establishes durable `,(0,n.jsx)(r.em,{children:`identity`}),`, not `,(0,n.jsx)(r.em,{children:`ownership`}),`.`]}),`
`,(0,n.jsx)(r.li,{children:`An operator opens the device's local UI and signs in with a Plotune account.`}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`The first verified login on a new device is automatically promoted to device owner.`}),` There is no separate claim-code flow: signing in first is what establishes ownership.`]}),`
`,(0,n.jsx)(r.li,{children:`The owner is guided into a short setup review covering delegated access, a local recovery password, and the redirect-URI allow-list used for MCP OAuth clients.`}),`
`]}),`
`,(0,n.jsx)(i,{children:(0,n.jsx)(r.p,{children:`There is currently no router-backed claim or ownership-transfer API. Ownership authority and delegated-user access stay device-local: transferring ownership or reclaiming an unclaimed device happens through the device's own Security settings, not through a cloud endpoint. Whether this should change is an open decision, not a shipped feature.`})}),`
`,(0,n.jsx)(r.h2,{children:`Trust boundaries`}),`
`,(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`The device's private key never leaves the device.`}),` The router stores only the public half plus live route and verification state.`]}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`User authentication is delegated to an external identity provider`}),`, not reimplemented by Plotune.`]}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`Ownership authority stays local.`}),` Even Plotune's own cloud router cannot silently reassign a device's owner.`]}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`The installer can register a device's identity before any owner account exists.`}),` This is deliberate, and is what makes the closed-network provisioning flow below possible.`]}),`
`]}),`
`,(0,n.jsx)(r.h2,{children:`What a degraded (local-recovery) session can and cannot do`}),`
`,(0,n.jsx)(r.p,{children:`If an owner's Plotune account can't sign in but the device is still reachable, a previously-configured local recovery password grants degraded local access. This path exists specifically for closed-network and connectivity-loss scenarios, not as a general-purpose login method: it only works after a device already has an owner, and it authenticates as that same owner at reduced privilege, not as a separate identity.`}),`
`,(0,n.jsxs)(r.p,{children:[`A session opened this way `,(0,n.jsx)(r.strong,{children:`cannot`}),`:`]}),`
`,(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsx)(r.li,{children:`change delegated access or ownership,`}),`
`,(0,n.jsx)(r.li,{children:`change onboarding state,`}),`
`,(0,n.jsx)(r.li,{children:`change the local recovery credential itself,`}),`
`,(0,n.jsx)(r.li,{children:`issue new device-verification tokens, or`}),`
`,(0,n.jsx)(r.li,{children:`change OAuth trust settings, generate manual MCP bearer tokens, or reveal a saved app secret.`}),`
`]}),`
`,(0,n.jsx)(r.p,{children:`To do any of those, the owner has to sign back in with their actual Plotune account. The degraded path is deliberately narrower than the full owner session, not an equivalent backdoor.`}),`
`,(0,n.jsx)(r.h2,{children:`Agent access: bounded operations, not shell access`}),`
`,(0,n.jsxs)(r.p,{children:[`Nexus does not give an MCP client a shell on the device. It exposes a fixed set of typed tools (`,(0,n.jsx)(r.code,{children:`record_can`}),`, `,(0,n.jsx)(r.code,{children:`read_xcp_calibration`}),`, `,(0,n.jsx)(r.code,{children:`open_uart_session`}),`, and so on; the full current list is in the `,(0,n.jsx)(r.a,{href:`/docs/nexus/mcp-api`,children:`MCP Tools & API Reference`}),`) plus a small set of read-only resources for current-state reads. An agent can only invoke the operations the API exposes; it cannot run arbitrary commands on the host.`]}),`
`,(0,n.jsx)(r.p,{children:`Two authentication paths exist for reaching that tool surface:`}),`
`,(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`OAuth`}),`, the preferred path, which keeps redirect, consent, and client-registration behavior on a standard, auditable surface.`]}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`A manual bearer token`}),`, generated by the owner from the device's Security page, as a fallback for MCP clients that can't complete an OAuth flow. Manual token generation is itself one of the actions blocked in a degraded local-recovery session (see above), so minting a new agent credential always requires the owner's real identity.`]}),`
`]}),`
`,(0,n.jsx)(r.h2,{children:`What's still hardening`}),`
`,(0,n.jsx)(r.p,{children:`Stated directly, because a security document that only lists strengths isn't a security document:`}),`
`,(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`The device runtime currently runs with broad host privileges.`}),` Narrowing this to explicit, minimal device capabilities is ongoing work, not finished work.`]}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`Offline trust policy for a degraded cloud router is not yet fully defined.`}),` Local operation continues (see `,(0,n.jsx)(r.a,{href:`/docs/nexus/data-handling`,children:`Data Handling & Deployment Model`}),` for exactly what still works while air-gapped), but the formal policy for what "local trust" means when the router is unreachable is an open item.`]}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`Bring-your-own-cloud storage credentials are intended to be short-lived or delegated through presigned operations`}),`, not stored broadly on the device. This is a stated design constraint the team is holding itself to, not yet an independently audited guarantee.`]}),`
`]}),`
`,(0,n.jsx)(r.h2,{children:`References`}),`
`,(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsxs)(r.li,{children:[`Device Claim Flow and Closed-Network Provisioning are internal engineering documents this page summarizes; the closed-network operator checklist is public in `,(0,n.jsx)(r.a,{href:`/docs/nexus/data-handling`,children:`Data Handling & Deployment Model`}),`.`]}),`
`,(0,n.jsxs)(r.li,{children:[`MCP authorization model: `,(0,n.jsx)(r.a,{href:`https://modelcontextprotocol.io/specification/basic/authorization`,children:`Model Context Protocol specification, Authorization`})]}),`
`,(0,n.jsxs)(r.li,{children:[`OAuth 2.0 framework underlying Nexus's device OAuth flow: `,(0,n.jsx)(r.a,{href:`https://datatracker.ietf.org/doc/html/rfc6749`,children:`RFC 6749`})]}),`
`]})]})}function i(e={}){let{wrapper:i}={...t(),...e.components};return i?(0,n.jsx)(i,{...e,children:(0,n.jsx)(r,{...e})}):r(e)}function a(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{i as default};