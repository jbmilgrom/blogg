# The Description Tape: A Theory of AI-Era Software Engineering

Many software engineering teams accelerate as AI models and tooling improve. Others stagnate or even decelerate, despite having access to the same models and tooling. However disparate on their face, both outcomes are features of the same structural change.

AI coding agents can now produce software from an externalized description of how that software is built — product specifications, software practices, customer stories, conventions, the tribal knowledge that used to live in human heads and now has to be written down for agents to consume. This description is a new kind of artifact. It has no real counterpart in pre-AI engineering, where the equivalent knowledge was held implicitly by the people doing the work.

Acceleration is a feature of a genuinely self-sustaining equilibrium, in which engineers maintain the description that agents use to build the software. The loop produces both code and the description that shapes the next loop. Engineering effort shifts toward the loop itself rather than only the construction of features.

Stagnation and deceleration are features of the regime engineering has always operated in, where decay is the default. Implicit descriptions drift, conventions erode, and codebases grow faster than collective understanding. Pre-AI, teams fought this natural entropy tooth and nail through mentorship, careful hiring, code review, and documentation discipline — exhausting work that could slow decay at best but never reverse it. Meanwhile, external forces like customer obligations, revenue, deadlines, and market position kept the system from outright collapsing. Pre-AI engineering was decay propped up from outside and slowed at best from within.

AI did not introduce decay. AI allows for the possibility of an alternative regime. Which regime an engineering team lands in is now the most consequential fact about it.

---

## Architecture: The Description Tape

The description that AI-era engineering operates on has a precise structural counterpart in the theory of self-replicating systems.

In the 1940s, John von Neumann figured out how a machine could build a copy of itself. The architecture requires four parts: a constructor that reads instructions and builds the thing described; a copier that duplicates the instructions verbatim without interpreting them; a controller that coordinates the two; and the instructions themselves — the description tape — which plays a dual role. As data, the tape gets copied forward unchanged. As instructions, it gets read and used to build. All this ceremony separating description from interpretation is not without purpose. It is exactly what prevents the infinite regress that would otherwise doom any system trying to reproduce itself. The description does not have to describe itself describing itself; it just has to describe the machinery, while a separate copying operation handles its own propagation. The same architectural insight shows up in DNA, stored-program computers, autocatalytic chemistry, and in any system that reproduces or extends itself through descriptions. Separate the description from the interpretation, and self-reference becomes possible.

Pre-AI engineering had the constructor and the artifact. The team wrote the code. The codebase shipped. But the description — how to build, what conventions to follow, what abstractions to use, how to evaluate quality — lived implicitly. It existed in human heads, in mentorship relationships, in oral tradition, in retros, in scattered documentation that nobody trusted to be complete. There was no externalized, copyable, modifiable tape. The "description" of the engineering process was distributed across the people doing the work, and could only be transferred from person to person at the bandwidth of conversation and apprenticeship.

AI changes this categorically. The description has to be externalized for agents to read. CLAUDE.md, conventions documents, agent configurations, evaluation suites, schemas, architecture records — these aren't documentation in the old sense, written for humans who might or might not read them. They are the substrate on which the construction machinery operates. They get read every time an agent runs. They are load-bearing.

This is not a quantitative shift. Pre-AI engineering did not have a slightly worse version of a description tape. It did not have one at all in any architecturally meaningful sense. The description existed in a form — tacit, human-bound, non-copyable — that does not play the structural role of a description tape. Externalizing it changes what kind of object the engineering loop operates on.

Mapping the von Neumann architecture onto current engineering: the agents are the constructor, reading instructions and producing software. Version control is the copier, propagating the tape forward across loops without interpreting it. The workflow — ticket management, code review, deployment — is the controller, coordinating when construction happens and when the tape gets updated. The externalized substrate is the tape. And the codebase is the output.

