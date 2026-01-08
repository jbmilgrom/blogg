---
title: Software is Mostly All You Need
description: Robust AI architectures avoid neural networks at runtime, using them at buildtime instead.
date: 2026-01-08
tags: post
layout: layouts/post.liquid
hasTOC: yes
---

As AI coding agents improve, development time decreases from days to hours, minutes, and perhaps even seconds. What emerges is something like reinforcement learning — an adaptive loop where systems update themselves in response to feedback — but with traditional software as the substrate instead of neural network weights. Code is the policy, deployment is the episode, and the bug report is the reward signal.

Not all architectures are reaping the benefits. Many AI agent deployments are failing because they conflate two distinct tasks: _judgment_ and _execution_. Neural networks excel at judgment — fuzzy classification that cannot be specified in language. Traditional software excels at discrete logic that can be specified as explicit instructions and executed by any universal Turing machine. AI transforms both tasks in different ways: neural networks augment humans for judgment at runtime, while AI coding agents augment humans for writing execution logic at buildtime. The best performing architectures use the right tool for the right job, delegating judgment to neural networks and execution to traditional software even if the execution artifacts are produced entirely by AI.

[toc]

## The Failure Rate

Many agentic AI projects are failing[^1] and the industry has named the symptoms without the cause. IBM calls it "agentic drift" — when underlying models update, training data shifts, or business contexts change, agents that performed perfectly yesterday offer degraded or incorrect responses today.[^7] Enterprise teams report that debugging AI agents "isn't like debugging deterministic code" — you can't just read stdout/stderr, you need to replay the agent's decision process and inspect what it saw and why it acted.[^8] Even Cognition acknowledges that Devin "can't independently tackle an ambiguous coding project end-to-end like a senior engineer could."[^9]

Meanwhile, a different paradigm has precipitated significant productivity gains. Claude Code does not offer complete autonomy even if performing chunks of work at a time; it writes code that humans review and deploy. Most importantly, Claude Code produces an artifact that is durable, version-controlled, deterministic, auditable, and executable by a Von Neumann machine just like any ol' software has always been.

These failures and successes reflect a fundamental architectural difference.

## Judgment vs. Execution

Humans have been doing two different jobs for two different reasons. AI changes each differently.

**Judgment** is fuzzy classification that cannot be specified as explicit rules. This handwritten letter is a B, not a P; this customer complaint is about a refund, not fraud; this image contains a receipt; this element on some unfamiliar page is "the login button." Humans did these tasks because traditional Turing machines simply cannot. The rules cannot be written down — the "rule" exists only as a learned boundary in high-dimensional space. Minimization of a loss function via gradient descent in this vastly dimensional space draws these boundaries without the nouns and verbs of English, C or even Rust (lol) and underpins the effectiveness of neural networks.

**Execution** is discrete logic that _can_ be specified as explicit rules. If complaint type is refund and days since purchase is less than 30, approve; if machine type is CPAP and facility code is X, the SKU is ABC-123; click the element with selector `a[href="/login"]`. Humans did these tasks even though machines are perfectly capable, more reliable, and faster because writing and operating software systems that encode these rules _was_ expensive, not because of any fuzziness inherent to the task. AI coding agents can now write this code.

## Common Conflations

Dominant agent architectures conflate judgment and execution, frequently using neural networks for both. The consensus definition of an agent — "an LLM runs tools in a loop to achieve a goal"[^2] — clarifies the mechanism but not the problem space.

Frameworks like browser-use and Stagehand embody this conflation. Consider browser-use:

```py
agent = Agent(task="Find the top HN post", llm=llm, browser=browser)
await agent.run()
```

Or Stagehand:

```ts
await stagehand.act("click on the stagehand repo");
await agent.execute("Get to the latest PR");
```

In both cases, the LLM performs judgment (which element is "the stagehand repo"?) _and_ execution (click it, figure out the next step, click that). The entire loop is neural. No durable artifact emerges. The LLM _is_ the runtime.[^3][^4]

## Why Execution Requires Software

Neural networks lack the properties that execution requires: determinism, auditability, and precision on edge cases.

