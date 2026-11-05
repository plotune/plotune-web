# From the bench. Into the event history.

## Context travels with the event.

[Stream overview ↗](https://www.plotune.net/stream)

- Step 1 

### Generate

Nexus or your own application produces an event with the engineering context it knows.

- Step 2 

### Send

A source that can make HTTP requests can send event data; Nexus is one possible source.

- Step 3 

### Inspect

Use the demo experience to explore event history, filters and the complete JSON payload.

- Step 4 

### Investigate

Follow a device or session across events. Keep the distinction between event history and raw measurements clear.

## Understand the data. Try the interface.

Nexus documentation describes local artifacts and result retrieval. The Stream demo shows a source-agnostic event envelope and example setup contracts.

[Try the demo experience](https://www.plotune.net/stream/demo)[Data handling](https://www.plotune.net/docs/nexus/data-handling)

Illustrative event, not a live result 

```
{
  "event": "test.completed",
  "device_id": "nexus-bench-01",
  "session_id": "example-run",
  "properties": {
    "artifact": "local-recording",
    "outcome": "passed"
  }
}
```

## Start with the source.Keep the context.

Map an integration to your system.

[Contact us](https://www.plotune.net/contact?entry_source=direct)[Explore connectivity](https://www.plotune.net/nexus/connectivity)

Source: https://www.plotune.net/nexus/stream
