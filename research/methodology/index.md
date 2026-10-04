# Agentic Test & Validation Protocol

Restore fixture 1 Acquire interface 2 Capture baseline 3 Apply permitted action 4 Verify observed result 5 Release and package evidence

[What is evaluated](https://www.plotune.net/research/methodology#scope)[Test environment](https://www.plotune.net/research/methodology#environment)[Task families](https://www.plotune.net/research/methodology#families)[Metrics and scoring](https://www.plotune.net/research/methodology#scoring)[Monthly releases](https://www.plotune.net/research/methodology#releases)

## What is evaluated

The unit of evaluation is a complete task, not a written answer. A task is successful only when the required observed state, acceptance checks, and supporting evidence are present.

## Test environment

Every attempt pins the fixture revision, simulator or hardware configuration, interface adapter, schema revision, tool version, and acceptance checks. The initial state is restored before an attempt. Simulated and physical-bench outcomes are reported separately.

## Task families

### Industrial data analysis

Find a seeded deviation, quantify it correctly, and cite the relevant signal window.

### Connecting test benches

Discover the interface, establish a session, capture a valid sample, and close cleanly.

### Automated validation

Turn a requirement into a bounded sequence and produce an independently checked verdict.

### Diagnostics and root cause

Capture a reproducible fault window and separate observations from hypotheses.

### Calibration and updates

Inspect baseline state, apply an allowed change, verify readback, and restore.

### Stream validation and evidence

Detect a defined threshold or sequence and preserve a trace another engineer can review.

## Metrics and scoring

Performance  Family score equals passed attempts divided by scheduled attempts. The overall index is the mean of family scores so a large family cannot dominate.

Cost  Recorded model and execution charges are summed across successful, failed, and retried work. Cost per attempted and successful task are kept distinct.

Time  Wall time runs from task dispatch through verdict and required cleanup. Detailed releases report median and p95 alongside the headline statistic.

Reliability  Scheduled attempts that complete with a valid terminal result and cleanup, separated from whether the answer was correct.

## Monthly releases

Each release freezes its task manifest, model and provider configuration, prompt and tool versions, retry policy, resource limits, and acceptance checks. Run records retain timestamps, tool calls, artifact hashes, verdicts, and failure categories. Comparisons between months are made only on compatible task and protocol versions.

Data provenance: the current interface is an example release format. Published monthly reports will be based on recorded run records and versioned task manifests.

[Browse research reports](https://www.plotune.net/research/reports)

Source: https://www.plotune.net/research/methodology
