# Plotune Stream MVP exploration

`/stream/workspace` is the small event-infrastructure prototype. Events is the
project's default surface. Navigation contains only Events, API setup, MCP setup,
and Project Settings. The original public `/streams` page remains unchanged;
`/stream` is still not a public route in this repository.

The richer engineering workspace remains at `/stream/prototypes/vision` in
`src/StreamWorkspace`. It is absent from MVP navigation and independently lazy loaded.

## Activation and exploration

Create a project (or select My first project), copy its curl example, and use
Simulate first event to demonstrate receipt in the explorer. Language alternatives
are compact examples; the CAPL example is explicitly HTTP-adapter pseudocode.

Events contain a name, optional sender-supplied `device_id` and `session_id`, timestamp,
and arbitrary JSON properties. Stream does not register, infer, or generate these
context identifiers. There is no
configured hardware schema or built-in meaning for event names. The explorer shows
three discovered properties per row, summarizes nested JSON, and exposes everything
in a detail drawer. Search includes nested properties. Native filters cover event
name, device, session, relative time, and exact UTC time; explicit ranges use an
inclusive start and exclusive end. Unspecified device/session values are selectable.
Native filters combine with custom property conditions in the same query. Results are
newest first. New-event preview requires
an explicit simulate action and holds received events behind an indication so the
list does not move during inspection. Showing those events resets filters explicitly.

API setup and project settings share a mock project key. Reveal, copy, and confirmed
regeneration are local. Regeneration also updates all examples and resets MCP's mock
connection status. MCP describes querying project event history only.

Usage is a mock account-wide allowance of 100,000 accepted events per month. It
increments when preview events are accepted. There is no billing UI.

Everything is frontend state and resets on reload. No endpoint is contacted, no real
key is issued, no model is called, and nothing is stored remotely. Endpoint addresses
and capture/MCP formats are illustrative contracts, not promises of released APIs.
Production requires capture/storage/query support for these optional fields, filtering
and export across them, and project-wide identifier discovery independent of the
current page. No external backend was changed.

## UX and checks

The small navigation minimizes decisions. Empty projects show the activation path
instead of dashboard widgets. Code examples, key controls, and connection details
are grouped; complete JSON and key regeneration use progressive disclosure. The
existing light Plotune shell, scoped styles, and native dialog focus handling are
reused. Phone event rows show the event, time, and properties without a desktop table
squeeze. Desktop and tablet retain the compact table.

Run `npm test -- --watchAll=false --runInBand` and `npm run build`. The build's existing
prerender pipeline needs Playwright Chromium and network access for the Download
page's release lookup. Publish through the existing gh-pages deployment command.
