# Why test automation still requires an engineer in the loop

[← Related research](https://www.plotune.net/research)

Test Automation & Orchestration



Most test automation stops at "run the script." The real bottleneck is upstream: someone still decides which sequence to run, watches it for faults, and re-runs it by hand when a build changes. Automation that still needs a person standing next to it is a faster way to wait, not less waiting.

[Discuss your setup](https://www.plotune.net/contact?segment=test-orchestration&solution=test-orchestration&entry_source=direct)[Explore Nexus](https://www.plotune.net/nexus?segment=test-orchestration&solution=test-orchestration&entry_source=direct)

Bounded DDS test sequence  Example run

Steps

join → record → wait → leave

scan_min

1.748 m

Rate check

6.47 Hz PASS

Verdict

pass 1/1

## The workflow today

- 01  A person kicks off each test sequence and stays to watch it run

- 02  Faults are triaged live, in the moment, by whoever is on the bench

- 03  Regression checks are re-run by hand against every new build

- 04  Overnight or long-running coverage simply does not happen

## With Plotune Nexus

- 01  Orchestrate multi-step sequences across CAN, UART, DBC, XCP, and DDS as one bounded run

- 02  Leave a bounded fault watch running as an async job, so a 2am fault is captured, not missed

- 03  Diff a fresh run against a validated baseline to catch regressions automatically

- 04  Every sequence ends with a packaged, reviewable artifact, not a person's notes

## Supported integrations

Test sequences

Async jobs

Baseline regression diff

Multi-protocol orchestration (CAN / UART / XCP / DDS)

### See this mapped to your bench.

Plotune Nexus is one product, this is how it runs against Test Automation & Orchestration.

[Discuss your setup](https://www.plotune.net/contact?segment=test-orchestration&solution=test-orchestration&entry_source=direct)

Source: https://www.plotune.net/solutions/test-orchestration
