# Automate CAN-based ECU testing without losing the engineer in the loop

## The workflow today

- Attach the adapter and bring the bus up manually before every run

- Hand-craft or replay raw frames from a DBC, one test at a time

- Watch signals in a scope tool and decide pass/fail by eye

- Write up what happened afterward, from memory or screenshots

## With Plotune Nexus

- Acquire the CAN interface as a bounded operation, released when the run ends

- Encode and send only the approved message from your DBC, at the required cycle time

- Gate the next step on a decoded signal condition instead of a fixed wait

- Package the run as one reviewable artifact: trace, decoded signals, and verdict together

## Works with.

Supported integrations for this workflow.

- Classic CAN

- CAN FD (SocketCAN)

- DBC decode / encode

- XCP-on-CAN

- UDS over CAN / DoIP

## More Nexus workflows.

[NexusROS 2 / DDS testingRun unattended hardware tests and judge requirements on live telemetry, without ROS tooling on your side.See the workflow →](https://www.plotune.net/solutions/ros2-dds-testing?entry_source=direct)[NexusTest automationLet agents run, watch and re-run sequences, so an engineer is not needed in the loop for every build.See the workflow →](https://www.plotune.net/solutions/test-orchestration?entry_source=direct)[NexusAI hardware-in-the-loopGive AI agents access to real hardware while you keep control of the boundary.See the workflow →](https://www.plotune.net/solutions/hil-testing?entry_source=direct)

## See this mapped to your bench.

Plotune Nexus is one product. This is how it runs against CAN / ECU Testing.

[Discuss your setup](https://www.plotune.net/contact?segment=can-ecu-testing&solution=can-ecu-testing&entry_source=direct)

Source: https://www.plotune.net/solutions/can-ecu-testing
