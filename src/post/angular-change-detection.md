---
title: Watch, watchGroup, watchCollection and Deep Watching in AngularJS
date: 2016-05-20
tags: post
layout: layouts/post.liquid
---

### The Many Layers of Change Detection in Angular 1.x

A user clicks the “upvote” button,

![](https://cdn-images-1.medium.com/max/2000/1*kU6Q7pi0coovXxIOy8UaEw.png)

attempting to increase the vote count to 1034. An action `$apply`ed through an `ng-click`

```html
<i class="icon upvote" ng-click="vm.user.upvote(vm.answer)"></i>
```

would trigger a `$digest` cycle under the hood, which checks all registered `$watch`es for changes. Then, an expression providing “voted” styling for answers, registered through `ng-class`

```html
<i class="icon upvote"
  ng-click="vm.user.upvote(vm.answer)"
  ng-class="{voted: vm.answer.isVotedFor(vm.user)}">
</i>
```

and an expression providing the aggregate number of votes, registered through double curly braces \{\{\}\}

```html
<i class="icon upvote"
  ng-click="vm.user.upvote(vm.answer)"
  ng-class="{voted: vm.answer.isVotedFor(vm.user)}">
</i>
 {{ vm.answer.voteCount() }}
<i class="icon downvote"
  ng-click="vm.user.downvote(vm.answer)"
  ng-class="{voted: vm.answer.isVotedAgainst(vm.user)}">
</i>
```

would trigger the appropriate DOM updates:

![](https://cdn-images-1.medium.com/max/2000/1*CxheOXIunYTXze80R08l5A.png)

Change detection is a fundamental part of AngularJS applications. Whether utilizing native AngularJS directives or building your own, an understanding of the many layers of data watching is essential to understanding Angular.

## Some Interesting (but skippable) background

### An angular expression can produce different values over time.

Watching consists of getting the value of an expression and performing a task when it has changed. In angular, an expression can take the form of a string or a javascript function:

_1. any ol’ javascript function_

```js
scope.greeting = 'hi there';

var getGreeting = function(scope) {
  return scope.greeting;
};
scope.$watch(getGreeting, function(greeting) {
  console.log('greeting: ', greeting); // greeting: hi there
});
```

_2. string_

```js
scope.greeting = 'hi there';

scope.$watch('greeting', function(greeting) {
  console.log('greeting: ', greeting); // greeting: hi there
});
```

**Function or… string?** Internally, the first thing the _$scope.$watch_ method does is [pass its first parameter to the \$parse service](https://github.com/angular/angular.js/blob/v1.5.3/src/ng/rootScope.js#L387). The _$parse_ service is a function (obviously) that returns another function (let’s call it the “parseFn”). The _parseFn_ expects to be called with the desired context object against which the original string or function may be evaluated e.g.

```js
var context = {first: 'steph', last: 'curry'};

// with string
var string = 'last + ", " + first';
var parseFn = $parse(string);
parseFn(context); // => curry, steph

// with function
var func = function(context) {
  return context.last + ', ' + context.first;
};
var parseFn = $parse(func);
parseFn(context); // => curry, steph
```

If the _\$parse_ service receives a string, [work needs to be performed](https://github.com/angular/angular.js/blob/v1.5.3/src/ng/parse.js#L1791) in order to translate the string into proper javascript that is capable of evaluation against an object i.e. a function. On the other hand, if it receives a function, well… [not much needs to happen](https://github.com/angular/angular.js/blob/v1.5.3/src/ng/parse.js#L1822). Since the service has received what it must produce, it may assume the function has been properly prepared. As you can see, most of the angular “magic” lies in parsing the string parameter into such a function to enable the intake of a string.

**At any point in time**. There is a reason angular has chosen the function-with-context-object-parameter structure: calls to the function reveal changes to underlying context, which means that the function can be invoked at any point in time to retrieve the value of the underlying expression or function _at such time_:

```js
var fullName = 'last + ", " + first';
var getFullName = $parse(fullName); // getFullName is the parseFn!

var context = {first: 'steph', last: 'curry'};
getFullName(context); // => curry, steph
context = {first: 'russ', last: 'westbrook'};
getFullName(context); // => westbrook, russ
```

Since scope objects are…objects, this of course works with scope objects as well. The string *"vm.answer.isVotedFor(vm.user)"* from the “upvote” example above — after being passed to *parse* by _watch_ and transformed into a function that is ready to accept an object — was ready to reveal any new *isVotedFor* status reflected in an updated scope object. Now the function-returning-a-function structure of the parse service also begins to make sense. The returned function (i.e the _parseFn_), prepped and ready to accept the latest scope object, is exactly what the digest cycle needs and [precisely what it receives](https://github.com/angular/angular.js/blob/v1.5.3/src/ng/rootScope.js#L413) in order to get the latest value of an expression. Sensibly, the _parseFn_ is [named “get” internally](https://github.com/angular/angular.js/blob/v1.5.3/src/ng/rootScope.js#L387) because of these getter qualities.

**Against the last cached value**. Now to determine change, all the _\$digest_ cycle has left to do is cache the _last_ value retrieved by the registered _parseFn_ and compare it to the next….which brings us to the topic of this post: this comparison between new and old values, what constitutes equality and the multiple levels of change detection in angular.

## $watch — type 1

The simplest and most common, this type of _watch_ uses javascript’s `===` operator to compare old and new values, invoking the callback only upon _strict inequality_:

```js
scope.$watch('greeting', function(greeting) {
  console.log('greeting: ', greeting);
});

scope.greeting = 'hi there'; // greeting: hi there

$timeout(function() { scope.greeting += ', Joe'}); // greeting: hi there, Joe
```

For expressions that evaluate to primitive types like Strings and Numbers, this has a predictable effect. Old and new values of `4` and `4` are considered equal, but `4` and `5` and `4` and `‘4’` are not. Similarly, _‘hello’_ and _‘hello’_ will not register a change, but _‘hello’_ and _‘goodbye’_ will. In the above “upvote” example, angular’s curly brackets _\{\{\}\}_ registered [_this_ type of watch](https://github.com/angular/angular.js/blob/master/src/ng/compile.js#L2782) for the expression _vm.answer.voteCount()_. When _1034_ was compared against _1033_, a change was registered.

For expressions that evaluate to javascript *objects*, strict equality means something less intuitive. The same object, no matter how mutated between equality checks, will _not_ register “change”, whereas, two different objects, no matter how similar, will:

```js
scope.$watch('obj1', function callback(newValue) {
  console.log('obj1: ', newValue);
});

// (when initialized) prints out: undefined

$timeout(function() {
  scope.obj1 = {name: 'jonathan'}; // prints out: {name: 'jonathan'}
});

$timeout(function() {
  scope.obj1.name = 'michael'; // no "change" registered, no print out
}, 500);

$timeout(function() {
  scope.obj1.age = 30; // no "change" registered, no print out
}, 1000);

$timeout(function() {
  // it's a new object! 
  scope.obj1 = {name: 'jonathan'}; // prints out: {name: 'jonathan'}
}, 1500);
```

The important thing to note in determining how change is registered is not whether two objects have the same properties but whether two objects refer to the same address in memory i.e whether they are the same object. Notice in the above example that different objects with exactly the same properties and values nevertheless register change and print to the console with the latest object because they are different objects. Whereas, the same object reference prints nothing to the console no matter how mutated between equality checks.

## \$watchGroup — type 2

This type of watch can handle multiple expressions instead of being limited to just one, invoking the registered callback when _any_ of the expressions have changed.

```js
scope.$watchGroup(['expression1', 'expression2'], function(arrayOfExpressions) {
  ...
});
```

You may want to use this type of watch if two or more properties are coupled. In the above “upvote” example, you could use this watch to disable further voting if an answer has been voted for _or_ against:

```js
var isVotedGroup = [
  'vm.answer.isVotedAgainst(vm.user)',
  'vm.answer.isVotedFor(vm.user)'
];

var unwatch = scope.$watchGroup(isVotedGroup, function(isVotedGroup) {
  var hasVoted = isVotedGroup.some(function(bool) {
    return bool;
  });
  if (hasVoted) {
    vm.answer.disableVoting(vm.user);
    unwatch();
  } 
});
```

The important thing to note is that the containing array itself is _not_ watched by *watchGroup, *in stark contrast to (maybe the more familiar) *watchCollection; *rather*, *each member of the array is. Much like the subject of a regular type 1 _watch_, each member of the array can itself be a string expression capable of contextual evaluation or a function ready to be passed a context object. As a result, _watchGroup_ can be seen as simply a way to group together multiple regular type 1 *watch’*es with a single callback function. When *any of the grouped *watches registers a change, the callback is invoked. This set up has the benefit of allowing expressions to be members of the group as described. But members of the group cannot be dynamically added or subtracted and order is not an applicable concept…which brings us to _watchCollection_.

## \$watchCollection — type 3

This type of watch is intended for javascript arrays, invoking the callback when collection level changes have occurred.

```js
$scope.firstTeam = [{
  first: 'steph',
  last: 'curry'
}, {
  first: 'lebron',
  last: 'james'
}];

$scope.$watchCollection('firstTeam', function(firstTeamArray) {
  console.log("change to the first team! ", JSON.stringify(firstTeamArray));
});

$timeout(function() {
  $scope.firstTeam.push({first: 'russel', last: 'westbrook'});
}); // new member, print!

$timeout(function() {
  $scope.firstTeam.sort(function(player1, player2) {
    if (player1.first < player2.first) return -1;
  });
}, 300); // reordering, print!

$timeout(function() {
  $scope.firstTeam[0].height = 75;
}, 600); // member mutation, no print
```

Where _watchGroup_ allows multiple expressions capable of contextual evaluation to point to one callback, _watchCollection_ allows only one — in the above example, _‘firstTeam’_. On the other hand, the type of watch applied to such expression is more involved. Type 1 watchers care only about addresses for objects and values for primitives. As objects themselves, arrays are no different. Subject to a type 1 watch, expressions that evaluate to an array will not register change no matter how mutated between checks until switched out for an entirely new array and address in memory. _watchCollection_ is vastly different. Mutation is the name of the game. In particular, _watchCollection_ keeps its eye on two types of surface level array mutations: (1) addition/subtraction and (2) reordering. Adding or subtracting members of the array and reordering members of the array result in change being recognized and the registered callback being invoked. watchCollection only stops short of watching below-surface mutation i.e. deep mutation, mutations to the members themselves… which brings us to deep watching.

## \$watch(…, …, true) — type 4

The most expensive watch, this type of watch is also the most thorough, recursively scaling the depths of any complex object and invoking the registered callback when any branch of the tree has undergone change. Note the _true_ flag, which tells angular to perform this type of watch instead of a type 1:

```js
scope.tree = {
  type: 'oak',
  branches: [{
    color: 'brown',
    length: '11',
    leaves: [{
      color: 'green',
      shape: 'oval',
    }, {
      color: 'brown',
      shape: 'leafy'
    }]
  }]
};

scope.$watch('tree', function(tree) {
  console.log('change to tree!', JSON.stringfiy(tree));
}, true);

$timeout(function() { scope.tree.type = 'sequoia'; }); // mutation, print!

$timeout(function() {
  scope.tree.branches[0].length = 12; // mutation, print!
}, 100);

$timeout(function() {
  scope.tree.branches[0].leaves[0].color = 'clementine'; // mutation, print!
}, 200);

$timeout(function() {
  scope.tree.branches[0].leaves.push({ // mutation, print!
    color: 'rosemary'
  });
}, 300);

$timeout(function() {
  scope.tree = 'hello!'; // mutation, print!
}, 400);
```

Deep watching has no limitations, other than performance of course — the last thing your application needs is recursive journeys into the depths of complex objects _every_ digest cycle. On the other hand, deep watching can keep any complex data in sync with the view and, as a result, may be the easiest to understand: all change is change.

This has been a discussion of the many layers of data watching in AngularJS. I hope it helps inform your choice among them!

Quote of the Day:

> Reporter: Why do you shoot so many 3's?

>[Antoine Walker](http://espn.go.com/blog/truehoop/post/_/id/22316/behold-the-4-pointer): Because there aren’t any 4's.