The codebase is what the constructor produces. The description tape is the constructor's substrate. They play categorically different roles in the architecture. Confusing them — treating the tape as just more code, or treating the codebase as the only output that matters — is the most common conceptual error in current discussions of AI-era engineering. The two artifacts evolve under different dynamics and require different kinds of work to maintain.

---

## The Pre-AI Equilibrium: Why Decay Was Always the Default

The intro claimed that pre-AI engineering was always a decay process, held in place by external forcing rather than by internal self-sustainment. This section develops that claim — because it changes the meaning of what AI has done. The bifurcation we observe today between organizations that are accelerating and organizations that are producing increasingly incoherent output is not engineering becoming better for some and worse for others. It is engineering becoming, for the first time, capable of crossing a threshold that was previously uncrossable. Some organizations cross it. Most do not.

Engineering organizations have always been systems fighting decay. The implicit description of how to build software — the conventions, the abstractions, the accumulated judgment about what works in this codebase — was held in the people doing the work. Without continuous reinforcement, it dissipated. New engineers joined and didn't learn it fully. Old engineers left and took portions of it with them. The codebase grew faster than collective understanding of it. Conventions drifted because nobody noticed when they were violated. The description rotted, slowly, in every organization, all the time.

Even at their best, pre-AI engineering organizations were externally propped. Markets, revenues, deadlines, customers — these were forcing terms that kept the system running despite internal decay. Quarterly product launches forced enough investment in the codebase to keep it functional. Customer obligations forced bugs to be fixed. Competitive pressure forced features to be shipped. The system persisted not because it was internally self-sustaining but because external pressure kept it from collapsing.

Great engineering cultures fought decay aggressively. Teams like early Google, like Jane Street, like specific groups inside Amazon and a handful of other companies, sustained the implicit description above its decay rate through extraordinary human investment: rigorous mentorship traditions, careful hiring, ongoing documentation discipline, retros that actually changed behavior, internal tooling teams that operated as a kind of immune system for the codebase. This worked, sometimes for decades. But it was exhausting, didn't scale beyond certain organizational sizes, and required levels of cultural coherence that most companies could not sustain through growth or leadership transitions. Even these slow-decay regimes were decay regimes. The question was only how fast.

The biological parallel clarifies the structure. Pre-life chemistry on early Earth was full of complex molecules — amino acids, simple polymers, lipid membranes — that persisted not because they sustained themselves but because external energy kept producing them. Geothermal gradients, ultraviolet radiation, lightning, tidal cycles: these were forcing terms that drove chemistry uphill against entropy. Stop the forcing, and the molecules decay back to equilibrium with their surroundings. Most chemistry, on most of the Earth, throughout most of its history, has been this kind of externally-driven persistence.

Life is what happened when chemistry crossed a threshold. Not the molecules getting more complex, but a particular structural property emerging: autocatalytic closure. In the formalism developed by Stuart Kauffman, Mike Steel, and others studying the origin of life, a reaction network is autocatalytic if every catalyst in the set has some reaction in the set that produces it. The system makes what it needs to make more of itself. Once closure is achieved, the system is self-sustaining: it doesn't require continuous external forcing to maintain its own components, because the components are produced by the system's own activity. The threshold between externally-driven chemistry and autocatalytic chemistry is sharp. Either closure holds or it doesn't.

The engineering analog is direct, not metaphorical. Pre-AI engineering operated entirely on the externally-driven side of the threshold. The description couldn't be externalized in any way that scaled — humans don't scale as substrate, and oral tradition has bandwidth limits — so the autocatalytic threshold was effectively uncrossable. No matter how good an engineering culture was, the loop that produced software could not also produce the description of how to produce software, in any persistent form. The substrate was always being replenished by external inputs: hiring, training, mentorship, leadership attention.

AI changes the picture because the description can now be externalized. The tape exists. It can be read by every agent. It can be improved, version-controlled, refined, kept coherent. For the first time, an engineering organization has the structural ingredients to achieve autocatalytic closure: a substrate that the loop produces and uses, that can be maintained by the loop itself rather than only by external forcing.

