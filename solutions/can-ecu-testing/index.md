# Automate CAN-based ECU testing without losing the engineer in the loop

[← Related research](https://www.plotune.net/research)

CAN / ECU Testing



A CAN or ECU test procedure is never just "send a frame." It is acquire the interface, send only the approved message, watch the gateway or ECU response, capture evidence, and release the bus cleanly. Every one of those steps is usually done by hand, on a laptop, by whoever is free that day.

[Discuss your setup](https://www.plotune.net/contact?segment=can-ecu-testing&solution=can-ecu-testing&entry_source=direct)[Explore Nexus](https://www.plotune.net/nexus?segment=can-ecu-testing&solution=can-ecu-testing&entry_source=direct)

Release-gate CAN capture  Example run

Commanded pressure

38.2 bar

Measured pressure

37.9 bar

Gateway dropouts

0

Decision

release evidence ready

## The workflow today

- 01  Attach the adapter and bring the bus up manually before every run

- 02  Hand-craft or replay raw frames from a DBC, one test at a time

- 03  Watch signals in a scope tool and decide pass/fail by eye

- 04  Write up what happened afterward, from memory or screenshots

## With Plotune Nexus

- 01  Acquire the CAN interface as a bounded operation, released when the run ends

- 02  Encode and send only the approved message from your DBC, at the required cycle time

- 03  Gate the next step on a decoded signal condition instead of a fixed wait

- 04  Package the run as one reviewable artifact: trace, decoded signals, and verdict together

## Supported integrations

Classic CAN

CAN FD (SocketCAN)

DBC decode / encode

XCP-on-CAN

UDS over CAN / DoIP

### See this mapped to your bench.

Plotune Nexus is one product, this is how it runs against CAN / ECU Testing.

[Discuss your setup](https://www.plotune.net/contact?segment=can-ecu-testing&solution=can-ecu-testing&entry_source=direct)

Source: https://www.plotune.net/solutions/can-ecu-testing
