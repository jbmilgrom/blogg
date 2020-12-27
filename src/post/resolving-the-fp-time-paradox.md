---
title: Resolving the Time Paradox Implied by Functional Programs
date: 2020-12-27
tags: post
layout: layouts/post.liquid
---

Excerpted from [Functional Programming and the Semantics of Change, State & Time](/post/functional-programming-and-identity-state-and-time/#resolving-the-time-paradox). {.introductory-caveat}

> “No man can ever cross the same river twice.” Because what’s a river? I mean, we love this idea of objects; like there’s this thing that changes. Right? There’s no river. Right? There’s water there at one point-in-time. And another point-in-time, there’s other water there. — Rich Hickey, [Are We There Yet](https://github.com/matthiasn/talk-transcripts/blob/master/Hickey_Rich/AreWeThereYet.md), quoting Heraclitus.

From the perspective of a user, a functional program may appear stateful. Interact with [the functional ATM program above](/post/functional-programming-and-identity-state-and-time/#stateful-functional-programs) and notice the program remembering previous encounters. On the one hand, this is not surprising. We included an imperative layer to remember previous states. Instead of decomposing the state of the program into distinct objects, like `bankAccount` and `withdrawalAmount`, we created a single global object, the `store`. On the other hand, focusing on the “object” portion of the program betrays an object-oriented predisposition. The imperative piece of the program is merely a construct used to facilitate a computation based asynchronously on another. One can even imagine a programming language where such a construct is built into the language itself, hiding any imperative implementation from the programmer’s view. In fact, such a language exists that compiles to JavaScript.[^9] In other words, it is syntax, not semantics. The semantics of the program better align with the semantics of a recursive, iterative function, having state `S` at a discrete step `i` — run the functional ATM program with the output of the previous run to produce the input for the next.

That a program with a functional, stateless and timeless core can maintain state is surprising, to say the least. Look around the room, bus, park or wherever you find yourself reading this sentence, and you will likely identify “a collection of distinct objects,” such as dogs, people, and trees, “whose behaviors may change over time.” Look around the functional ATM program, on the other hand, and there are no identifiable objects to be found. Yet, the program appears to have state just like any other object in the room.

However, the ostensible “paradox” dissipates when the augmentation of our conception of time extends beyond the functional program to include the rest of our physical reality.

> One way to resolve this paradox is to realize that it is the user’s temporal existence that imposes state on the system. If the user could step back from the interaction and think in terms of streams of balances rather than individual transactions, the system would appear stateless — [SICP](https://web.mit.edu/alexmv/6.037/sicp.pdf) Section 3.5.5

Instead of viewing the _world_ as the sum of its objects, each reflecting its latest state as time elapses, we may also think in terms of discrete state histories. We may interpret the dog at the park as moving in discrete steps `S(i)` to `S(i+1)`, just as we interpret the state of our functional program as moving in discrete steps `S(i)` to `S(i+1)`.

Consider video media. To movie scenes, we may attribute the same object-oriented semantics. Character and inanimate objects shift, interact and evolve as time elapses.

<video id="metavideo" poster="/media/metavideoposter.gif" preload="none" style="margin:0;padding:0" width="480" controls>
    <source src="/media/metavideo.mp4" type="video/mp4; codecs=&quot;avc1.42E01E, mp4a.40.2&quot;">
    <img src="/media/metavideo.mp4" title="Your browser does not support the mp4 video codec.">
</video>

While playing the above video, for example, we may conclude that “a cat is dancing.” Yet, videos are comprised of static frames stitched together in a certain sequence at discrete time intervals. Each frame corresponds to a state of the video at a moment in time and the frames, taken together, a time-denominated series of discrete states. The media chosen above is intentionally meta. The video includes a TV animation of a scene mirrored by a flip-book[^12], showing static frames strung together at discrete time intervals, which itself is mirrored by a flip-book in “real” life, showing static frames strung together at discrete time intervals. Take another step back to notice that the above gif media (or mp4 if your browser supports html5) being played on _your_ computer is comprised of static frames, strung together at discrete time intervals.

There is nothing stopping us from taking another step back and interpreting the real world in which your computer currently sits as static frames, strung together at discrete time intervals. We _may_ attribute normal object-oriented semantics to the above gif, concluding that “a cat is dancing.” However, we may also attribute functional semantics, concluding that “a cat has arms above its head on frame fᵢ.” At a park in the real world, we may conclude that “a dog is chasing a squirrel.” However, we may also conclude that “a dog is in the running motion behind a squirrel in the running motion on frame fᵢ.” In both cases, we may identify a time-series of states instead of objects that change over time. The functional programming paradigm can be coherently applied to world and program alike.

With a model for discrete time in mind, it is less surprising that functional programs can appear stateful. A user of the program may be viewed as a series of states, just like the program itself. A specific series of user states, for example,

```text
U₀: "Open up this blog post"
U₁: “Select 20 option”
U₂: “Click withdraw”
...
U(i): Uᵢ
```

directly precipitate a series of program states:

```text
S₀: balance:100, amount:10
S₁: balance:100, amount:20
S₂: balance:80, amount:20
...
S(i): program(Sᵢ₋₁, Eᵢ)
```

In both cases, pieces of static information may be listed, one _after_ another. Moreover, both lists can be plotted along the same discrete timeline `i`. User interactions come in a certain order `U(i)`, triggering a run of the program function against the result of the previous run `S(i-1)` and event data `E(i)`, in order to produce `S(i)`. Our reality can be viewed as a time-series of states, just as it can be viewed as a collection of objects. Functional programming models a time-series of states, just as as object-oriented programming models objects. When the program and world *alike* can be viewed as “streams of information that flow in the system,” ([SICP](https://web.mit.edu/alexmv/6.037/sicp.pdf) Section 3) the world can flow into the program, and the program back into the world.

[^9]: [Elm](https://guide.elm-lang.org/) programs are trivially made to be stateful, notwithstanding the exclusive use of pure functions _and_ the asynchrony of user interactions! This counter program

      ```elm
      import Browser
      import Html exposing (Html, button, div, text)
      import Html.Events exposing (onClick)
    
      main =
      Browser.sandbox { init = 0, update = update, view = view }
    
      type Msg = Increment | Decrement
    
      update msg model =
      case msg of
      Increment ->
        model + 1
    
      Decrement ->
        model - 1
    
      view model =
      div []
      [ button [ onClick Decrement ] [ text "-" ]
      , div [] [ text (String.fromInt model) ]
      , button [ onClick Increment ] [ text "+" ]
      ]
      ```

    can be seen [here](https://elm-lang.org/examples/buttons) tracking counter state, even though a user may of course click the counter buttons asynchronously. Like garbage collection in JavaScript, Elm hides any imperative code dedicated to communication between asynchronous scripts from the programmer’s view.

[^12]: A flip-book [has been suggested](https://softwareengineering.stackexchange.com/a/245409/369472) as a valuable mental model for state in functional programming