The threshold is crossable. Some organizations are crossing it. Most are not.

---

## Dynamics: The Joint Recurrence and Its Asymmetric Attractors

The pre-AI development loop was a one-dimensional recurrence:

cbᵢ₊₁ = D(cbᵢ)

The codebase at step i+1 is produced by applying a development process D to the codebase at step i. The state space is one-dimensional: there is one thing that evolves, the codebase. D itself is exogenous and constant within the dynamics of the loop. Whatever processes shape D — hiring, organizational learning, tooling investment — happen on a slower, separate timeline that the inner loop doesn't see.

The AI-era loop is a two-dimensional joint recurrence:

(Dᵢ₊₁, cbᵢ₊₁) = F(Dᵢ, cbᵢ)

The state at step i+1 is a pair: the next description tape and the next codebase. Both are produced by applying a joint update operator F to the previous pair. The state space has been lifted: there are now two things that evolve, in parallel and in mutual dependence. The description shapes what gets built; what gets built shapes the next description. They are no longer separate timelines. They are coupled in the inner loop.

This shift from a one-dimensional recurrence to a joint two-dimensional recurrence is the formal expression of the architectural change. The mathematics has acquired a second variable, and the new variable has its own dynamics. The lifted state space is where the asymmetric attractor structure becomes possible.

Define the rails coefficient as the ratio of description-tape quality across one loop:

r = q(Dᵢ₊₁) / q(Dᵢ)

Here q is a scalar measure of substrate quality: how coherent the tape is, how well it captures the real conventions of the system, how reliably it leads agents to produce work that fits the codebase. The function q is not currently measurable in any precise way, and the theory is honest about that. What matters for the theoretical predictions is not the value of q but the behavior of r — specifically, whether r is greater than or less than 1.

If r > 1, the tape got sharper across the loop. The substrate that the next loop will read is better than the substrate this loop started with. If r < 1, the tape got duller. The substrate degraded.

Velocity rides on substrate quality. The speed at which one application of F completes — how fast an agent can produce a coherent next state given the current state — depends on how good the description is that the agent is reading. Better tape, faster loop:

vᵢ ∝ q(Dᵢ)

Time per loop is the inverse of velocity. Total wall-clock time over n loops is the sum of those inverses:

T(n) = Σ 1/vᵢ

This setup produces two regimes, asymmetric in their stability.

In the **self-sustaining regime**, r > 1. The substrate compounds. q(Dₙ) grows. Velocity rises. Cumulative time T(n) converges — each loop is faster than the last, and the total time to run arbitrarily many loops is bounded. The system is internally stable: small perturbations, like an agent making a mistake or a convention drifting, are corrected by the system's own activity. The closure that autocatalytic-set theory describes holds. The substrate is being produced by the loop that uses it.

In the **decay regime**, r < 1. The substrate erodes. q(Dₙ) decreases. Velocity falls. Cumulative time T(n) diverges — each loop is slower than the last, and total time over many loops grows without bound. Without external forcing, the trajectory ends in dissolution: the substrate becomes too incoherent for agents to produce useful work, and the loop fails. But real engineering organizations rarely experience pure dissolution, because external forcing exists. Customers expect software. Revenue depends on it. Deadlines exist. These external forces stabilize the system at a survival floor: functioning, producing output, but at a much lower quality and much slower velocity than the self-sustaining regime. This is the stagnation steady state. It is practically persistent, sometimes for years, but it is not internally self-sustaining. Remove the external forcing and the system collapses.

The two regimes are asymmetric. The self-sustaining attractor is genuinely stable: its persistence comes from inside the loop. The decay attractor is internally unstable but externally propped: its persistence comes from forces outside the engineering work. The gap between them is not just quantitative. Organizations in the two regimes are doing categorically different work, producing categorically different artifacts, and operating under categorically different cost structures.

