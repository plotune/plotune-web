# Using a Decision Model as an Agent's Guardrail, Not Its Judgment

Agent Safety & Guardrails



Agent Safety & Guardrails  8 min read  Published 2026-09-28

 The real question 

## A fast reflex is not automatically a safe one.

A decision model that answers in milliseconds instead of generating a full response looks like the missing reflex layer for an agent that has to act on real hardware. Tested as a guardrail behind a rule, it earns that role. Tested as the thing making the call on its own, it was measurably less safe than a one-line hand-written rule, on exactly the cases that rule was built to catch.

 

## Why a decision model looks like the missing piece

 

A decision model doesn't generate text. Given a description of the current state of a system and a small, typed question, such as "is this trustworthy," "which of these applies," or "how severe is this," it returns a calibrated verdict directly: a probability, a choice, a score. No tokens to generate, no prose to parse.

 

The pitch borrows Daniel Kahneman's distinction between fast, automatic judgment and slow, deliberate reasoning. A large language model is System 2: it thinks in sentences, and thinking in sentences is expensive. A decision model is positioned as System 1 for an agent: a reflex sitting in front of the slow model, handling routine, bounded calls fast enough that the expensive model only gets invoked for the genuinely hard cases. The speed argument isn't about a smaller model or a bigger GPU. It's a structurally shorter pipeline: a decision call skips generation entirely, where a language-model call has to produce and parse tokens even for a one-word answer.

 

That gap, between a fast reflex and a trustworthy one, is what actually matters in a domain the pitch rarely gets tested in: hardware that can be damaged by the wrong call.

 

## Two systems, one question

 

Two independent simulated control systems were built, a plain hand-written rule run against each as a baseline, and three strategies for adding a decision model (`typesafe/jev-1.13`) on top compared: never, always, and only when the rule was already unsure.

 

A stabilization loop.  A controller holding a noisy sensor reading at a target setpoint, with five injected fault patterns: a clean run, a sensor that freezes in place, a single sharp spike, a slow drift away from the true value, and a dropout-then-recovery. The question asked every time: is the most recent reading trustworthy?

 

A battery pack.  A simulated 96-cell lithium-ion pack, tracking voltage, current, state of charge, cell temperature, and weakest-cell voltage, built from a published battery-management reference model and checked against its own worked examples before any model call was made. Five scenarios: a clean run, a load level that looks aggressive but is documented as safe, a weak cell sagging toward undervoltage, a cooling failure risking thermal runaway, and a compounding case: elevated temperature, low charge, and sustained current together, none individually over its own limit, but dangerous in combination. The model was given only the physical relationships in plain language, such as heat compounding or voltage sagging further at low charge, never the exact numeric thresholds the rule used. That gap is the actual test of reasoning versus recalling a threshold table.

 

Every number below is a real, paid model call

Total real model calls  88

Total cost  $0.003

Guardrail experiment, fewer calls with escalation  78%

Battery experiment, fewer calls with escalation  72%

 

## As a guardrail: real, narrow value

 

Each chart below shows one run: the top line is the sensor reading over time, with a shaded band marking where a real fault is happening. Underneath, three rows show what each strategy called at every checkpoint: the plain rule alone, the model asked every time, and the model asked only when the rule was already unsure.

 

Caught the fault  False alarm  Missed it  Correctly quiet

Ringed marker: the model was actually consulted at that checkpoint. Most of the escalation row has no ring, because it usually didn't need to ask.

 

On a fully healthy run, the sensor never leaves its normal range, and the plain rule correctly stays silent the entire time. Asking the model on every single reading, though, produces one false alarm partway through: a mistake the rule never makes, since it never had a reason to doubt that reading in the first place.

 

## Clean, healthy run

One false alarm from the always-ask strategy partway through; the rule and the escalation strategy stay correctly silent throughout.

clean: sensor reading over time with the ground-truth fault window shaded, and each strategy's call at every checkpoint below.

 

The sensor freezes at a stale value for a stretch, the shaded band. Both the plain rule and the model, asked either way, catch it correctly, with only a brief lag right at the moment it happens before enough consecutive bad readings confirm it's a real fault and not noise. This is a case where the fast rule was already good enough on its own: asking the model bought nothing extra.

 

## Frozen sensor

Caught correctly by every strategy after a short lag at onset.

stuck sensor: sensor reading over time with the ground-truth fault window shaded, and each strategy's call at every checkpoint below.

 

A single sharp, one-reading spike hits the sensor and then vanishes. This is where the plain rule stumbles: a fixed threshold correctly flags the spike, but then flags the  return to normal  as suspicious too, since a sudden drop looks just as alarming to a fixed rule as a sudden rise. The model, given a short window of recent readings instead of a single before/after comparison, recognizes the recovery as fine and clears that false alarm, its one clear win in this experiment.

 

