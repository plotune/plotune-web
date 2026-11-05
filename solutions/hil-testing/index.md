# Give AI agents access to real hardware without giving up control of the boundary

## The workflow today

- Run the simulator and controller on whichever engineer's machine last set it up

- Bridge virtual and real hardware by hand, with no enforced boundary on what crosses

- Give an AI agent either full shell access or no access at all, with no middle ground

- Trust a "looks right" run instead of a boundary you can point to and prove

## With Plotune Nexus

- Run the controller or simulator as a staged container, not a laptop only one person can restart

- Bridge virtual and real CAN through a policy gateway that lets only approved frames cross

- Give the agent a bounded operation set (acquire, capture, wait, send only approved frames, stop, package), not raw shell access

- Connect over MCP with OAuth and delegated access, so what the agent can touch is a policy decision, not a trust exercise

## Works with.

Supported integrations for this workflow.

- Containerized simulation

- Virtual CAN + policy gateway

- MCP + OAuth

- Bounded operation set

## More Nexus workflows.

[NexusCAN / ECU testingAcquire the interface, send only the approved message, gate on decoded signals and package the run as one reviewable artifact.See the workflow →](https://www.plotune.net/solutions/can-ecu-testing?entry_source=direct)[NexusROS 2 / DDS testingRun unattended hardware tests and judge requirements on live telemetry, without ROS tooling on your side.See the workflow →](https://www.plotune.net/solutions/ros2-dds-testing?entry_source=direct)[NexusTest automationLet agents run, watch and re-run sequences, so an engineer is not needed in the loop for every build.See the workflow →](https://www.plotune.net/solutions/test-orchestration?entry_source=direct)

## See this mapped to your bench.

Plotune Nexus is one product. This is how it runs against AI Hardware-in-the-Loop Testing.

[Discuss your setup](https://www.plotune.net/contact?segment=hil-testing&solution=hil-testing&entry_source=direct)

Source: https://www.plotune.net/solutions/hil-testing