The autocatalytic-set parallel is precise enough to be load-bearing. In RAF theory, the closure threshold separates two real regimes of chemistry: networks above closure that produce their own catalysts, and networks below closure that require continuous external input to maintain their components. The engineering analog: closure exists when every part of the description tape is being maintained by some part of the loop. Above closure, the tape compounds and the system is internally stable. Below closure, the tape decays and persistence depends on external forcing — market pressure, customer obligations, ongoing human attention spent fighting fires.

The theory's predictions live in the structural asymmetry between these regimes, not in any specific numerical value of r. We cannot currently compute r for any real organization. We can recognize which regime an organization is in by observing the symptoms — and the symptoms are categorically distinct, which is why this matters in practice.

---

## Labor: The Categorical Reclassification of Human Work

The architectural change has a direct consequence for human labor. Construction work — writing code, implementing features, generating tests — moves to agents and scales with compute rather than with engineer-hours. The work that remains for humans is substrate labor: maintaining the description tape, curating conventions, designing evals, exercising architectural judgment. This work behaves more like capital formation than ongoing labor. It has reclassified what "engineer" means in a way that has not yet been fully absorbed by the field or its surrounding institutions.

Pre-AI, human labor was distributed across the entire construction process. Engineers wrote the code. Engineers reviewed the code. Engineers maintained the implicit description through mentorship and retros. Engineers operated the workflow through planning and coordination. The same humans performed all four kinds of work, often within the same week. Construction labor dominated in volume, and the cost structure of software was roughly linear in features shipped: more features required more engineer-hours, because engineer-hours were the actual input to construction.

AI-era, the labor profile splits. Two kinds of work emerge that are categorically different in their economic character.

Construction labor — writing code, generating tests, implementing features, executing the steps of an agreed-upon plan — is performed by agents. Its cost scales with compute: agent count, model size, context length, inference time. Adding more construction throughput is a matter of paying more for compute, not hiring more humans. The marginal cost of construction is approaching the marginal cost of electricity.

Substrate labor — maintaining the description tape, curating conventions, designing evaluation suites, evaluating agent output at the substrate level rather than the feature level, exercising architectural judgment about what the system should become — is performed by humans. It does not scale with features shipped. It scales with the complexity and rate of change of the system being described. Two organizations shipping the same volume of features can require radically different amounts of substrate labor depending on the inherent complexity of what they're building.

These two kinds of labor are different not just in who performs them but in their economic structure. They differ on four axes.

Construction scales with output. Shipping ten features requires roughly ten times the construction. Substrate scales with system complexity. Shipping ten features within an existing well-described system requires roughly the same substrate labor as shipping one feature.

Construction is reproducible. An agent can write the hundredth React component much like the first, with little degradation in quality. Substrate is judgment-bound. A human deciding whether a pattern is worth codifying in the tape is making a judgment that depends on long-term context about where the codebase is going, and that judgment cannot be replicated by a process.

Construction has clear inputs and outputs. The input is a description and a request; the output is a merged change. Substrate is meta-work. The output of an hour spent improving the tape is that _future construction goes better_. The returns appear downstream, sometimes weeks or months later, distributed across many subsequent loops.

Construction is hourly labor. An engineer-hour produces a feature-hour's worth of code. Substrate is more like capital investment. An hour spent writing a precise convention into the description tape propagates through every subsequent agent loop that reads that convention. A well-designed eval catches a class of regressions for years. A clean architectural decision shapes hundreds of future design choices. The hour is not consumed in the production of one feature; it is invested in the substrate that produces all future features.

This is a real economic reclassification, not a stylistic relabeling. Pre-AI engineering work was mostly labor in the economic sense — work consumed in production, scaling linearly with output. AI-era engineering work is mostly capital formation — investment in a persistent substrate that produces returns across all subsequent loops. The marginal hour spent on construction produces one feature. The marginal hour spent on substrate propagates through every future loop. These are different economic objects.