## Single sharp spike

The plain rule falsely flags the recovery afterward; the model correctly clears it.

spike: sensor reading over time with the ground-truth fault window shaded, and each strategy's call at every checkpoint below.

 

The sensor drifts gradually away from the true value across the entire run, never moving fast enough at any single step to trip the fixed rule. Neither the rule nor the model catches this one: the model's short window of recent readings was never enough to reveal a trend playing out over hundreds of readings. This is the clearest case of the pitch not holding up as tested, since no reasoning rescued it.

 

## Slow drift

Missed entirely by every strategy: no single step ever looks implausible enough to trip.

slow drift: sensor reading over time with the ground-truth fault window shaded, and each strategy's call at every checkpoint below.

 

Last, a dropout: the sensor reports a stale last-known value for a stretch, then recovers cleanly on its own. Superficially the same shape as the frozen-sensor case above, but asking the model every time actually catches it one checkpoint sooner than the rule does: at the exact tick the dropout starts, the rule is still confidently reading it as normal, not yet flagged as uncertain, so escalation has no reason to ask and misses that same tick right alongside the rule.

 

## Dropout and recovery

The always-ask strategy catches the dropout one tick sooner than the rule; escalation misses that same tick, since the rule isn't flagged as uncertain there yet.

dropout then recover: sensor reading over time with the ground-truth fault window shaded, and each strategy's call at every checkpoint below.

 

Across all five runs, asking the model only when the plain rule was already unsure kept the one real win within its reach (the spike), missed the smaller one it structurally couldn't reach (catching the dropout a tick sooner, which only ever happens when the rule is confidently wrong rather than merely unsure), never produced the healthy-run false alarm, and did all of that while consulting the model 78% less often than asking every time.

 

## As an autonomous decision-maker: measurably less safe

 

Here the model has to do more than flag a problem: it has to pick the correct protective action from five options, on a system where the wrong call has real consequences. The exact numeric thresholds a rule-based system would use were deliberately withheld, so the model has to reason from plain-language physical relationships instead of recalling a table. The chart layout is the same idea as before, extended to five stacked signals: voltage, current, charge level, temperature, and weakest-cell voltage.

 

Exact match  Over-cautious but safe  Unsafe

Ringed marker: the model was actually consulted at that checkpoint.

 

On a fully healthy run, both the plain rule and the ask-only-when-unsure strategy stay silent throughout, as they should. Asked every time, though, the model recommends easing off power on one otherwise unremarkable reading: the same crying-wolf tendency shows up here as it did on the healthy sensor run above.

 

## Clean, healthy battery run

One unwarranted intervention from the always-ask strategy; the rule and the escalation strategy stay silent.

clean healthy: pack voltage, current, SOC, max cell temperature, and minimum cell voltage over time, with the ground-truth action window shaded, and each strategy's call at every checkpoint below.

 

Current climbs to a level that looks aggressive but is explicitly documented as still within safe limits. The plain rule correctly does nothing throughout. Asked every time, the model recommends cutting discharge current at nearly every single check-in: never dangerous, since easing off power is always the conservative direction, but a near-constant intervention on operation that was never actually a problem.

 

## High but documented-safe load

Near-constant unnecessary intervention when the model is asked every time.

high load no fault: pack voltage, current, SOC, max cell temperature, and minimum cell voltage over time, with the ground-truth action window shaded, and each strategy's call at every checkpoint below.

 

One cell's voltage sags below a safe floor under sustained load, a fault taken directly from a published battery-protection reference. The plain rule tracks the correct response exactly, escalating from a moderate cut in discharge current to a full disconnect as the fault deepens. Asked every time, the model gets the early, moderate response right, but keeps recommending that same moderate response well after the fault has progressed to needing a full disconnect: a real, dangerous lag.

 

## Weak cell sagging toward undervoltage

The always-ask strategy fails to escalate to disconnection once required.

weak cell undervoltage: pack voltage, current, SOC, max cell temperature, and minimum cell voltage over time, with the ground-truth action window shaded, and each strategy's call at every checkpoint below.

 

A cooling failure lets cell temperature climb without limit. Same pattern again: the plain rule correctly escalates from adding cooling to disconnecting as temperature rises, while the model, asked every time, gets stuck recommending a moderate current cut and never escalates to disconnection, even once temperature is well past the point where that response is required.

 

## Cooling failure risking thermal runaway

The always-ask strategy again fails to escalate to disconnection.

thermal runaway risk: pack voltage, current, SOC, max cell temperature, and minimum cell voltage over time, with the ground-truth action window shaded, and each strategy's call at every checkpoint below.

 