Consider this business logic from a system that processes medical equipment orders (from [Docflow](https://docflowlabs.com), my startup):

```ts
// Fallback 1: Try scriptedMachine field
const scriptedMachineCode = extractMachineCodeFromScripted(scriptedMachine);
if (scriptedMachineCode && machineType) {
  const machineMake = lookupMachineSku(
    machineType,
    scriptedMachineCode,
    classification
  );
  if (machineMake) {
    machineSku = machineMake;
  }
}

// Fallback 2: Try facility field if fallback 1 didn't succeed
if (!machineSku || machineSku.trim() === "") {
  const facilityMachineCode = extractMachineCodeFromFacility(facility);
  if (facilityMachineCode && machineType) {
    const machineMake = lookupMachineSku(
      machineType,
      facilityMachineCode,
      classification
    );
    if (machineMake) {
      machineSku = machineMake;
    }
  }
}
```

This code handles combinations that may occur once a year — a rare facility, an unusual machine type, a specific classification. Training data will never cover the combinatorial space. Moreover, when a billing dispute arises and someone asks why the system chose rental versus purchase for a particular patient, the logic can be traced line by line. The code provides 100% precision; not 95%. It lives in version control and is semantically transparent, reviewable, and auditable.

A neural network approximating this function cannot provide these properties. It blurs boundaries that business requires to be sharp. And it fails opaquely — gradients and activations offer no affordance for debugging, ultimately achieving 95% accuracy at best where 100% is the only acceptable outcome. Decisions in this substrate are semantically opaque, non-reviewable, and untraceable.

## Stagehand: Half Right

Stagehand, the browser automation framework from Browserbase, is half right.[^5]

Stagehand's `act("click on the stagehand repo")` correctly implements judgment via a neural network in some sense. Which element on any dynamically chosen page corresponds to the "stagehand repo" cannot be represented in traditional software. There are too many permutations of page layout. The fuzziness of these boundaries is best approached by neural networks in massively multidimensional space minimizing some loss function against many examples.

In another sense however, Stagehand's architecture is misguided. We probably know ahead of time what webpage we're attempting a click against (GitHub perhaps?). More importantly, Stagehand produces no semantically transparent and executable artifact. Instead, the LLM returns a selector, which gets cached opaquely outside version control. On cache miss, the LLM re-engages at runtime to re-interpret the instruction.

A better architecture might still allow the LLM to make a judgment and return a selector, but position this judgment squarely at buildtime. The selector gets emitted as code into a Playwright script. The script is committed to version control, reviewed, deployed. On failure — because the site changed and the selector broke — the _development process_ re-engages. An AI agent rewrites the script.

Same judgment, different artifact. The selector should be durable build output, not ephemeral runtime state.[^6]

## A Better Architecture

Neural nets may remain at runtime when tackling judgments. Every other LLM agent belongs at buildtime accelerating the production of executable software.

```py
# Orchestrator: traditional software

complaint_text = get_complaint()

# Judgment: delegate to neural net at runtime
complaint_type = llm.classify(
    complaint_text,
    categories=["refund", "fraud", "shipping", "other"]
)

# Execution: traditional code, written at build time (by humans or AI agents)
if complaint_type == "refund":
    if days_since_purchase < 30 and item_condition == "unopened":
        approve_refund()
    else:
        escalate_to_human()
elif complaint_type == "fraud":
    flag_for_review()
```

The workflow orchestrator is traditional software. It calls out to neural networks for judgment tasks: classification, extraction, interpretation — the fuzzy pattern matching that cannot be specified as rules. Then it executes business logic itself, deterministically. The execution paths are explicit, auditable, and version-controlled.

This is not a new pattern. Production ML systems already work this way: a model classifies, code acts. What's new is that AI agents can write the code, dissolving the apparent tradeoff between RPA (deterministic but brittle) and AI agents (adaptive but unpredictable).[^10]

## Development Time Approaching Runtime

Software systems have historically maintained a clear separation between two domains: development (humans writing code, days or weeks) and execution (CPUs running code, nanoseconds). AI coding agents collapse this gap.

We can express the collapse as a limit:

$$\lim_{\text{devtime} \to 0} \text{buildtime} = \text{runtime}$$

As development time approaches zero, the distinction between "writing code" and "running code" becomes less temporally distinct. Even if AI never achieves nanosecond times for writing software, timescales of hours, minutes, and perhaps seconds allow software systems to adapt to feedback as it arrives.

What emerges resembles reinforcement learning with a different substrate. In traditional RL, a neural network observes state, outputs an action, receives a reward signal, and updates its weights. The network _is_ the adaptive element.

Substitute software for the neural network and the structure remains identical. The system observes data — requests, errors, metrics, user complaints. Code executes a response. Feedback arrives. An AI agent updates the code. Same adaptive loop, different computable substrate.

The difference in representation matters. Neural networks encode behavior in opaque weight matrices. Software encodes behavior in symbolic, human-readable form. Software can be audited, debugged, and surgically modified if necessary. A single fallback chain can be altered without retraining an entire model and hoping it generalizes correctly.

The symbolic substrate preserves the properties that production systems often require: interpretability, debuggability, auditability, and surgical modifiability. When the learned update mechanism provides adaptability, you get the benefits of RL without the costs.

## Adaptable Software Systems

Ironically, software is still mostly all you need at runtime.

Neural networks are best reserved for judgment — the fuzzy tasks we cannot otherwise specify in language — and for buildtime acceleration. Neural networks will not replace traditional software, but rather enable its proliferation into corners of the economy that could benefit from reliable discrete logical execution.

An architecture where neural networks handle runtime judgment, software handles execution, and AI agents accelerate buildtime creates a symbolic substrate that is nonetheless adaptable. Somehow we get both: the auditability, determinism, and precision of traditional software alongside the adaptability of learned systems.

---

This is what we're building at [Docflow Labs](https://docflowlabs.com): adaptive systems with a symbolic substrate. If this resonates, say hello on [Twitter](https://twitter.com/jbmilgrom).

---

[^1]: Gartner predicts over 40% of agentic AI projects will be canceled by 2027 due to escalating costs, unclear business value, or inadequate risk controls (https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027). S&P Global reports 42% of companies abandoned most AI initiatives in 2024, up from 17% the prior year. The WebArena benchmark shows best agents achieve ~60% success vs 78% for humans (https://arxiv.org/abs/2307.13854). Klarna's customer service AI was rolled back in 2025 after quality eroded (https://www.bloomberg.com/news/articles/2025-05-07/klarna-reverses-ai-push-with-plan-to-add-more-customer-service-staff).
[^2]: Simon Willison, "I think 'agent' may finally have a widely enough agreed upon definition to be useful jargon now," September 2025. https://simonwillison.net/2025/Sep/18/agents/
[^3]: browser-use GitHub repository. https://github.com/browser-use/browser-use
[^4]: Stagehand GitHub repository. https://github.com/browserbase/stagehand
[^5]: Stagehand documentation and README describe the framework as "the first browser automation framework built for the AI era—giving you both the predictability of code and the adaptability of AI." https://www.stagehand.dev/
[^6]: Stagehand's own documentation acknowledges this tension. They position themselves against "full agent-based solutions like OpenAI Operator or Anthropic Computer Use" which "promise full automation from just a prompt" but where "developers can end up with unpredictable outcomes." Stagehand offers more control than pure agents but stops short of buildtime AI. The cached selectors remain opaque, live outside git, and when something breaks in production and the LLM "self-heals" by finding a new selector, production behavior changes without code change, review, or approval. https://www.browserbase.com/blog/ai-web-agent-sdk
[^7]: IBM, "The hidden risk that degrades AI agent performance," November 2025. https://www.ibm.com/think/insights/agentic-drift-hidden-risk-degrades-ai-agent-performance
[^8]: "5 Fatal Mistakes: Why Your AI Agent Keeps Failing in Production," DEV Community, September 2025. https://dev.to/agentsphere/5-fatal-mistakes-why-your-ai-agent-keeps-failing-in-production-4pk3
[^9]: Cognition, "Devin's 2025 Performance Review: Learnings From 18 Months of Agents At Work," 2025. https://cognition.ai/blog/devin-annual-performance-review-2025
[^10]: Multimodal, "Agentic AI vs. RPA: What's the Difference?", June 2025. https://www.multimodal.dev/post/agentic-ai-vs-rpa
