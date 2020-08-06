---
title: Functional Programming and the Semantics of Change, State & Time
date: 2020-03-09
tags: post
layout: layouts/post.liquid
hasTOC: yes
---

That functional programming opposes object-oriented programming in some fundamental way is a widely-held programming cliche. We list features like immutability, functions and composition in contrast to mutability, classes and inheritance. We tout Clojure and Haskel as functional languages on one end of the spectrum and C++ and Java as object-oriented languages on the other. Articulating the makeup of the spectrum is another story altogether however. None of this trivia reveals why certain features are seen together or apart, why languages themselves may skew in one direction or another, or any inherent differences in program semantics. Nevertheless, the “functions vs. objects” cliche is an artifact of a profound truth about program structures and semantics. Like up and down and oil and water, functional and object-oriented programming indeed cannot coexist. We may choose objects or functions, but not both at once, as advertised. Moreover, the choice between paradigms has dramatic implications for program semantics, offering competing “world-views” involving concepts as basic as identity, change, state and time. Object-oriented programs produce “distinct objects whose behaviors may _change over time_.” By contrast, functional programs involve state transitions between _discrete_ _moments in time_ that can be seen together as “streams of information that flow in the system.” — [Structure and Interpretation of Computer Programs](https://web.mit.edu/alexmv/6.037/sicp.pdf) (SICP), Section 3

[toc]

## Preface: Why JavaScript 

Many of the insights underlying this post can be found in original form in the [Structure and Interpretation of Computer Programs ](https://web.mit.edu/alexmv/6.037/sicp.pdf) (SICP). There you will find a life-altering discussion of the same topics using Scheme, a Lisp dialect like Clojure. All code examples included in this post, however, will be couched in terms of JavaScript, even if borrowed. If you know JavaScript and are unfamiliar with Scheme, this post may be immediately accessible to you without first learning how “[to balance all those parens](https://crockford.com/javascript/javascript.html).” Little is lost in translation as well. JavaScript has first-class functions (i.e. lambdas), closures (i.e. function-delimited lexical scoping) and generally thrives when used functionally.

 > JavaScript’s functions are first class objects with (mostly) lexical scoping. JavaScript is the first lambda language to go mainstream. Deep down, JavaScript has more in common with Lisp and Scheme than with Java. It is Lisp in C’s clothing. — Douglas Crockford, [JavaScript: The Good Parts](https://www.oreilly.com/library/view/javascript-the-good/9780596517748/ch01s02.html)

There is even an ongoing [academic effort](https://sicp.comp.nus.edu.sg/) to translate the full text of SICP into JavaScript. Also considered, JavaScript is a close cousin of TypeScript, which enables traditional object-oriented constructs like `private` and `public` and functional constructs like `readonly` and `as const` at compile time. Perhaps in JavaScript (and TypeScript), we get enough support of functional and object-oriented programming paradigms to enable a discussion of both within a single, ubiquitous language.

## Object-Oriented Programming

_Object-oriented programming_ has come to signify a common language for modeling the behavior of objects.[^3] _Methods_ leverage privileged access to proscribe the ways in which private attributes may be viewed or changed. A _class_ specifies the blueprint for creating object instances of a certain kind. Together, these constructs may create computational objects that simulate real objects. This `bankAccount` object in TypeScript, for example,

```ts
class BankAccount {
  private balance;

  constructor(funds) {
    this.balance = funds;
  }

  public withdraw(amount) {
    this.balance = this.balance - amount;
  }

  public checkBalance() {
    return this.balance;
  }
}

const bankAccount = new BankAccount(100);
bankAccount.withdraw(20);
bankAccount.checkBalance(); // 80
```

<figcaption>This example is based on the "withdraw" procedure introduced in SICP Section 3.1.</figcaption>

stores balance data in a private attribute and exposes privileged methods `checkBalance` and `withdraw`, which proscribe the manner in which access to `balance` can occur. Together, these constructs create a computational object  `bankAccount` that behaves like a “bank account”, carrying a balance that may be diminished through “withdraw” and viewed through “check balance” actions. Less abstract objects can be modeled with the same set of tools. An `apple` may have a `bite` method that reduces an internal `bites` state in order to model an “apple” and a `house` may have a `paint` method that changes an internal `color` state in order to model a “house.” More abstract objects can be modeled with the same set of tools as well. A `userMetaData` object may have a `setEmail` method that updates an internal `email` state in order to model “user meta data.”

### An Evolution of Imperative Programming

> And a key characteristic here is that objects have methods… They are operationally defined. And we use them to provide a layer of abstraction over the places that our program uses. — Rich Hickey, [The Value of Values](https://github.com/matthiasn/talk-transcripts/blob/master/Hickey_Rich/ValueOfValuesLong.md)

Private state enforces the object abstraction together with privileged, public methods. Expose `balance` directly (i.e. make it public), for example, and it can “magically” change from say `100` to `10` despite no `withdraw`al ever having occurred.

```ts
class BankAccount {
  public balance;
  ...
}

const bankAccount = new BankAccount(100);
bankAccount.balance = 80; // 80
```
<figcaption>Did a withdrawal occur? Does <code>bankAccount</code> accurately represent a "bank account"?</figcaption>

Expose `color` directly and it can magically change from say `WHITE` to `BLUE` despite no `paint`ing ever having occurred. In other words, object-oriented programming provides the means for identifying objects (`bankAccount`) and associated behaviors (`withdraw`)

```js
bankAccount.withdraw(20);
```

in place of imperative, direct manipulation of variables (`balance`) ad hoc.

```js
let balance = 100;
balance = balance - 20;
```

<figcaption>Did a withdrawal occur? Does <code>balance</code> represent a "bank account" or something else entirely?</figcaption>

Coincidentally, the private data / public methods dynamic also provides the means for data encapsulation. That data is stored in private attributes, accessible only through privileged methods, proscribes the ways in which such data may be viewed or changed. The `balance` data of `bankAccount` can only be changed by `withdraw` or read by `checkBalance`, in one sense, because it may not be accessed directly.

### Place-Oriented Programming

Nevertheless, object-oriented and imperative programming share a fundamental orientation towards places in memory.

> But mutable objects are actually abstractions of places. They do not actually have meaning other than that. They are little barricades we have set up in front of memory, so that we do not have to directly manipulate memory addresses any more. So we have this abstraction that is an object, that helps us manipulate that place without too much craziness…So I have a new label for this. It is called PLOP, and PLOP is place-oriented programming. — Rich Hickey, [The Value of Values](https://github.com/matthiasn/talk-transcripts/blob/master/Hickey_Rich/ValueOfValuesLong.md)

A method call to `withdraw` effectively overwrites a `balance` reference

```js
const bankAccount = new BankAccount(100); // (this.balance = 100)
bankAccount.withdraw(20); // (this.balance = this.balance - 20)
```

just as any direct assignment that circumvents a method.

```js
let balance = 100;
balance = balance - 20;
```

A mutable variable underlies the reassignment in both cases, whether or not an object method mediates such reassignment, and a place in memory underlies every mutable variable.[^4]

## Functional Programming

Procedures that produce the same result when provided the same argument can be viewed as computing mathematical functions. For example, a `decrement100` procedure in JavaScript,

```js
const decrement100 = function (x) {
  return 100 - x;
};

decrement100(20); // 80
```

or, more succinctly,

```js
const decrement100 = (x) => 100 - x;

decrement100(20); // 80
```

can be viewed as computing the mathematical function `f(x) = 100 — x`:

```text
f(20) = 80; where f(x) = 100 - x
```

since the return value of `decrement100` depends only on the input value just as `f(x)` depends only on `x`. Invoke `decrement100` a second time with `20` and it will return `80` once again, regardless of time and place within a program’s runtime. By contrast, an alternative implementation

```js
let oneHundred = 100;
const decrementOneHundred = (x) => oneHundred - x;

decrementOneHundred(20); // 80
oneHundred = 80;
decrementOneHundred(20); // 60
```

involving a mutable binding does not model computing a mathematical function, since its behavior may depend on variable information in addition to its input. Invoke `decrementOneHundred` a second time with `20` and it will _not_ return `80` once again when such binding is intermediately reassigned.

Functional procedures are not limited to numbers. Procedures that involve character strings, for example,

```js
const space = (w1, w2) => `${w1} ${w2}`;

space("hello", "world"); // => "hello world"
```

<figcaption><code>“hello world”</code> will result from <code>("hello", "world")</code> regardless of program context.</figcaption>

a list of strings,

```js
const space = (w1, w2) => `${w1} ${w2}`;
const sentence = (words) => `${words.reduce(space)}.`;

sentence(["i", "heart", "functions"]); // => "i heart functions."
```

<figcaption><code>"i heart functions"</code> will result from <code>["i", "heart", "functions"]</code> regardless of program context.</figcaption>

or other arbitrary data types and compositions may return the same value provided the same argument. Larger functional procedures can be composed of smaller ones,

```js
const square = (x) => x * x;
const sum = (x, y) => x + y;

const sumOfSquares = (x, y, z) => sum(sum(square(x), square(y)), square(z));

sumOfSquares(1, 2, 3); // 14
```

as can programs themselves.

```js
const square = (x) => x * x;
const sum = (x, y) => x + y;

// PSUEDO CODE
sum(sum(square(USER_INPUT_1), square(USER_INPUT_2)), square(USER_INPUT_3));

// REPL PSUEDO CODE
// > run functionalProgram.js with USER_INPUT_1=1, USER_INPUT_2=2, USER_INPUT_3=3,
// > 14
```

When the output of one functional procedure becomes the input of another, the wrapping program or procedure itself can be viewed as computing a mathematical function; a second run with the same input results in the same output.[^2]

## Semantics, Not Syntax

Syntactic constructs like `this`, `new`, `class`, `private` and `public` clearly express object-oriented intent — _this_ instance of a _class_ of things *private*ly maintains data through *public*ly available APIs — and are common to object-oriented programming languages. However, they are not necessary. Object-oriented semantics may be achieved with nontraditional syntax. For example, this `bankAccount` object also stores the `balance` data privately;

```js
const makeBankAccount = (balance) => ({
  withdraw: (amount) => (balance = balance - amount),
  checkBalance: () => balance,
});

const bankAccount = makeBankAccount(100);
bankAccount.withdraw(20);
bankAccount.checkBalance(); // 80
```

`balance` is accessible only through the functions `checkBalance` and `withdraw`, which proscribe the manner in which such access can occur. `bankAccount` behaves like a “bank account” even though the functions `checkBalance` and `withdraw` have gained privileged access to private data through the use of a function closure, instead of through explicit syntactic constructs. Object-oriented syntax is also insufficient in and of itself to achieve object-oriented semantics. A `bankAccount` “object” that avoids maintaining any underlying balance state

```ts
class BankAccount {
  public withdraw(balance, amount) {
    return balance - amount;
  }

  public checkBalance(balance) {
    return balance;
  }
}

const bankAccount = new BankAccount();
bankAccount.withdraw(100, 20); // 80
bankAccount.checkBalance(100); // 100; whoops, shouldn't this be 80?
```

<figcaption>Is <code>bankAccount</code> really a "bank account"?</figcaption>

allows “its” balance to evolve in an unspecified manner, undermining the “bank account” abstraction. `new`, `class` and `public` constructs obscure the actual semantics in this case. The same can be said of a `bankAccount` object that publicly exposes the balance attribute, as was alluded to above.

```ts
class BankAccount {
  public balance; // <-- now public

  constructor(funds) {
    this.balance = funds;
  }

  public withdraw(amount) {
    this.balance = this.balance - amount;
  }

  public checkBalance() {
    return this.balance;
  }
}

const bankAccount = new BankAccount(100);
bankAccount.balance = 80;
bankAccount.checkBalance(); // 80, eventhough no funds have been withdrawn
```

<figcaption>Is <code>bankAccount</code> really a "bank account"?</figcaption>

Now, `balance` can magically change without a `withdraw`al ever having occurred, which undermines the “bank account” abstraction. `new`, `class` and `public` constructs obscure the actual semantics in this case.[^5]

With functional programming, syntax is also beside the point. The use of functional syntactic constructs is necessary to perform computation against arguments. `function` and `=>` (the “arrow function”) constructs may express functional programming intent as well. However, they cannot alone achieve functional semantics. Indeed, a method of an object may use the `=>` construct without correctly modeling computing mathematical functions.

```js
const makeBankAccount = (balance) => ({
  withdraw: (amount) => (balance = balance - amount),
  checkBalance: () => balance,
});
```

Subsequent calls to `checkBalance` return different results despite identical inputs (i.e. `undefined`) by design.

```js
const bankAccount = makeBankAccount(100);

bankAccount.checkBalance(); // 100
bankAccount.withdraw(20);
bankAccount.checkBalance(); // 80
```

Additionally, an alternative implementation of “decrement one hundred” in JavaScript may fall short of correctly modeling a mathematical function even though an `=>` construct is used, as was alluded to above.

```js
let oneHundred = 100;
const decrementOneHundred = (x) => oneHundred - x;

decrementOneHundred(20); // 80
oneHundred = 80;
decrementOneHundred(20); // 60
```

Invoking this procedure a second time with the same argument produces a different result when the `let` binding is amended between invocations.

## Changeability is Fundamental to Object Semantics

Since objects can change - an apple can be bitten, a house painted, and a bank account withdrawn from - effective object representations must follow suit.

> [W]e make computational objects…whose behavior changes with time. We model state with local state variables, and we model the changes of state with assignments to those variables. — [SICP](https://web.mit.edu/alexmv/6.037/sicp.pdf) Section 3.1.2

`bite`ing an `apple` changes `bites` state, `paint`ing a `house` changes `color` state and `withdraw`ing from a `bankAccount` changes `balance` state. The class implementation of a bank account object

```ts
class BankAccount {
  private balance;

  constructor(funds) {
    this.balance = funds;
  }

  public withdraw(amount) {
    this.balance = this.balance - amount; // <-- assign `this.balance` a new value
  }

  public checkBalance() {
    return this.balance;
  }
}

const bankAccount = new BankAccount(100);
bankAccount.withdraw(20);
bankAccount.checkBalance(); // 80
```

<figcaption>The bank account’s balance is overwritten by the withdraw method.</figcaption>

involves overwriting `balance` as much as the closure implementation does.

```js
const makeBankAccount = (balance) => ({
  withdraw: (amount) => (balance = balance - amount), // <-- assign `balance` a new value
  checkBalance: () => balance,
});

const bankAccount = makeBankAccount(100);
bankAccount.withdraw(20);
bankAccount.checkBalance(); // 80
```

<figcaption>The bank account’s balance is overwritten by the withdraw method.</figcaption>

As mentioned above, a state*less* “object” (e.g. `bankAccount`) that avoids maintaining any underlying state (e.g. `balance`)

```ts
class BankAccount {
  public withdraw(balance, amount) {
    return balance - amount;
  }

  public checkBalance(balance) {
    return balance;
  }
}

const bankAccount = new BankAccount();
bankAccount.withdraw(100, 20); // 80
bankAccount.checkBalance(100); // 100; whoops, shouldn't this be 80?
```

<figcaption>Is <code>bankAccount</code> really a "bank account"?</figcaption>

also avoids modeling any underlying object (e.g. “bank account”).

## Unchangeability is Fundamental to Functional Semantics

On the other hand, changeable things undermine functional semantics. The `decrement100` procedure can be viewed as computing a mathematical function because its output depends only on its input; there is no other _variable_ information on which it depends. By contrast, as the value of the mutable `let` binding underlying `decrementOneHundred` _changes_, so does the behavior of `decrementOneHundred` as a side-effect. Consequently, `decrementOneHundred` depends on the ongoing value of some contextual thing in addition to its input `x` and cannot resemble computing a mathematical function.

Conversely, unchangeability restores functional semantics. No contextual changes means no side-effects, and no side-effects means functional behavior:

> So long as we do not use assignments, two evaluations of the same procedure with the same arguments will produce the same result, so that procedures can be viewed as computing mathematical functions. Programming without any use of assignment…is accordingly known as _functional programming_. — [SICP](https://web.mit.edu/alexmv/6.037/sicp.pdf) Section 3.1.3

Even an externally scoped variable cannot change the semantics of `decrementOneHundred` when unchangeable.

```js
const oneHundred = 100; // <-- now a `const` instead of a `let`
const decrementOneHundred = (x) => oneHundred - x;

decrementOneHundred(20); // 80
// oneHundred = 80; <-- would be runtime error: "TypeError: Assignment to constant variable."
decrementOneHundred(20); // 80
```

Since JavaScript's `const` binding endows `oneHundred` with immutability, it simply cannot change (without throwing a runtime error). And without change, the output of `decrementOneHundred` can depend only on the single thing that can: its input.[^6]

## “Object” Names Changeability

Moreover, changeability _implies_ an object. The rational number “2/3” cannot change, for example. Change the denominator of “2/3” from 3 to 5 and its identity changes as well to “2/5”. Neither can the integer "24." Increase the number of units represented by “24” and it may change to “25.”

```js
const HOURS_IN_DAY = 24;

/**
 * NOT VALID; imagined API for mutating numbers
 */
24.increment();

HOURS_IN_DAY === 25; // true
```

<figcaption>JavaScript implements number literals as immutable primitive values, preventing this unexpected behavior.
</figcaption>

The rational number “2/3” and the integer “24” are unchangeable things, and are not recognizable as objects. Similarly, change the molecular construction of “iron” and it may very well change to “gold,” or the wave length of “green” and it may change to “red”. Conversely, find changeability and find an object. A cup that is two-thirds full of water can be poured, an iron rod can be dented and a green house can be painted. “That cup” remains that cup notwithstanding less water; “that rod” remains that rod notwithstanding a dent; “that house” remains that house notwithstanding a fresh coat of paint. A “cup”, “rod” and “house” are changeable things that _are_ recognizable as objects. Coincidence of “changeability” and “object” is not happenstance. That parts can change without changing the identity of the whole _distinguishes_ an identity distinct from underlying parts. Changeability distinguishes an object. “Object” in a sense articulates this ability to change.

Said another way, a new notion of “sameness” emerges with changeability. Unchangeable things can be identified as “the same” simply by examining contents. For example, because _immutable_ rational number implementations, `r1` and `r2`,

```ts
type RationalNumber = readonly [
  number /* numerator */,
  number /* denominator */
];

// turn into decimal form before comparing in order to reduce fraction
const isEqual = (a: RationalNumber, b: RationalNumber) =>
  a[0] / a[1] === b[0] / b[1];

const r1: RationalNumber = [2, 3];
const r2: RationalNumber = [2, 3];
const r3: RationalNumber = [2, 5];

isEqual(r1, r2); // => true
isEqual(r1, r3); // => false
```

<figcaption>TypeScript’s <code>readonly</code> qualifier prevents mutative actions (e.g. <code>p2[1] = 3</code>) at compile time.
</figcaption>

will _always_ be comprised of `2` in the first slot and `3` in the second and reduce to two-thirds, a reasonable conclusion is that they are the same. To be sure, substitute one for the other and the meaning of a program is unchanged.[^7] By contrast, consider when two *mutable* rational number implementations may be deemed the “same.”

```ts
type RationalNumber = [number /* numerator */, number /* denominator */];

// turn into decimal form before comparing in order to reduce fraction
const isEqual = (a: RationalNumber, b: RationalNumber) =>
  a[0] / a[1] === b[0] / b[1];

const r1: RationalNumber = [2, 3];
const r2: RationalNumber = [2, 3];
const r3: RationalNumber = [2, 5];

r2[1] = 5;

isEqual(r1, r2); // => false
isEqual(r2, r3); // => true
```

<figcaption>
Absent the <code>readonly</code> qualifier, <code>RationalNumber</code>'s are mutable at compile time. And at runtime, JavaScript’s <code>const</code> binding only prevents reassignment of such binding; it does not prevent mutations of an underlying array.
</figcaption>

`r1` may have the same contents as `r2` to start, but this affect is shortly lived. Substitute one for the other and the meaning of the program is changed — references to r2 now incorrectly reduce to two-fifths instead of two-thirds. `r1` and `r2` are not exactly “the same” in this case. Since two changeable things may evolve independently notwithstanding an analysis of parts performed at any one point in time, a new notion of “sameness” above an examination of parts must be admitted. Remarkably, this “new” notion is less remarkable with intentional object-oriented programming, where the creation of a new identity — i.e. an _object_ — is precisely the goal. `georgesAccount` and `elainesAccount`, for example,

```ts
/**
 * Reference equality check
 */
const areAccountsEqual = (a: BankAccount, b: BankAccount) => a === b;

const elainesAccount = new BankAccount(100);
const georgesAccount = new BankAccount(100);

elainesAccount.checkBalance(); // 100
georgesAccount.checkBalance(); // 100

areAccountsEqual(elainesAccount, elainesAccount); // true
areAccountsEqual(elainesAccount, georgesAccount); // false (eventhough identical funds)

georgesAccount.withdraw(75);

elainesAccount.checkBalance(); // 100
georgesAccount.checkBalance(); // 25

areAccountsEqual(elainesAccount, elainesAccount); // true
areAccountsEqual(elainesAccount, georgesAccount); // false
```

<figcaption>We may determine equality b/w 2 objects by whether they are the same object — i.e. reference equality.
</figcaption>

may share a balance at some point in time. But even if they start with the same funds, `georgesAccount` and `elainesAccount` can register different balances at some other point in time because they are in fact different _objects_. Of course, that two distinct objects can evolve independently goes without saying. That is because “object” clearly articulates the creation of an identity that is not tied to any part, arrangement or quality; “object” names the ability to change.[^8]

## Now, What About Programs

In this light, object-oriented programming can be seen as the diametric opposite of functional programming. Objects are inherently changeable. Moreover, changeability and “object” are intertwined as concepts. Yet, changeability undermines functional programming. Just as oil cannot inhabit the same physical space as water, object-oriented programming cannot occupy the same virtual space as functional programming. Just as "up" means "not down" in one sense, and vice versa, "object" means "not function" in one sense, and vice versa. In other words, use of one necessarily excludes the other. As a result, when writing programs, we may choose mutability or immutability, objects or functions, but not both at once.

Yet, whatever paradigm we choose must include a model for state, and perhaps time. As we saw above, programs that are composed of functions themselves model well-behaved state*less* mathematical functions,

```js
const square = (x) => x * x;
const sum = (x, y) => x + y;

// PSUEDO CODE
sum(sum(square(USER_INPUT_1), square(USER_INPUT_2)), square(USER_INPUT_3));

// REPL PSUEDO CODE
// > run functionalProgram.js with USER_INPUT_1=1, USER_INPUT_2=2, USER_INPUT_3=3,
// > 14
```

<figcaption>The output of this program depends only on its input.
</figcaption>

since they produce the same output provided the same input. Some real programs are also designed to produce output based on input. Ideally, compilers output the same binaries provided the same input files, for example. More frequently, however, programs require state, and the current state of the program, _together_ with any user input, will determine the next state or output of the program. Such is the case with our example ATM example, where the current balance is crucial to calculating any subsequent balance post withdrawal. ATM machines are stateful programs.

## Stateful Object-Oriented Programs

> Modeling with objects is powerful and intuitive, largely because this matches the perception of interacting with a world of which we are part. — [SICP](https://web.mit.edu/alexmv/6.037/sicp.pdf) Section 3.5.5

Object-oriented programming provides intuitive building-blocks for creating stateful programs. An ATM program, for example, that allows the user to set a “withdrawal amount” and effect a withdraw,

<script async src="//jsfiddle.net/jmilgrom/notc93Lv/embed/"></script>

breaks down naturally into `withdrawalAmount` and and `bankAccount` objects, representing the chosen amount to be withdrawn and the user account underlying the session. respectively. The withdrawal amounts are incorporated by and read from `withdrawalAmount`. Withdrawals are incorporated by, and balance confirmations are read from, `bankAccount`. The current balance and the amount to potentially withdraw — the state of the program — are reflected directly by the state of `bankAccount` and `withdrawalAmount` — the state of its composite objects.

### Time

> If we wish to write programs that model this kind of natural decomposition in our world (as we see it from our viewpoint as a part of that world) with structures in our computer, we make computational objects that… must change with time. — [SICP](https://web.mit.edu/alexmv/6.037/sicp.pdf) Section 3.5.5

Objects are intuitive in large part because they are consistent with a familiar model for time. Objects change — as we discussed, the notion of an “object,” having parts that change without changing the identity of the whole, articulates this ability. The flip-side to change is time. Since objects change, _when_ an object is examined is vital to the examination, it goes without saying.

Look no further than the object representations of our computer programs.  The “having parts that can change without changing the identity of the whole” quality of `bankAccount` in our ATM program, for example, is implemented by `withdraw`.

```ts
class BankAccount {
  ...
  public withdraw(amount) {
    this.balance = this.balance - amount;
  }
  ...
}
```

Underlying `withdraw` lies a mutable `balance` binding that may be assigned new values. Calls to `withdraw` change the associated balance of `bankAccount` as a side-effect, without altering the identity of `bankAccount`, by design.

```ts
const bankAccount = new BankAccount(100);

bankAccount.checkBalance(); // 100
bankAccount.withdraw(20);
bankAccount.checkBalance(); // 80
```

The flip-side to change is time. In addition to changing the associated balance, any call to `withdraw` also “delineates moments in time” _when_ `balance` _may_ change. Whether `bankAccount.checkBalance()` resolves to `100` or `80` “depends not only on the expression itself, but also on whether the evaluation occurs before or after these moments.” As a result, by modeling objects, “we are forced to admit time into our computational models.” ([SICP](https://web.mit.edu/alexmv/6.037/sicp.pdf) Section 3.4)

### Stateful

Object-oriented programming reifies objects — objects can be composed in other objects, received and returned by object methods, and generally manipulated like numbers, strings and other [citizens](https://en.wikipedia.org/wiki/First-class_citizen) of the program. On the other hand, object-oriented programming presents no direct representation of state. Since object methods proscribe the ways in which state may be viewed or changed, state may not be accessed directly. Rather, state is a _quality_ of objects — i.e. “stateful” or “statefulness” — that may be available at runtime to the extent proscribed by object definitions. `bankAccount` and `withdrawalAmount`, for example, may together incorporate the state of the ATM program — the statefulness of the program is reflect by the statefulness of its composite objects. However, access to such state is hidden by methods `checkBalance` and `get`. The state of program may only be “expressed” by _calling_ both getters at runtime, like any other attribute, characteristic or object quality.

That objects indeed lack any express notion of state is highlighted by object signatures with more than one getter, where any such notion may only exist through definition, signature by signature:

> How can you perceive a mutable object that has more than one getter? … How do you it? … Who could say right now how to do this? No one can, right? You cannot do this, because you need this other thing. You need the recipe for doing this, and the recipe is something that everybody has to make up over and over and over again. … We cannot actually perceive the whole. Cannot do it without help. Without these recipes. — Rich Hickey, [The Value of Values](https://github.com/matthiasn/talk-transcripts/blob/master/Hickey_Rich/ValueOfValuesLong.md)

An object with a single read method (like `bankAccount`) in a sense defines _the_ method for accessing the whole of an object’s state. However, each additional read method dilutes this claim, underscoring the need for a method specific to the task (e.g. `toJSON`, `serialize`, `inspect`, etc.). In stark contrast to numbers, string and objects themselves, state may be expressed only through programmer-defined constructs evaluated at runtime.

## Stateful Functional Programs

> Is there another approach? Can we avoid identifying time in the computer with time in the modeled world? Must we make the model change with time in order to model phenomena in a changing world? — [SICP](https://web.mit.edu/alexmv/6.037/sicp.pdf) Section 3.5

Building stateful functional programs is less intuitive. To start, notice that imperative iteration can be restructured into functional iteration by recursively calling an iterative function with the results of the previous call. An imperative implementation of factorial, for example,

```js
const factorial = (n) => {
  let total = 1;
  while (n > 0) {
    total = total * n;
    n = n - 1;
  }
  return total;
};

factorial(0); // => 1
factorial(1); // => 1
factorial(2); // => 2
factorial(3); // => 6
```

maintains iteration and running total state through assignments to `n` and `total`, respectively, with every iteration. An alternative implementation avoids mutation by returning the iteration and running total state from an iteration function,

```js
const factorial = (n) => {
  const iterate = (total, i) => {
    if (i === 0) return total;
    return iterate(total * i, i - 1);
  };
  return iterate(1, n);
};

factorial(0); // => 1
factorial(1); // => 1
factorial(2); // => 2
factorial(3); // => 6
```

which may be used by the same function to calculate the next values in the next iteration.

Stateful functional programs can be constructed in a similar fashion — state that is returned from the previous turn of some larger, iterative “program” function becomes the starter state for the next — with one caveat. With _synchronous_ iteration, results of the previous run can simply be passed to the next. The `total` result from `factorial` iteration, for example, is passed directly to the next. In a JavaScript web application, however, events are initiated _asynchronously_ as the user interacts with the page, calling callbacks bound to such events, which run pieces of the program so encoded.

```text
event → callback → javascript
event → callback → javascript
...
```

Communication between _asynchronous_ scripts is performed through shared references. One script updates (mutates!) a place in memory from which another script may later read. Look no further than the object-oriented ATM program above for a concrete example. A user may begin the program by first selecting a withdrawal amount, _then_ clicking withdraw:

```text
select → onchange → "withdrawalAmount.set(value)"
click → onclick → "bankAccount.withdraw(withdrawalAmount.get())"
...
```

The “click withdraw” script occurs asynchronously sometime after the “select withdrawal amount” script has completed. Communication between the two scripts occurs through shared reference to the `amount` variable underlying the `withdrawalAmount` object. Calls to `withdrawalAmount.get()` will return updates by `withdrawalAmount.set(value)`, notwithstanding the asynchrony of such reads and writes.

Synchronous functions can communicate by simply passing around results. The result from one function becomes the input of another. Asynchronous scripts, by contrast, share a mutable place in memory instead of the values themselves. Consequently, we must also share a mutable place in memory to communicate between asynchronous scripts in the functional program implementation. On the other hand, with a light amount of infrastructure, we can usher such imperative code to the application perimeter and carve out space for a functional core, creating a “[functional core, imperative shell](https://www.destroyallsoftware.com/screencasts/catalog/functional-core-imperative-shell).”

<script async src="//jsfiddle.net/jmilgrom/mv2187zo/embed/js,html,result/"></script>

The program now consists of functions `parseInt` and `withdraw`, called against specific events `WITHDRAWAL_AMOUNT` and `WITHDRAW`. The state of the program has not been reflected directly into distinct objects. Instead, a `program` _function_ is called with the state resulting from the previous call, together with event data from any user interaction, in order to produce the starter state for the next. `program` resembles an iterative, recursive function. Yet, calls to `program` occur asynchronously. Just as with the object-oriented ATM program, a user may begin the functional ATM program by first selecting a withdrawal amount, _then_ clicking withdraw:

```text
select → onchange → "store.publish('WITHDRAWAL_AMOUNT', {amount:value})"
click → onclick → "store.publish('WITHDRAW')"
...
```

The imperative shell (i.e the `store`) maintains a reference to the `state` resulting from the previous call to `program`, in order to pass such `state` to the next, orchestrating communication between asynchronous calls to `program`.

### Time as a Series of States

Unlike object-oriented programming, functional programming provides no model for traditional time. Mathematical functions are time*less*. Computation of a function `f(x)` a “second time” with the same argument will produce the same result _whenever_ computed; a mathematical statement like `f(20) = 80` will not be made any less true by insinuating time. Similarly, time is no matter against procedures that model mathematical function computation. Simple functions,

```js
const decrement100 = (x) => 100 - x;

decrement100(20); // 80
```

compositions of functions,

```js
const square = (x) => x * x;
const sum = (x, y) => x + y;

const sumOfSquares = (x, y, z) => sum(sum(square(x), square(y)), square(z));

sumOfSquares(1, 2, 3); // 14
```

as well as “program” functions like the ATM program introduced above,

```js
const withdraw = (balance, amount) => balance - amount;

const ATM = (state = { balance: 100, amount: 10 }, event) => {
  switch (event.type) {
    case "WITHDRAW":
      return {
        ...state,
        balance: withdraw(state.balance, state.amount),
      };
    case "WITHDRAWAL_AMOUNT":
      return {
        ...state,
        amount: parseInt(event.amount),
      };
    default:
      return state;
  }
};
```

will produce the same output provided the same input _whenever_ evaluated, independent of time.

Where we once saw object state change as time _elapsed_, we now see the program jump from one state to the next at individual (i.e. discrete!) *moments in time*, as if producing entries in a list, log, “stream of information,” or other time-denominated series. Iterative, recursive functions model this same behavior. The functional `factorial` implementation shown above, for example, produces a value, say `F`, for each step, say `i`:

```text
F₀: 1
F₁: 1
F₂: 2
...
factorial(i): iterate(Fᵢ₋₁ * i, i - 1)
```

Each run of `iterate` against the result of the previous run produces a new value just _after_ _the_ _last_ — a discrete piece of information that can viewed together with the rest on the same list. Individual program events can be similarly listed,

```text
E₀: DEFAULT_EVENT
E₁: WITHDRAWAL_AMOUNT, amount:20
E₂: WITHDRAWAL
...
E(i): Eᵢ
```

as can individual program states:

```text
S₀: balance:100, amount:10
S₁: balance:100, amount:20
S₂: balance:80, amount:20
...
S(i): program(Sᵢ₋₁, Eᵢ)
```

Each run of `program` against the result of the previous run, together with event data, produces a new value _after_ the last. Yet, `program` is a timeless function.

With the object-oriented approach, we decompose the state of the program into objects _within_ the program. Each object houses mutable state, and each piece of state may underly a mutative expression that “delineates moments in time” when evaluated.

> We modeled real-world objects with local state by computational objects with local variables. We identified time variation in the real world with time variation in the computer. We implemented the time variation of the states of the model objects in the computer with assignments to the local variables of the model objects. — [SICP](https://web.mit.edu/alexmv/6.037/sicp.pdf) Section 3.5

A collection of objects, each delineating moments in time when state may change _within_ the program, embeds a simulation of time within the program. By contrast, with the functional approach, state is kept at the application perimeter and _functions_ are composed together in order to transition the program from one state to another. No simulation of time can be found _within_ the program; no moments can be found within the program _when_ state _may_ change. Rather, the program _provides_ change from one state to the next (i.e. it produces state). As a result, program states represent _discrete_ moments in time when state _has_ changed.

> Think about the issue in terms of mathematical functions. We can describe the time-varying behavior of a quantity x as a function of time x(t). If we concentrate on x instant by instant, we think of it as a changing quantity. Yet if we concentrate on the entire time history of values, we do not emphasize change — the function itself does not change — [SICP](https://web.mit.edu/alexmv/6.037/sicp.pdf) Section 3.5

Said another way, in object-oriented programs, we hold the identity of objects constant through change. Objects endure change as time elapses, and thus we model time. In functional programs, we forgo object identity. Change creates something new instead of altering something of old, and thus we model change directly. Change is described succinctly by functions as well as by an “entire time history,” list, log, stream, or other series of resulting states.

### Reified State

Unlike object-oriented programs, functional programs reify state. State can be passed to functions, returned by functions, and generally manipulated like numbers, strings, lists, and other [citizens](https://en.wikipedia.org/wiki/First-class_citizen) of the program. With a small addition to the ATM program, for example,

<script async src="//jsfiddle.net/jmilgrom/jfmea63q/embed/js,html,result/"></script>

we can print (to the console) a representation of the each state of the program in sequence. This change is trivial precisely because state is a known quantity of the program and generally manipulable by program code. `inspectReturn` takes direct advantage of this quality, printing state to the console and returning state from the internal curried function.

## Resolving the Time Paradox

> “No man can ever cross the same river twice.” Because what’s a river? I mean, we love this idea of objects; like there’s this thing that changes. Right? There’s no river. Right? There’s water there at one point-in-time. And another point-in-time, there’s other water there. — Rich Hickey, [Are We There Yet](https://github.com/matthiasn/talk-transcripts/blob/master/Hickey_Rich/AreWeThereYet.md), quoting Heraclitus.

From the perspective of a user, a functional program may appear stateful. Interact with the functional ATM program above and notice the program remembering previous encounters. On the one hand, this is not surprising. We included an imperative layer to remember previous states. Instead of decomposing the state of the program into distinct objects, like `bankAccount` and `withdrawalAmount`, we created a single global object, the `store`. On the other hand, focusing on the “object” portion of the program betrays an object-oriented predisposition. The imperative piece of the program is merely syntax, a construct used to facilitate a computation based asynchronously on another; it is not semantics. One can even imagine a programming language where such a construct is built into the language itself, hiding any imperative implementation from the programmer’s view. In fact, such a language exists that compiles to JavaScript.[^9] The semantics of the program better align with the semantics of a recursive, iterative function, having state `S` at a discrete step `i` — run the functional ATM program with the output of the previous run to produce the input for the next.

That a program with a functional, stateless and timeless core can maintain state is surprising, to say the least. Look around the room, bus, park or wherever you find yourself reading this sentence, and you will likely identify “a collection of distinct objects,” such as dogs, people, and trees, “whose behaviors may change over time.” Look around the functional ATM program, on the other hand, and there are no identifiable objects to be found. Yet, the program appears to have state just like any other object in the room.

> One way to resolve this paradox is to realize that it is the user’s temporal existence that imposes state on the system. If the user could step back from the interaction and think in terms of streams of balances rather than individual transactions, the system would appear stateless — [SICP](https://web.mit.edu/alexmv/6.037/sicp.pdf) Section 3.5.5

However, the ostensible “paradox” dissipates when the augmentation of our conception of time extends beyond the functional program to include the rest of our physical reality. Instead of viewing the world as the sum of its objects, each reflecting its latest state as time elapses, we may also think in terms of discrete state histories. We may interpret the dog at the park as moving in discrete steps `S(i)` to `S(i+1)`, just as we interpret the state of our functional program as moving in discrete steps `S(i)` to `S(i+1)`.

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

In both cases, pieces of static information may be listed, one _after_ another. Moreover, both lists can be plotted along the same discrete timeline `i`. User interactions come in a certain order `U(i)`, triggering a run of the program function against the result of the previous run `S(i-1)` and event data `E(i)`, in order to produce `S(i)`. Our reality can be viewed as a time-series of states, just as it can be viewed as a collection of objects. Functional programming models a time-series of states, just as as object-oriented programming models objects. When the program and world *alike* can be viewed as “streams of information that flow in the system,” (Section 3) the world can flow into the program, and the program back into the world.

## Addendum: Functional Programming as a Scientific Revolution

> We were all object-oriented programmers at one point in time — Rich Hickey, [The Value of Values](https://github.com/matthiasn/talk-transcripts/blob/master/Hickey_Rich/ValueOfValuesLong.md)

Assimilation of functional semantics with any regular conception of the physical world is no easy task. Look again around the room, bus or park and you will likely still identify distinct objects that may change over time. I kicked around chapter 3 of [SICP](https://web.mit.edu/alexmv/6.037/sicp.pdf) for over a year before wrapping my head around it. That we may still be experiencing disbelief at the thought of a new model for time suggests a larger game at play.

Dominant scientific paradigms pervade our language, on the one hand, and way of thinking, on the other.

> Scientific practice always involves the production and the explanation of generalizations about nature; those activities presuppose a language with some minimal richness; and the acquisition of such a language brings knowledge of nature with it. When the exhibit of examples is part of the process of learning terms like “motion,” ‘‘cell,‘‘ or ‘‘energy element,’’ what is acquired is knowledge of language and of the world together. **On the one hand**, the student learns what these terms mean, what features are relevant to attaching them to nature, what things cannot be said of them on pain of self-contradiction, and so on. **On the other hand**, the student learns what categories of things populate the world, what their salient features are, and something about the behavior that is and is not permitted to them. In much of language learning these two sorts of knowledge — **knowledge of words and knowledge of nature** — are acquired together, not really two sorts of knowledge at all, but two faces of the single coinage that a language provides. — Thomas Kuhn, [What are Scientific Revolutions?](http://sites.fas.harvard.edu/~hsci161/Sci._Rev._Reader/12_S6_Kuhn.pdf)

As a result, a new discovery “that cannot be accommodated within the concepts in use before” may illicit surprise or even disbelief. “One cannot get from the old to the new simply by an addition to what was already known. Nor can one quite describe the new in the vocabulary of the old or vice versa.” ([Thomas Kuhn](http://sites.fas.harvard.edu/~hsci161/Sci._Rev._Reader/12_S6_Kuhn.pdf)) Rather, in order to “make or to assimilate such a discovery one must alter the way one thinks about and describes some range of natural phenomena”; even the articulation of an observation that runs counter to the dominant paradigm can only be “formulated by altering the language with which nature [is] described.” ([Thomas Kuhn](http://sites.fas.harvard.edu/~hsci161/Sci._Rev._Reader/12_S6_Kuhn.pdf))

> Consider the compound sentence, “In the Ptolemaic system planets revolve about the earth; in the Copernican they revolve about the sun.” Strictly construed, that sentence is incoherent. The first occurrence of the term “planet” is Ptolemaic, the second Copernican, and the two attach to nature differently. For no univocal reading of the term “planet” is the compound sentence true. — Thomas Kuhn, [What are Scientific Revolutions?](http://sites.fas.harvard.edu/~hsci161/Sci._Rev._Reader/12_S6_Kuhn.pdf)

Similarly, object-orientation pervades our language, on the one hand. That “objects change as time elapses” is a statement of obvious fact betrays the object-oriented presumption embedded in our language. “Object” (and “identity”), “change” (and “state”), and “time” work together to describe a coherent _object-oriented_ view. On the other hand, objects orient our perception of our own physical reality.

> Modeling with objects is powerful and intuitive, largely because this matches the perception of interacting with a world of which we are part. — [SICP](https://web.mit.edu/alexmv/6.037/sicp.pdf) Section 3.5.5

Look again around the room, bus, park or wherever you find yourself reading this sentence, and you will likely identify “a collection of distinct objects,” such as dogs, people, and trees, “whose behaviors may change over time.”

Yet, the behavior of a functional program cannot be described in terms that attribute change to the enduring identity of objects as time elapses. And because of the dominance of object-orientation as reflected in the presumptions of our natural language, we cannot so much as describe the semantics of a functional program except through altering our language and reconstituting our physical reality. Meaningful “identity” must disappear in favor of change itself. “State” must describe the result of change instead of an object quality. “Time” must describe discrete state changes rather than any continuous dynamicness attributable to all objects.

No wonder the functional model may still illicit disbelief. This essay can be seen as an uphill climb against the gravity of a dominant paradigm; the functional view is perhaps expressible now, but only because of the arduous work put in above. Our natural language is not so easily distorted, violated and repurposed and our thought patterns are comorbid with our language.

> Until those changes had occurred, language itself resisted the invention and introduction of the sought after new theories. The same resistance by language is, I take it, the reason for Planck’s switch from ‘‘element’’ and ‘‘resonator’’ to ‘‘quantum’’ and ‘‘oscillator.’’ Violation or distortion of a previously unproblematic scientific language is the touchstone for revolutionary change. — Thomas Kuhn, [What are Scientific Revolutions?](http://sites.fas.harvard.edu/~hsci161/Sci._Rev._Reader/12_S6_Kuhn.pdf)

As a result, teaching functional programming is like teaching a Ptolemaic astronomer about Copernican astronomy or a Newtonian physicist about quantum mechanics. We lack the basic language to articulate the underlying concepts. Worse still, the language we do have is endemic to a conflicting paradigm. Perhaps the disparity between the efficacy[^10] and popularity[^11] of functional programming languages is best explained in this light.

> A new scientific truth does not triumph by convincing its opponents and making them see the light, but rather because its opponents eventually die, and a new generation grows up that is familiar with it — Max Plank, [autobiography](https://pubs.acs.org/doi/pdf/10.1021/ed027p288.1), quoted by Thomas Kuhn, [The Structure of Scientific Revolutions](https://en.wikipedia.org/wiki/The_Structure_of_Scientific_Revolutions)

Nevertheless, the functional view is indeed expressible as a result of the work put in above. We can see change as creating something new, instead of altering something of old, and time as a series of successive states. We can alter our language and reimagine our physical reality to support a functional view of change, state and time.

[^2]: Immutability is an important part of the equation as well. We’ll cover this soon in the section titled [Unchangeability is Fundamental to Functional Programming](#unchangeability-is-fundamental-to-functional-semantics).
[^3]: Traditionally, [object-oriented programming](https://en.wikipedia.org/wiki/Object-oriented_programming) is also associated with data abstraction and code reuse through inheritance, among other patterns, that reinforce the object model.
[^4]: The creator of Clojure at it again:

    > But as soon as we introduce… the idea that the value of a variable can change, a variable can no longer be simply a name. Now a variable somehow refers to a place where a value can be stored, and the value stored at this place can change.” — Rich Hickey, [The Value of Values](https://github.com/matthiasn/talk-transcripts/blob/master/Hickey_Rich/ValueOfValuesLong.md)

[^5]: Never has the delineation between syntax and semantics been more pronounced than with [value objects](https://martinfowler.com/bliki/ValueObject.html), which commandeer object-oriented syntax to effect _non_-object semantics — i.e. immutable values. If not for the divergence between syntax and semantics, so-called “value objects” would be a contradiction in terms. We’ll cover the inherent mutability of objects soon in the sections titled [Changeability is Fundamental to Object Semantics](#changeability-is-fundamental-to-object-semantics) and [“Object” Names Changeability](#“object”-names-changeability).
[^6]: Contextual immutability says nothing of local variables. In fact, a variable that is reassigned within the same procedure in which it was initialized cannot impact the semantics of such procedure.

    > …any mutation that is ever done to any of these is to rebind local variables…that doesn’t affect the fact that these objects are immutable from an outside perspective” Gary Bernhardt, [Functional Core, Imperative Shell](https://www.destroyallsoftware.com/screencasts/catalog/functional-core-imperative-shell)

    `decrement100` may be implemented with internal mutability, for example,

      ```js
      const decrement100 = (x) => {
        let r = 100;
        r = 100 - x;
        return r;
      };
    
      decrement100(20); // => 80
      ```

    without affecting external semantics; the output of `decrement100` still depends only on the input. Even block-scoped looping constructs like `while`, `for` and `do` may be part of procedures that produce the same output provided the same input, notwithstanding reassignment of variables tracking iteration state (e.g. `i`, `j`, `k`, `n`, etc.) with every loop.

      ```js
      const factorial = (n) => {
        let total = 1;
        while (n > 0) {
          total = total * n;
          n = n - 1;
        }
        return total;
      };
    
      factorial(0); // => 1
      factorial(1); // => 1
      factorial(2); // => 2
      factorial(3); // => 6
      ```

    <figcaption>The mutability of <code>f</code> and <code>n</code> does not impact the functional semantics of <code>factorial</code></figcaption>

    `factorial` will produce the same output provided the same input. On the other hand, changeability that is internal to one procedure definition may be positioned externally to another when [lexical procedural nesting is supported](https://en.wikipedia.org/wiki/Nested_function). `balance`, for example,

      ```js
      const makeBankAccount = (balance) => ({
        withdraw: (amount) => (balance = balance - amount),
        checkBalance: () => balance,
      });
    
      const bankAccount = makeBankAccount(100);
      bankAccount.withdraw(20);
      bankAccount.checkBalance(); // 80
      ```

    is external to `withdraw` although internal to `makeBankAccount` and undermines the functional semantics of `withdraw` as a result, as discussed above. [Notoriously unintuitive effects](https://stackoverflow.com/questions/750486/javascript-closure-inside-loops-simple-practical-example/750506) manifest when looping is combined with procedural nesting.

      ```js
      const buildCallbacks = (items) => {
        const callbacks = [];
        let i;
        for (i = 0; i < items.length; i++) {
          callbacks.push(() => items[i]);
        }
        return callbacks;
      };
    
      const callbacks = buildCallbacks(["hello", "cruel", "world"]);
    
      callbacks.length; // => 3
      callbacks[0](); // => undefined
      callbacks[1](); // => undefined
      callbacks[2](); // => undefined
      ```

    <figcaption>Initializing <code>let</code> above the block scopes the variable above the for-loop. Each iteration points at the same reference in memory as a result. By the time the callbacks are called, i has been updated to <code>3</code> and is outside the <code>callback</code>'s upper bound.</figcaption>

    As a result, comprehensive immutability can be seen as defending functional programming in the face of procedural nesting. It also appears that functional semantics could theoretically coincide with traditional looping constructs and other locally-scoped mutation so long as procedural nesting was prohibited. Nevertheless, immutability is generally considered an inseparable part of functional programming; no distinction is made in SICP and elsewhere (that I have encountered). Perhaps there is something else to be said here about lambda calculus and a more formal definition of functional programming. Or, perhaps the many benefits of nested procedures (e.g. modules, closures, etc.) so obviously outweigh the superficial “costs” of forgoing looping to even consider such crazy talk. Recursive procedures can do anything looping constructs can and without performance regressions because of tail recursion and other optimization techniques at the compiler level.

[^7]: That two equivalent expressions may be substituted for one another without altering the meaning of the program is known as [referential transparency](https://en.wikipedia.org/wiki/Referential_transparency).

    > A language that supports the concept that “equals can be substituted for equals” in an expression without changing the value of the expression is said to be referentially transparent — SICP Section 3.1.3

[^8]: ❤️ The original insight️ ❤️

    > In general, so long as we never modify data objects, we can regard a compound data object to be precisely the totality of its pieces. For example, a rational number is determined by giving its numerator and its denominator. But this view is no longer valid in the presence of change, where a compound data object has an “identity” that is something different from the pieces of which it is composed. A bank account is still “the same” bank account even if we change the balance by making a withdrawal; conversely, we could have two different bank accounts with the same state information. This complication is a consequence, not of our programming language, but of our perception of a bank account as an object. — SICP Section 3.1.3

    Rich Hickey on the same subject:

    > If it is immutable, it now taps into that definition of value we saw before. Because by being immutable we can go and take a string value, and another string value, and say: are they the same? Do they have the same magnitude? Are they talking about the same thing? Are they expressing the same specific meaning? All of those definitions of values apply to something that is not mutable. So that relative worth thing kicks in. — Rich Hickey, [The Value of Values](https://github.com/matthiasn/talk-transcripts/blob/master/Hickey_Rich/ValueOfValuesLong.md)

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

[^12]: A flip-book [has been suggested](https://softwareengineering.stackexchange.com/a/245409/369472) as a valuable mental model for state in functional programming
