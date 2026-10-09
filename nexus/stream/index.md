# From the bench.Into the event history.

Nexus / Stream integration



Nexus connects to physical test systems. Stream provides an independent event model for the software around them. Bring the context of an operation into an inspectable timeline.

[Contact Us ↗](https://www.plotune.net/contact?entry_source=direct)[Learn More →](https://www.plotune.net/nexus/connectivity)

The Stream demo experience runs in your browser with sample data. Continuous validation, automated actions and richer measurement workflows are explored in the separate future-product reference.

01 / Integration model  Illustrative workflow

## Test system

CAN · XCP · ROS 2 / DDS
Connected through supported Nexus interfaces

 → 

## Event source

Nexus or your application
Sender-supplied context

 → 

## Stream

Event name · timestamp · properties
Inspection and event history

02 / Context travels with the event [Stream overview ↗](https://www.plotune.net/stream)

01 

### Generate

Nexus or your own application produces an event with the engineering context it knows.

02 

### Send

A source that can make HTTP requests can send event data; Nexus is one possible source.

03 

### Inspect

Use the demo experience to explore event history, filters and the complete JSON payload.

04 

### Investigate

Follow a device or session across events. Keep the distinction between event history and raw measurements clear.

03 / Read, then explore

## Understand the data.Try the interface.

Nexus documentation describes local artifacts and result retrieval. The Stream demo shows a source-agnostic event envelope and example setup contracts.

[Try the demo experience ↗](https://www.plotune.net/stream/workspace)[Data handling →](https://www.plotune.net/docs/nexus/data-handling)

Illustrative event / not a live result 

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

Map an integration to your system

## Start with the source.Keep the context.

[Contact Us ↗](https://www.plotune.net/contact?entry_source=direct)[Explore connectivity →](https://www.plotune.net/nexus/connectivity)

Source: https://www.plotune.net/nexus/stream
