# Run unattended ROS 2 hardware tests without ROS tooling on your side

## The workflow today

- SSH into the robot and run ros2 topic echo / ros2 service call by hand

- Eyeball telemetry in a terminal to judge whether a requirement passed

- Re-run the same manual steps for every regression check

- No artifact: the "evidence" is whoever happened to be watching the terminal

## With Plotune Nexus

- Join the robot's DDS domain over the network, no ROS tooling needed on your side

- Publish a bounded command and gate the next step on live telemetry, not a fixed wait

- Record multiple topics into a single MCAP artifact as an unattended, bounded job

- Wrap join → command → gate → record into one repeatable sequence with a pass/fail verdict

## Works with.

Supported integrations for this workflow.

- CycloneDDS

- Cross-host discovery

- MCAP recording

- wait_dds_signal gating

- Containerized controller supervision

## More Nexus workflows.

[NexusCAN / ECU testingAcquire the interface, send only the approved message, gate on decoded signals and package the run as one reviewable artifact.See the workflow →](https://www.plotune.net/solutions/can-ecu-testing?entry_source=direct)[NexusTest automationLet agents run, watch and re-run sequences, so an engineer is not needed in the loop for every build.See the workflow →](https://www.plotune.net/solutions/test-orchestration?entry_source=direct)[NexusAI hardware-in-the-loopGive AI agents access to real hardware while you keep control of the boundary.See the workflow →](https://www.plotune.net/solutions/hil-testing?entry_source=direct)

## See this mapped to your bench.

Plotune Nexus is one product. This is how it runs against ROS 2 / DDS Testing.

[Discuss your setup](https://www.plotune.net/contact?segment=ros2-dds-testing&solution=ros2-dds-testing&entry_source=direct)

Source: https://www.plotune.net/solutions/ros2-dds-testing