This last scenario was built to be invisible to any rule that checks each signal in isolation: temperature, charge level, and current are each individually unremarkable, but the combination is dangerous. True to form, the plain rule never reacts at all, across the entire run. Working only from the plain-language description of how the signals interact, the model correctly recommends cutting current for most of the danger window, the one clear case in this experiment where reasoning across signals actually paid off, though it does slip for one reading right at the tail end of the danger window.

 

## Combined temperature, charge, and current risk

Invisible to the plain rule; mostly caught by the model reasoning across signals.

cross signal compounding: pack voltage, current, SOC, max cell temperature, and minimum cell voltage over time, with the ground-truth action window shaded, and each strategy's call at every checkpoint below.

 

Asked to decide on its own, every time, with no rule to defer to, the model was less safe than the simple rule on both realistic fault scenarios, wrong in the dangerous direction about a third of the time, on exactly the two runs where the plain rule was 100% correct.

 

The escalation pattern held here too: zero unsafe calls on four of the five runs, at 72% fewer model calls than asking every time, while still capturing most of the compounding win.

 

## The harness that actually worked

 

The same shape solved both experiments independently: a fast deterministic rule decides by default and is never overruled while confident. The model is consulted only in a narrow, explicit band of uncertainty, and its answer only ever breaks a tie the rule couldn't resolve on its own, never vetoes a rule that already knows the answer.

 

That gating has one honest limit, visible in the dropout scenario above: it can only rescue a case the rule flags as uncertain, not one where the rule is confidently wrong. A confidently wrong rule never asks, so the model never gets a chance to help.

 

Where a decision model earns its keep

1 Rule evaluates first

2 Confident: rule wins, no call made

3 Unsure: escalate to the model

4 Model breaks the tie only

 

Response times sat around half a second per call regardless of what was asked, which rules out any inner control loop outright: this is a supervisory-cadence tool, not a per-instant one. The two failure patterns found, a reluctance to pick the most severe option and an over-eagerness to react to a merely high-looking number, look like calibration habits rather than a ceiling on reasoning ability, since the same model handled the genuinely hard multi-signal case well. A stronger model might reduce those specific habits. But the safety property that actually matters doesn't come from model quality: it comes from never letting any model's answer overrule a rule that's already confident. That property holds regardless of how capable the model behind it is, which makes the harness the fix to reach for first, not a bigger model.

 

## The scorecard

 

| System | Scenario | Verdict | Why |
| --- | --- | --- | --- |
| Stabilization loop | Sharp spike | Real win | Fixed a genuine false alarm the rule made |
| Stabilization loop | Frozen sensor | Neutral | Model matched the rule exactly |
| Stabilization loop | Dropout & recovery | Real win (always-ask only) | Caught one tick sooner than the rule; escalation can't reach this one, since it only asks once the rule is already unsure |
| Stabilization loop | Slow drift | Neutral | Neither approach caught it |
| Stabilization loop | Clean, healthy run | Unsafe when unguarded | Asked every time, the model raised a false alarm the rule never would |
| Battery pack | Combined temp/charge/current risk | Real win | Cut a near-total rule blind spot substantially |
| Battery pack | High but safe load | Unsafe when unguarded | Asked every time, the model intervened on almost every check |
| Battery pack | Weak cell, thermal runaway | Unsafe when unguarded | Asked every time, the model was wrong, dangerously, about a third of the time |
| Both systems | Ask-only-when-unsure | The actual finding | Kept every win within its reach, introduced no new failure, far fewer calls |

 

## Where this fits in an agent-to-hardware stack

 

Ordered from the fastest, least negotiable layer to the slowest and most deliberative:

 

- Hard real-time actuation, on the order of milliseconds.  Never a decision model, never a language model.
 
- Deterministic protection rules.  Decide by default, and are never overruled while confident.
 
- A gated decision model, on the order of seconds.  The one role this testing actually supports.
 
- Full language-model reasoning.  Novel conditions, explanations, judgment calls.
 
- A human operator.  The genuine long tail.

 

Never put a decision model, or a language model, in the innermost loop; the latency numbers alone rule it out. Use a gated decision model as a supervisory check, consulted only when the fast rule is already unsure, choosing among a small, pre-defined set of actions or trust judgments. Reserve the full language model for genuinely novel conditions, anything that needs to be explained to a person, anything where the space of possible responses can't be enumerated ahead of time. And structurally, never let a model of any kind override a confident deterministic safety rule: every unsafe call in both experiments came from exactly that being allowed to happen.

Agentic Test & Development: how a bounded operation set and a policy-first harness apply this same escalate-only-when-unsure pattern.

[See the full picture →](https://www.plotune.net/solutions/agentic-test-development?article=decision-model-agent-guardrails&entry_source=direct)

Source: https://www.plotune.net/research/articles/decision-model-agent-guardrails
