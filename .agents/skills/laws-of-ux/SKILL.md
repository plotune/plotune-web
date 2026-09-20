---
name: laws-of-ux
description: Use when auditing, verifying, or making scoped UX fixes from screens, prototypes, or product source evidence.
---

# Laws of UX Review

Use the [Laws of UX](https://lawsofux.com/) as decision aids, not a substitute for product requirements, accessibility, usability research, or measurement.

## Select the mode

- **Audit:** identify and report issues; do not change the product.
- **Fix:** make a targeted, in-scope change only when the evidence supports it, then re-audit the affected flow.

Before either mode, collect the relevant screen, prototype, or source evidence and state the user task and viewport or state being reviewed. Do not infer behavior that the evidence cannot support.

## Review and report

Read [the law checks reference](references/law-checks.md) and examine only laws relevant to the user task. For every finding, record the law, evidence, user impact, location/state, and recommended change. Group findings by severity:

- **High:** blocks a primary task, creates a likely error, or conceals important state.
- **Medium:** materially slows, confuses, or increases effort in a common task.
- **Low:** a localized clarity or polish issue with limited task impact.

Report **five or fewer** findings by default, prioritizing high severity and distinct root causes. Exceed five only when the requester asks for comprehensive coverage or more than five high-severity issues are independently evidenced; say why.

## Fix pass

Keep changes minimal and within the requested scope. Preserve established patterns unless the evidence shows that they are causing the issue; do not redesign adjacent screens or add unrequested features. After changing the product, re-audit the affected task and report what was resolved, what remains, and any evidence still needed.
