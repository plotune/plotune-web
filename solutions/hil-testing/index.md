# Give AI agents access to real hardware without giving up control of the boundary

[← Related research](https://www.plotune.net/research)

AI Hardware-in-the-Loop Testing



Giving an AI agent access to real hardware raises a different question than giving it access to a shell: what happens when it's wrong? Most HIL setups solve this by keeping AI out entirely. The simulator, the virtual bus, and the real bench stay in a person's hands, because there's no bounded way to let an agent touch any of it safely.

[Discuss your setup](https://www.plotune.net/contact?segment=hil-testing&solution=hil-testing&entry_source=direct)[Explore Nexus](https://www.plotune.net/nexus?segment=hil-testing&solution=hil-testing&entry_source=direct)

Containerized sim on virtual CAN  Example run

Controller

staged container

Bus

virtual CAN

Gateway

approved frames only

Boundary proof

captured

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

## Supported integrations

Containerized simulation

Virtual CAN + policy gateway

MCP + OAuth

Bounded operation set

### See this mapped to your bench.

Plotune Nexus is one product, this is how it runs against AI Hardware-in-the-Loop Testing.

[Discuss your setup](https://www.plotune.net/contact?segment=hil-testing&solution=hil-testing&entry_source=direct)

Source: https://www.plotune.net/solutions/hil-testing
