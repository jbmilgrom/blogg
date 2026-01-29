---
title: Software is Mostly All You Need
subtitle: Neural Networks at Buildtime, Software at Runtime
description: Robust AI architectures avoid neural networks at runtime, using them at buildtime instead.
date: 2026-01-08
tags: post
layout: layouts/post.liquid
hasTOC: yes
---

Over the last 6 months and the last 6 weeks in particular, AI coding agents have shown to be incredibly capable at writing software. Tasks that traditionally required weeks of human labor can now be done in days if not hours. Even more incredibly, software systems that are designed from the start to harness AI coding agents exhibit many of the characteristics of the neural nets that were integral to their creation in the first place. These AI-native software systems are learned, not designed. Code is the policy, deployment is the episode, and the bug report is the reward signal - well-architected coding agents can implement this loop with little human intervention. Unlike traditional reinforcement learning architectures, they are encoded in CPU instruction sets instead of neural network weights, but they are learned just the same.

The success of coding agents and the software systems built thereon carry lessons about where to apply AI agents in general as well. Coding, like many other creative tasks, requires _judgment_. How best to implement some function with input A and output B; how to name some variable; whether to share some function or implement a new version; etc. Neural networks excel at judgment (more on why below). Yet many of the agentic deployments we are seeing in the wild are against tasks that can be fully specified as explicit instructions. Of course, traditional software excels at _executing_ explicit instructions. Any programming language can be executed on today's machinery at billions of instructions per second.

Coding agents get this exactly right, since by definition they are making a series of judgments when writing code at buildtime and leaving the execution of such code to machines operating at runtime. The best performing architectures follow suit, delegating judgment to neural networks and execution to traditional software, even when the executable artifacts are produced entirely by AI.

[toc]

## Some Agents in Practice

Many agentic AI projects are failing[^1] — agentic drift, opaque debugging, brittle autonomy.[^2][^3][^4] Meanwhile, Claude Code has driven significant productivity gains by doing something different: it writes code that humans review and deploy, producing artifacts that are durable, version-controlled, and deterministic.

These failures and successes reflect a fundamental architectural difference.

## Judgment and Execution Historically

Humans have historically done two different types of jobs for different reasons, and AI changes each differently.

**Judgment** is fuzzy classification that cannot be specified as explicit rules. This variable should be made private, not public; this handwritten letter is a "B", not a "P"; this customer complaint is about a refund, not fraud; this image contains a receipt; this element on some unfamiliar page is "the login button." Humans did these tasks because traditional CPU-based Von Neumann machines simply could not. The rules could not be written down, and even today exist only as learned boundaries in high-dimensional space. Minimization of a loss function via gradient descent in a vastly dimensional space draws these boundaries inside neural networks without confinement to the nouns and verbs of English, C, or even Rust (lol).

**Execution** is discrete logic that _can_ be specified as explicit rules. If complaint type is refund and days since purchase is less than 30, approve; if machine type is CPAP and facility code is X, the SKU is ABC-123; click the element with selector `a[href="/login"]`. Humans did these tasks, even though Von Neumann machines theoretically could and are more reliable and faster, because writing and operating software systems that encode these rules _was_ expensive. The investment was not worth the savings not because of any fuzziness inherent to the task.

## Common Conflations Today

Dominant agent architectures conflate judgment and execution, frequently using neural networks for both. The consensus definition of an agent — "an LLM runs tools in a loop to achieve a goal"[^5] — clarifies the mechanism but not the problem space.

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

In both cases, the LLM performs judgment (which element is "the stagehand repo"?) _and_ execution (click it, figure out the next step, click that). The entire loop is neural. No durable artifact emerges. The LLM _is_ the runtime.[^6][^7]

## Why Execution Requires Traditional Software

Neural networks lack the properties that execution requires: determinism, auditability, and precision on edge cases.

