---
title: Functional Programming as a Scientific Revolution
date: 2020-12-24
tags: post
layout: layouts/post.liquid
---

Excerpted from [Functional Programming and the Semantics of Change, State & Time](/post/functional-programming-and-identity-state-and-time/) because sometimes you need to see the waterfall to want to take the hike.

____


> We were all object-oriented programmers at one point in time — Rich Hickey, [The Value of Values](https://github.com/matthiasn/talk-transcripts/blob/master/Hickey_Rich/ValueOfValuesLong.md)

Assimilation of functional semantics with any regular conception of the physical world is no easy task. Look again around the room, bus or park and you will likely still identify distinct objects that may change over time. I kicked around chapter 3 of [SICP](https://web.mit.edu/alexmv/6.037/sicp.pdf) for over a year before wrapping my head around it. That we may still be experiencing disbelief at the thought of a new model for time suggests a larger game at play.

Dominant scientific paradigms pervade our language, on the one hand, and way of thinking, on the other.

> Scientific practice always involves the production and the explanation of generalizations about nature; those activities presuppose a language with some minimal richness; and the acquisition of such a language brings knowledge of nature with it. When the exhibit of examples is part of the process of learning terms like “motion,” ‘‘cell,‘‘ or ‘‘energy element,’’ what is acquired is knowledge of language and of the world together. **On the one hand**, the student learns what these terms mean, what features are relevant to attaching them to nature, what things cannot be said of them on pain of self-contradiction, and so on. **On the other hand**, the student learns what categories of things populate the world, what their salient features are, and something about the behavior that is and is not permitted to them. In much of language learning these two sorts of knowledge — **knowledge of words and knowledge of nature** — are acquired together, not really two sorts of knowledge at all, but two faces of the single coinage that a language provides. — Thomas Kuhn, [What are Scientific Revolutions?](http://sites.fas.harvard.edu/~hsci161/Sci._Rev._Reader/12_S6_Kuhn.pdf)

As a result, a new discovery “that cannot be accommodated within the concepts in use before” may elicit surprise or even disbelief. “One cannot get from the old to the new simply by an addition to what was already known. Nor can one quite describe the new in the vocabulary of the old or vice versa.” ([Thomas Kuhn](http://sites.fas.harvard.edu/~hsci161/Sci._Rev._Reader/12_S6_Kuhn.pdf)) Rather, in order to “make or to assimilate such a discovery one must alter the way one thinks about and describes some range of natural phenomena”; even the articulation of an observation that runs counter to the dominant paradigm can only be “formulated by altering the language with which nature [is] described.” ([Thomas Kuhn](http://sites.fas.harvard.edu/~hsci161/Sci._Rev._Reader/12_S6_Kuhn.pdf))

> Consider the compound sentence, “In the Ptolemaic system planets revolve about the earth; in the Copernican they revolve about the sun.” Strictly construed, that sentence is incoherent. The first occurrence of the term “planet” is Ptolemaic, the second Copernican, and the two attach to nature differently. For no univocal reading of the term “planet” is the compound sentence true. — Thomas Kuhn, [What are Scientific Revolutions?](http://sites.fas.harvard.edu/~hsci161/Sci._Rev._Reader/12_S6_Kuhn.pdf)

Similarly, object-orientation pervades our language, on the one hand. That “objects change as time elapses” is a statement of obvious fact betrays the object-oriented presumption embedded in our language. “Object” (and “identity”), “change” (and “state”), and “time” work together to describe a coherent _object-oriented_ view. On the other hand, objects orient our perception of our own physical reality.

> Modeling with objects is powerful and intuitive, largely because this matches the perception of interacting with a world of which we are part. — [SICP](https://web.mit.edu/alexmv/6.037/sicp.pdf) Section 3.5.5

Look again around the room, bus, park or wherever you find yourself reading this sentence, and you will likely identify “a collection of distinct objects,” such as dogs, people, and trees, “whose behaviors may change over time.”

Yet, the behavior of a functional program cannot be described in terms that attribute change to the enduring identity of objects as time elapses. And because of the dominance of object-orientation as reflected in the presumptions of our natural language, we cannot so much as describe the semantics of a functional program except through altering our language and reconstituting our physical reality. Meaningful “identity” must disappear in favor of change itself. “State” must describe the result of change instead of an object quality. “Time” must describe discrete state changes rather than any continuous dynamicness attributable to all objects.

No wonder the functional model may still elicit disbelief. [This essay](/post/functional-programming-and-identity-state-and-time) can be seen as an uphill climb against the gravity of a dominant paradigm; the functional view is perhaps expressible now, but only because of [the arduous work put in above](/post/functional-programming-and-identity-state-and-time). Our natural language is not so easily distorted, violated and repurposed and our thought patterns are comorbid with our language.

> Until those changes had occurred, language itself resisted the invention and introduction of the sought after new theories. The same resistance by language is, I take it, the reason for Planck’s switch from ‘‘element’’ and ‘‘resonator’’ to ‘‘quantum’’ and ‘‘oscillator.’’ Violation or distortion of a previously unproblematic scientific language is the touchstone for revolutionary change. — Thomas Kuhn, [What are Scientific Revolutions?](http://sites.fas.harvard.edu/~hsci161/Sci._Rev._Reader/12_S6_Kuhn.pdf)

As a result, teaching functional programming to anyone is like teaching Copernican astronomy to a Ptolemaic astronomer or quantum mechanics to a Newtonian physicist. We lack the basic language to articulate the underlying concepts. Worse still, the language we do have is endemic to a conflicting paradigm. Perhaps the disparity between the efficacy[^10] and popularity[^11] of functional programming languages is best explained in this light.

> A new scientific truth does not triumph by convincing its opponents and making them see the light, but rather because its opponents eventually die, and a new generation grows up that is familiar with it — Max Plank, [autobiography](https://pubs.acs.org/doi/pdf/10.1021/ed027p288.1), quoted by Thomas Kuhn, [The Structure of Scientific Revolutions](https://en.wikipedia.org/wiki/The_Structure_of_Scientific_Revolutions)

Nevertheless, the functional view is indeed expressible as a result of the [work put in above](/post/functional-programming-and-identity-state-and-time). We can see change as creating something new, instead of altering something of old, and time as a series of successive states. We can alter our language and reimagine our physical reality to support a functional view of change, state and time.


[^10]: There are many advantages to functional programming. Programs that deal with mutation are “drastically more difficult” to reason about than ones that do not.

    > Referential transparency is violated when we include set! [i.e. assignment operations] in our computer language. This makes it tricky to determine when we can simplify expressions by substituting equivalent expressions. Consequently, reasoning about programs that use assignment becomes drastically more difficult — SICP Section 3.1.3

    In particular, functions avoid [temporal coupling](https://www.yegor256.com/2015/12/08/temporal-coupling-between-method-calls.html) since there is no time,

    > In general, programming with assignment forces us to carefully consider the relative orders of the assignments to make sure that each statement is using the correct version of the variables that have been changed. This issue simply does not arise in functional programs. — SICP Section 3.1.3

    and dramatically reduce debugging and unit testing complexity since there is no meaningful context.

    > “And that is the problem with places. You have this sort of global state that you have to reproduce in order to debug a field problem. That is very very tough.” Rich Hickey, [The Value of Values](https://github.com/matthiasn/talk-transcripts/blob/master/Hickey_Rich/ValueOfValuesLong.md)

    Reified state couches in writing what must otherwise live as thoughts in programmers’ heads — each member of a team can read a function signature instead of building up (hopefully) the same working memory for each object. Couching state in language makes it accessible to static language analysis tools. [A compiler may exhaustively permute the set of application states](https://blog.ploeh.dk/2019/07/01/yes-silver-bullet/#bd2d47d8dac2401e936ca7902bc9109d) without actually running manually-written (exhaust*ing*) unit tests. Functional programs are more easily parallelized since they are just functions with no internal model for time.

    > Unfortunately, the complexities introduced by assignment become even more problematic in the presence of concurrency. — SICP Section 3.4

    These advantages have been known for decades. John Backus “gave high visibility to functional programming” (SICP Section 3.5.5; also see Simon Peyton-Jones, [Escape from the ivory tower: the Haskel journey](https://www.youtube.com/watch?v=re96UgMk6GQ)) through his [Turing Award lecture](https://www.thocp.net/biographies/papers/backus_turingaward_lecture.pdf) in 1978, seven years before the creation of [C++](https://en.wikipedia.org/wiki/C%2B%2B) and thirteen before [Java](https://en.wikipedia.org/wiki/Java_%28programming_language%29).

[^11]: The [20 most popular languages](https://www.tiobe.com/tiobe-index/) are predominantly imperative or object-oriented.