Several consequences follow.

Team size decouples from output. If construction is cheap and substrate is the bottleneck, small teams with excellent substrate practice can out-produce much larger teams with mediocre substrate practice. This is not a hypothetical projection. It is already happening in well-organized AI-native engineering teams, where small groups produce output that would have required substantially larger headcounts under pre-AI economics. The bottleneck has moved, and the bottleneck is not labor volume.

The role of "engineer" has structurally shifted. Pre-AI, an engineer was someone who constructs software. The central activity of the job was writing code; everything else was an adjunct. AI-era, an engineer is someone who maintains the description of how software is constructed. The central activity is curating the substrate. Construction is delegated. The word "engineer" survives the transition, but the role it denotes is different.

Senior engineering judgment has gotten more valuable, not less. The naive expectation was that AI would compress the value of senior engineers by automating the work they used to do. The opposite has happened. Substrate work is judgment-heavy, and senior engineers are where judgment lives. The work AI replaces is more often junior construction work than senior architectural judgment. Seniors who can curate substrate effectively have become more leveraged, not less.

The skills that matter shift. Pre-AI: ability to write code quickly and correctly, debug efficiently, hold large amounts of system context in working memory. AI-era: ability to describe systems clearly in writing, design evals that detect what actually matters, recognize when implicit conventions should be codified, exercise taste about what the system should become. The first set of skills is increasingly automated. The second set is human-bound and in short supply.

One honest open question runs through all of this. The reclassification of engineering work from labor to capital formation is structural, but the total volume of substrate labor required across the industry is empirical and uncertain. It could go either way. Increased construction throughput could enable far more software to exist, requiring more substrate to maintain it — Jevons-paradox expansion. Or the leverage of small teams could compress total engineering employment significantly, with most of the work concentrating in a smaller number of high-judgment roles. The theory predicts the categorical shift. It does not predict the volume.

---

## Predictions and Observable Signatures

A theory of asymmetric attractors that didn't manifest in observable bifurcation would be weak. The theory developed here predicts that engineering organizations should be visibly diverging into two qualitatively different kinds of system. The contemporary observations of acceleration and stagnation that opened this essay are evidence for that prediction, not the foundation on which the theory rests.

The theory makes four specific predictions, each of which can be checked against observation.

**Divergence, not convergence.** Two engineering organizations that look similar at the start of AI adoption should grow more different over time, not more similar. This prediction distinguishes the asymmetric-attractor theory from simpler alternatives. A theory in which AI is uniformly faster would predict that all organizations get faster at similar rates. A theory in which AI quality varies would predict a roughly normal distribution of outcomes. The asymmetric-attractor theory predicts bifurcation: two distinct clusters of organizations, with the gap between clusters widening over time. The current empirical picture shows exactly this bifurcation. The gap between top and bottom engineering organizations is widening, not narrowing.

**Invisible early, irreversible late.** Bistable systems have the property that the regime is determined by where you are in state space, not by current trajectory. An organization can be on a trajectory toward the decay attractor while currently appearing healthy: current velocity is fine, but the substrate is degrading at a rate that will become apparent only later. Conversely, an organization can be on a trajectory toward the self-sustaining attractor while currently appearing slow: substrate investment is consuming time that would otherwise produce features, but the returns will compound. The theory predicts that early signals — six-month velocity, current feature throughput — should be poor predictors of long-term outcomes, while late signals — substrate coherence at eighteen to twenty-four months — should be excellent predictors. This differentiates trajectory from snapshot, and it explains why some organizations that looked great in early AI adoption are now visibly struggling.

