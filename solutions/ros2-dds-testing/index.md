# Run unattended ROS 2 hardware tests without ROS tooling on your side

[← Related research](https://www.plotune.net/research)

ROS 2 / DDS Testing



Testing a ROS 2 robot usually means SSHing into the robot, running ros2 CLI commands by hand, and eyeballing topic echoes to decide whether a requirement passed, a process that does not scale past the one person who knows the stack.

[Discuss your setup](https://www.plotune.net/contact?segment=ros2-dds-testing&solution=ros2-dds-testing&entry_source=direct)[Explore Nexus](https://www.plotune.net/nexus?segment=ros2-dds-testing&solution=ros2-dds-testing&entry_source=direct)

Requirement-verdict gate on live telemetry  Example run

Runs

15 / 15 PASS

Gate evaluations

30 / 30 matched

Match latency

0.26 – 0.37 s

Flakes

0

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

## Supported integrations

CycloneDDS

Cross-host discovery

MCAP recording

wait_dds_signal gating

Containerized controller supervision

### See this mapped to your bench.

Plotune Nexus is one product, this is how it runs against ROS 2 / DDS Testing.

[Discuss your setup](https://www.plotune.net/contact?segment=ros2-dds-testing&solution=ros2-dds-testing&entry_source=direct)

Source: https://www.plotune.net/solutions/ros2-dds-testing