Consider this business logic from a system that processes medical equipment orders (from [Docflow Labs](https://docflowlabs.com), my startup):

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

This code handles combinations that may occur once a year — a rare facility, an unusual machine type, a specific classification. The code provides 100% precision even for edge cases. When a billing dispute arises and someone asks why the system chose rental versus purchase for a particular patient, the logic can be traced line by line. It lives in version control and is semantically transparent, deterministic, and auditable.

A neural network approximating this function cannot provide these properties. Sparse training data will never cover the combinatorial space. Moreover, it blurs boundaries that business requires to be sharp. And it fails opaquely — gradients and activations offer no affordance for debugging. Decisions in this substrate are semantically opaque, non-deterministic, and untraceable.

## The Stagehand Example: Half Right

Stagehand's `act("click on the stagehand repo")` correctly implements judgment via a neural network in some sense.[^8] Which element on any dynamically chosen page corresponds to the "stagehand repo" cannot be represented in traditional software. There are too many permutations of page layout. The fuzziness of these boundaries is best approached by neural networks in massively multidimensional space minimizing some loss function against many examples.

In another sense, however, Stagehand's architecture is limited. We may know ahead of time which webpage we are attempting a click against and it may change infrequently, requiring only a one-time (or few-time) judgment.

Yet Stagehand produces no executable artifact by design. Instead, the LLM returns a selector, which gets cached opaquely outside version control. On cache miss, the LLM re-engages at runtime to re-interpret the instruction, invoking a neural net.

A better architecture might still allow the LLM to make a judgment and return a selector, but afford positioning this judgment squarely at buildtime. The selector gets emitted as code into a Playwright script. The script is committed to version control, reviewed, and deployed. On failure — because the site changed and the selector broke — the _development process_ re-engages. An AI agent rewrites the script. Same judgment, different artifact. The selector becomes a semantically transparent piece of the underlying software system, not ephemeral runtime state.[^9]

## A Better Architecture

Neural nets may remain at runtime when tackling judgments that can only be made dynamically at runtime. Every other LLM agent belongs at buildtime accelerating the production of executable software.

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

Software systems have historically maintained a clear separation between two domains: development (humans writing code, days or weeks) and execution (CPUs running code, nanoseconds). AI coding agents close this gap. The theoretical limit as development time approaches zero is runtime:

$$\lim_{\text{devtime} \to 0} \text{buildtime} = \text{runtime}$$

Even if AI never achieves nanosecond times for writing software, timescales of hours, minutes, and perhaps even seconds allow software systems to adapt to feedback as it arrives.

As AI agents get more capable, the distinction between "writing code" and "running code" may dissolve. What emerges resembles reinforcement learning with a different substrate. In traditional RL, a neural network observes state, outputs an action, receives a reward signal, and updates its weights. The network _is_ the adaptive element.

Substitute software for the neural network and the structure remains identical. The system observes data — requests, errors, metrics, user complaints. Code executes a response. Feedback arrives. An AI agent updates the code. Same adaptive loop, different computable substrate.

The difference in representation matters. Neural networks encode behavior in opaque weight matrices. Software encodes behavior in symbolic, human-readable form. Software can be audited, debugged, and surgically modified if necessary. A single fallback chain can be altered without retraining an entire model and hoping it generalizes correctly. The symbolic substrate preserves the properties that production systems often require: interpretability, debuggability, auditability, and surgical modifiability. When the learned update mechanism provides adaptability, you get the benefits of RL without the costs.

## Adaptable Software Systems

Ironically, software is still mostly all you need at runtime.

Neural networks are best reserved for judgment — the fuzzy tasks we cannot otherwise specify in language — and for buildtime acceleration. Neural networks will not replace traditional software, but rather enable its proliferation into corners of the economy that could benefit from reliable discrete logical execution at a fraction of historical costs.

An architecture where neural networks handle runtime judgment, software handles execution, and AI agents accelerate buildtime creates a symbolic substrate that is nonetheless adaptable — auditability, determinism, and precision alongside the adaptability of learned systems.

---

This is what we're building at [Docflow Labs](https://docflowlabs.com/#contact): adaptive systems with a symbolic substrate. If this resonates, say [hello](https://twitter.com/jbmilgrom)!

[^1]: Gartner predicts over 40% of agentic AI projects will be canceled by 2027 due to escalating costs, unclear business value, or inadequate risk controls ([Gartner](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027)). S&P Global reports 42% of companies abandoned most AI initiatives in 2024, up from 17% the prior year ([S&P Global](https://www.spglobal.com/market-intelligence/en/news-insights/research/2025/10/generative-ai-shows-rapid-growth-but-yields-mixed-results)). The WebArena benchmark shows best agents achieve ~60% success vs 78% for humans ([arXiv](https://arxiv.org/abs/2307.13854)). Klarna's customer service AI was rolled back in 2025 after quality eroded ([Bloomberg](https://www.bloomberg.com/news/articles/2025-05-07/klarna-reverses-ai-push-with-plan-to-add-more-customer-service-staff)).
[^2]: IBM, ["The hidden risk that degrades AI agent performance,"](https://www.ibm.com/think/insights/agentic-drift-hidden-risk-degrades-ai-agent-performance) November 2025.
[^3]: ["5 Fatal Mistakes: Why Your AI Agent Keeps Failing in Production,"](https://dev.to/agentsphere/5-fatal-mistakes-why-your-ai-agent-keeps-failing-in-production-4pk3) DEV Community, September 2025.
[^4]: Cognition, ["Devin's 2025 Performance Review: Learnings From 18 Months of Agents At Work,"](https://cognition.ai/blog/devin-annual-performance-review-2025) 2025.
[^5]: Simon Willison, ["I think 'agent' may finally have a widely enough agreed upon definition to be useful jargon now,"](https://simonwillison.net/2025/Sep/18/agents/) September 2025.
[^6]: [browser-use GitHub repository.](https://github.com/browser-use/browser-use)
[^7]: [Stagehand GitHub repository.](https://github.com/browserbase/stagehand)
[^8]: Stagehand documentation and README describe the framework as "the first browser automation framework built for the AI era—giving you both the predictability of code and the adaptability of AI." [Stagehand](https://www.stagehand.dev/)
[^9]: Stagehand's own documentation acknowledges this tension. They position themselves against "full agent-based solutions like OpenAI Operator or Anthropic Computer Use" which "promise full automation from just a prompt" but where "developers can end up with unpredictable outcomes." Stagehand offers more control than pure agents but stops short of buildtime AI. The cached selectors remain opaque, live outside git, and when something breaks in production and the LLM "self-heals" by finding a new selector, production behavior changes without code change, review, or approval. [Browserbase Blog](https://www.browserbase.com/blog/ai-web-agent-sdk)
[^10]: Multimodal, ["Agentic AI vs. RPA: What's the Difference?"](https://www.multimodal.dev/post/agentic-ai-vs-rpa), June 2025.
