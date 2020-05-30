---
title: watch, watchGroup, watchCollection and Deep Watching in AngularJS
date: 2016-05-20
tags: post
layout: layouts/post.liquid
---
### The Many Layers of Change Detection in Angular 1.x

A user clicks the “upvote” button,

![](https://cdn-images-1.medium.com/max/2000/1*kU6Q7pi0coovXxIOy8UaEw.png)

attempting to increase the vote count to 1034. An action `$apply`ed through an `ng-click`

<iframe src="https://medium.com/media/20073860802ff308e507627eb17fe4d0" frameborder=0></iframe>

would trigger a `$digest` cycle under the hood, which checks all registered `$watch`es for changes. Then, an expression providing “voted” styling for answers, registered through `ng-class`

<iframe src="https://medium.com/media/f3f2143768324a69e23ef5fdc80994fe" frameborder=0></iframe>

and an expression providing the aggregate number of votes, registered through double curly braces `\{\{\}}\`

<iframe src="https://medium.com/media/0fc4732bc90242f3ea00336a76828a90" frameborder=0></iframe>

would trigger the appropriate DOM updates:

![](https://cdn-images-1.medium.com/max/2000/1*CxheOXIunYTXze80R08l5A.png)

Change detection is a fundamental part of AngularJS applications. Whether utilizing native AngularJS directives or building your own, an understanding of the many layers of data watching is essential to understanding Angular.

## **Some I**nteresting (but skippable)** background**

### An angular expression can produce different values over time.

Watching consists of getting the value of an expression and performing a task when it has changed. In angular, an expression can take the form of a string or a javascript function:

*1. any ol’ javascript function*

<iframe src="https://medium.com/media/1b5f53cbfed298263aa75955dc91e67c" frameborder=0></iframe>

*2. string*

<iframe src="https://medium.com/media/c676a7f4571691e2e13ff581afccf7e4" frameborder=0></iframe>

**Function or… string?** Internally, the first thing the *$scope.$watch* method does is [pass its first parameter to the $parse service](https://github.com/angular/angular.js/blob/v1.5.3/src/ng/rootScope.js#L387). The *$parse* service is a function (obviously) that returns another function (let’s call it the “parseFn”). The *parseFn* expects to be called with the desired context object against which the original string or function may be evaluated e.g.

<iframe src="https://medium.com/media/e3b63b23c359446dedc7e05d2383e6e6" frameborder=0></iframe>

If the *$parse* service receives a string, [work needs to be performed](https://github.com/angular/angular.js/blob/v1.5.3/src/ng/parse.js#L1791) in order to translate the string into proper javascript that is capable of evaluation against an object i.e. a function. On the other hand, if it receives a function, well… [not much needs to happen](https://github.com/angular/angular.js/blob/v1.5.3/src/ng/parse.js#L1822). Since the service has received what it must produce, it may assume the function has been properly prepared. As you can see, most of the angular “magic” lies in parsing the string parameter into such a function to enable the intake of a string.

**At any point in time**. There is a reason angular has chosen the function-with-context-object-parameter structure: *c*alls to the function reveal changes to underlying context, which means that the function can be invoked at any point in time to retrieve the value of the underlying expression or function *at such time*:

<iframe src="https://medium.com/media/b02130e1ec0aaaa9219340a0b8be69ca" frameborder=0></iframe>

Since scope objects are…objects, this of course works with scope objects as well. The string *‘vm.answer.isVotedFor(vm.user)’ *from the “upvote” example above — after being passed to *parse *by *watch* and transformed into a function that is ready to accept an object — was ready to reveal any new *isVotedFor *status reflected in an updated scope object. Now the function-returning-a-function structure of the parse service also begins to make sense. The returned function (i.e the *parseFn*), prepped and ready to accept the latest scope object, is exactly what the digest cycle needs and [precisely what it receives](https://github.com/angular/angular.js/blob/v1.5.3/src/ng/rootScope.js#L413) in order to get the latest value of an expression. Sensibly, the *parseFn* is [named “get” internally](https://github.com/angular/angular.js/blob/v1.5.3/src/ng/rootScope.js#L387) because of these getter qualities.

**Against the last cached value**. Now to determine change, all the *$digest* cycle has left to do is cache the *last* value retrieved by the registered *parseFn* and compare it to the next….which brings us to the topic of this post: this comparison between new and old values, what constitutes equality and the multiple levels of change detection in angular.

## $watch — type 1

The simplest and most common, this type of *watch* uses javascript’s *===** ***operator to compare old and new values, invoking the callback only upon *strict inequality*:

<iframe src="https://medium.com/media/8fc183fd38dc3a257ae0d3459d04fd58" frameborder=0></iframe>

For expressions that evaluate to primitive types like Strings and Numbers, this has a predictable effect. Old and new values of *4* and *4* are considered equal, but* 4 *and *5* and* 4* and *‘4’ *are not. Similarly, *‘hello’* and *‘hello’* will not register a change, but *‘hello’* and *‘goodbye’* will. In the above “upvote” example, angular’s curly brackets *\{\{\}\}* registered [*this* type of watch](https://github.com/angular/angular.js/blob/master/src/ng/compile.js#L2782) for the expression *vm.answer.voteCount()*. When *1034* was compared against *1033*, a change was registered.

For expressions that evaluate to javascript* objects*, strict equality means something less intuitive. The same object, no matter how mutated between equality checks, will *not* register “change”, whereas, two different objects, no matter how similar, will:

<iframe src="https://medium.com/media/90f6c6cb19633871284517ef9636bd03" frameborder=0></iframe>

The important thing to note in determining how change is registered is not whether two objects have the same properties but whether two objects refer to the same address in memory i.e whether they are the same object. Notice in the above example that different objects with exactly the same properties and values nevertheless register change and print to the console with the latest object because they are different objects. Whereas, the same object reference prints nothing to the console no matter how mutated between equality checks.

## $watchGroup — type 2

This type of watch can handle multiple expressions instead of being limited to just one, invoking the registered callback when *any* of the expressions have changed.

<iframe src="https://medium.com/media/e267001df18b70bfa769ce62c51d372f" frameborder=0></iframe>

You may want to use this type of watch if two or more properties are coupled. In the above “upvote” example, you could use this watch to disable further voting if an answer has been voted for *or* against:

<iframe src="https://medium.com/media/bd59f1d5e356a4bdf07e3ea81deb29dc" frameborder=0></iframe>

The important thing to note is that the containing array itself is *not* watched by *watchGroup, *in stark contrast to (maybe the more familiar) *watchCollection; *rather*, *each member of the array is. Much like the subject of a regular type 1 *watch*, each member of the array can itself be a string expression capable of contextual evaluation or a function ready to be passed a context object. As a result, *watchGroup* can be seen as simply a way to group together multiple regular type 1 *watch’*es with a single callback function. When *any of the grouped *watches registers a change, the callback is invoked. This set up has the benefit of allowing expressions to be members of the group as described. But members of the group cannot be dynamically added or subtracted and order is not an applicable concept…which brings us to *watchCollection*.

## $watchCollection — type 3

This type of watch is intended for javascript arrays, invoking the callback when collection level changes have occurred.

<iframe src="https://medium.com/media/9570b898823bf163f1a30d020e0a1810" frameborder=0></iframe>

Where *watchGroup* allows multiple expressions capable of contextual evaluation to point to one callback, *watchCollection* allows only one — in the above example, *‘firstTeam’*. On the other hand, the type of watch applied to such expression is more involved. Type 1 watchers care only about addresses for objects and values for primitives. As objects themselves, arrays are no different. Subject to a type 1 watch, expressions that evaluate to an array will not register change no matter how mutated between checks until switched out for an entirely new array and address in memory. *watchCollection* is vastly different. Mutation is the name of the game. In particular, *watchCollection* keeps its eye on two types of surface level array mutations: (1) addition/subtraction and (2) reordering. Adding or subtracting members of the array and reordering members of the array result in change being recognized and the registered callback being invoked. watchCollection only stops short of watching below-surface mutation i.e. deep mutation, mutations to the members themselves… which brings us to deep watching.

## $watch(…, …, true) — type 4

The most expensive watch, this type of watch is also the most thorough, recursively scaling the depths of any complex object and invoking the registered callback when any branch of the tree has undergone change. Note the *true* flag, which tells angular to perform this type of watch instead of a type 1:

<iframe src="https://medium.com/media/877534adc52574bce1f2a32065f01cb8" frameborder=0></iframe>

Deep watching has no limitations, other than performance of course — the last thing your application needs is recursive journeys into the depths of complex objects *every* digest cycle. On the other hand, deep watching can keep any complex data in sync with the view and, as a result, may be the easiest to understand: all change is change.

This has been a discussion of the many layers of data watching in AngularJS. I hope it helps inform your choice among them!

Quote of the Day:
> Reporter: Why do you shoot so many 3's?
> [Antoine Walker](http://espn.go.com/blog/truehoop/post/_/id/22316/behold-the-4-pointer): Because there aren’t any 4's.
Done in 10.87s.
