---
title: Quick Synopsis of the Paradigmatic Advantages of Functional Programming
date: 2023-05-22
tags: post
layout: layouts/post.liquid
---

Excerpted from [Functional Programming and the Semantics of Change, State & Time](/post/functional-programming-and-identity-state-and-time/) because sometimes 100 words is worth a 1000. {.introductory-caveat}

There are many advantages to functional programming. Programs that deal with mutation are “drastically more difficult” to reason about than ones that do not.

    > Referential transparency is violated when we include set! [i.e. assignment operations] in our computer language. This makes it tricky to determine when we can simplify expressions by substituting equivalent expressions. Consequently, reasoning about programs that use assignment becomes drastically more difficult — SICP Section 3.1.3

In particular, functions avoid [temporal coupling](https://www.yegor256.com/2015/12/08/temporal-coupling-between-method-calls.html) since there is no time,

    > In general, programming with assignment forces us to carefully consider the relative orders of the assignments to make sure that each statement is using the correct version of the variables that have been changed. This issue simply does not arise in functional programs. — SICP Section 3.1.3

and dramatically reduce debugging and unit testing complexity since there is no meaningful context.

    > “And that is the problem with places. You have this sort of global state that you have to reproduce in order to debug a field problem. That is very very tough.” Rich Hickey, [The Value of Values](https://github.com/matthiasn/talk-transcripts/blob/master/Hickey_Rich/ValueOfValuesLong.md)

Reified state couches in writing what must otherwise live in a programmer's heads — each member of aP team can read a function signature instead of building up (hopefully) the same working memory for each object. Couching state in language makes it accessible to static language analysis tools. [A compiler may exhaustively permute the set of application states](https://blog.ploeh.dk/2019/07/01/yes-silver-bullet/#bd2d47d8dac2401e936ca7902bc9109d) without actually running manually-written (exhaust*ing*) unit tests. Functional programs are more easily parallelized since they are just functions with no internal model for time.

    > Unfortunately, the complexities introduced by assignment become even more problematic in the presence of concurrency. — SICP Section 3.4

These advantages have been known for decades. John Backus “gave high visibility to functional programming” (SICP Section 3.5.5; also see Simon Peyton-Jones, [Escape from the ivory tower: the Haskel journey](https://www.youtube.com/watch?v=re96UgMk6GQ)) through his [Turing Award lecture](https://www.thocp.net/biographies/papers/backus_turingaward_lecture.pdf) in 1978, seven years before the creation of [C++](https://en.wikipedia.org/wiki/C%2B%2B) and thirteen before [Java](https://en.wikipedia.org/wiki/Java_%28programming_language%29). The [resistance inherent in a dominant linguistic/scientific mode of thinking](post/fp-as-a-scientific-revolution/) perhaps explain the dominance of object-oriented and imperative programming languages, notwithstanding the long-standing advantages of functional programming.