**Specific symptoms of the externally-propped decay regime.** The theory predicts that organizations in the decay regime should exhibit a coherent cluster of symptoms: agent context that drifts from the actual state of the codebase, conventions that contradict each other across recent changes, evaluation suites that grow in size but lose signal as they fill with brittle tests, an increasing fraction of human time spent re-correcting agent output rather than reviewing genuinely new work, codebases that grow faster than the team's collective understanding of them, onboarding (of new humans or new agent configurations) that gets harder over time rather than easier. These symptoms cluster because they share a common cause: the substrate is being relied on faster than it is being maintained.

**Specific behaviors of the self-sustaining regime.** Organizations in the self-sustaining regime should exhibit a different coherent cluster: the description tape is treated as a first-class deliverable, reviewed alongside code; code review questions are oriented toward substrate quality ("does this change strengthen or weaken the tape?") rather than only feature correctness; evaluation suites are actively curated — tests deleted as well as added, with growth in signal rather than volume; agent configurations are improved on an ongoing basis rather than set up once and left to rot; onboarding gets faster over time because the substrate is doing more of the teaching. These behaviors cluster because they share a common cause: the organization treats the substrate as load-bearing and invests in maintaining it.

The contemporary evidence supports the theory in two specific ways. First, the bifurcation is empirically visible — two qualitatively different kinds of AI-era organization coexist under the same superficial label of "we use AI for engineering." Second, the symptom clusters reported in each kind of organization match the theoretical predictions closely. This is good evidence. If organizations were converging instead of diverging, or if the reported symptoms did not cluster as the theory predicts, the theory would be in serious trouble.

One additional observation supports the asymmetric-attractor framing specifically. Organizations in the decay regime rarely collapse outright. They persist, often for years, at a survival floor of functioning-but-degraded output. This is exactly what the theory predicts: the decay attractor is internally unstable but externally propped, so organizations occupying it can remain in business indefinitely as long as external forcing — customer revenue, market position, contractual obligations — keeps them above the dissolution point. They produce software. The software is increasingly incoherent. They do not die. They simply stop being the kind of organization that could cross the threshold without rebuilding.

The data points are evidence, not proof. The strong test of the theory will be whether the predicted divergence continues over the next several years and whether the symptom clusters hold up across a wider sample of organizations. The theory is falsifiable in a specific way: if the bifurcation reverses, or if the two clusters of organizations turn out to be statistical artifacts rather than structurally distinct regimes, the theory is wrong. Right now, neither of those failure modes appears to be occurring.

---

## Implications and Open Questions

The most consequential question an engineering leader can now ask is not "how fast are we shipping?" but "is our description tape compounding or decaying?" Velocity is downstream of substrate coherence. The leading indicator of long-term outcomes is whether each loop leaves the tape sharper or duller than it found it. This is a different question than the questions engineering leadership was previously trained to ask, and it has not yet been absorbed by most evaluation frameworks, hiring rubrics, or organizational structures.

The theory presented here does not prescribe what to do about this. It is not an operations manual. But it does change what questions become unavoidable.

The first unavoidable question is whether the description tape exists at all in any meaningful form. Many organizations have CLAUDE.md files and conventions documents that are not actually load-bearing — they are decorative, written once and ignored. A real description tape is one whose loss would cripple the engineering loop. If an organization can lose its tape with little effect on its work, it does not have a tape; it has documentation.

The second unavoidable question is the trajectory of the tape. Not the current state, but the derivative. Is the tape getting more coherent loop over loop, or less? Is it being reviewed and edited as part of the normal flow of work, or is it stagnant while the codebase moves on without it? The answer to this question is the most reliable predictor of whether the organization is in the self-sustaining regime or the decay regime.

The third unavoidable question concerns labor allocation. If substrate work is capital formation and construction work is increasingly delegated to agents, what fraction of human engineering hours should be spent on substrate versus construction? The pre-AI default of nearly all hours on construction is no longer correct. The right ratio is unknown and probably organization-specific. But the default has shifted, and organizations that have not adjusted their labor allocation are likely under-investing in the substrate that determines their long-term trajectory.

The fourth unavoidable question concerns hiring and evaluation. If the role of engineer has structurally reclassified, the criteria for evaluating engineering candidates and engineering performance should change. The skills that mattered most pre-AI — construction throughput, debugging speed, ability to hold system context in working memory — are increasingly automated. The skills that matter most AI-era — clear system description, eval design, architectural judgment, the ability to recognize when implicit knowledge should be codified — are not yet standard parts of most hiring rubrics. Organizations whose evaluation processes still optimize for the pre-AI skill profile will accumulate engineers who are well-suited to a kind of work that is rapidly disappearing.

Several questions the theory does not resolve.

How do you measure q in practice? The theory operates on the behavior of substrate quality — whether r is greater than or less than 1 — not on its absolute value. This is intentional: the theoretical predictions are about regime, not magnitude. But it leaves practitioners without a way to quantify their position. Developing real metrics for substrate coherence is empirical work that the theory motivates but does not perform.

Is r actually constant, or does it depend on the current state of D? The model treats r as a fixed multiplier for tractability. In reality, r is almost certainly state-dependent: the same practices that produce r > 1 in a clean codebase may produce r < 1 in a tangled one, because the substrate's degradation interferes with the maintenance work itself. This is a feedback loop that complicates the dynamics and may make the threshold less sharp in practice than the theory describes.

How sharp is the threshold in real engineering systems? RAF theory in chemistry shows a sharp transition: closure either holds or it doesn't. Engineering reality may be softer, with gradients near the boundary and metastable intermediate states. The theory's sharp-threshold prediction is the strongest form of the claim; weaker forms (a region of unstable transition between two regimes) would still preserve most of the theory's structure.

What is the engineering analog of the food set in autocatalytic-set theory? In chemistry, autocatalytic networks still require some minimal external inputs — the food set — to operate. In engineering, the analog is probably human judgment and architectural taste: a self-sustaining engineering system still requires human input, but only at the level of high-leverage substrate decisions, not at the level of construction. The boundary between what the system can produce internally and what must be supplied externally is worth investigating.

How does external forcing interact with internal substrate quality? The model treats them as separate: internal r > 1 produces self-sustainment, internal r < 1 produces externally-propped decay. In reality, the two interact. Customer pressure and market position shape what kinds of substrate decay get tolerated and what kinds get fixed. An organization in a forgiving market can decay further without consequence than an organization in a punishing one. The theory's separation is a useful first-order approximation but probably not the full picture.

How does the labor reclassification interact with broader labor markets, training pipelines, and organizational structures? The theory predicts that engineering work has reclassified from labor to capital formation. It does not predict how this reclassification will propagate through university programs, hiring practices, compensation structures, immigration policy, or the broader software industry. These are second-order consequences of the structural shift, and they are likely to be significant, but they are outside the scope of what the theory predicts.

The theory is presented for clarity, not certainty. It will be wrong in places. It will be incomplete in others. The mathematics is suggestive rather than predictive in any quantitative sense, and the empirical evidence is currently consistent with the theory but not yet sufficient to validate it strongly. Better theories may emerge.

But the architectural shift the theory describes is real. Engineering organizations have acquired a description tape — a substrate that did not exist in pre-AI engineering in any structurally meaningful sense. The asymmetric attractor structure is observable. The labor reclassification is already underway. The bifurcation between organizations that have crossed the threshold and organizations that have not is visible to anyone working in the field.

Understanding the architecture is the first step toward operating inside it. The questions follow from the architecture. The actions follow from the questions. The theory does not prescribe the actions, but it makes clear what kind of system is now being operated, what kind of work that operation requires, and what kind of consequences follow from doing the work well or poorly.

Software engineering has crossed a threshold that, until recently, was not crossable. The work that follows from that crossing is different in kind from what came before. The organizations that recognize this will operate inside the new architecture deliberately. The organizations that do not will continue to operate inside the old one — externally propped, slowly decaying, increasingly incoherent — until external forcing fails to sustain them.
