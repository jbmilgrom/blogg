---
title: Functional & Object-Oriented Programming are Diametrically Opposed
date: 2021-01-07
tags: post
layout: layouts/post.liquid
hasTOC: yes
---

Excerpted from [Functional Programming and the Semantics of Change, State & Time](/post/functional-programming-and-identity-state-and-time/). {.introductory-caveat}

That functional programming opposes object-oriented programming in some fundamental way is a widely-held programming cliche. We list features like immutability, functions and composition in contrast to mutability, classes and inheritance. We tout Clojure and Haskel as functional languages on one end of the spectrum and C++ and Java as object-oriented languages on the other. Articulating the makeup of the spectrum is another story altogether however. None of this trivia reveals why certain features are seen together or apart, why languages themselves may skew in one direction or another, or any inherent differences in program semantics.

Nevertheless, the “functions vs. objects” cliche is an artifact of a profound truth about program structures and semantics. Like up and down and oil and water, functional and object-oriented programming indeed cannot coexist. We may choose objects or functions, but not both at once, as advertised.

[toc]

## Semantics, Not Syntax

Syntactic constructs like `this`, `new`, `class`, `private` and `public` clearly express object-oriented intent — _this_ instance of a _class_ of things *private*ly maintains data through *public*ly available APIs — and are common to object-oriented programming languages. However, they are not necessary. Object-oriented semantics may be achieved with nontraditional syntax. For example, this `bankAccount` object also stores the `balance` data privately (in JavaScript[^1]);

```js
const makeBankAccount = (balance) => ({
  withdraw: (amount) => (balance = balance - amount),
  checkBalance: () => balance,
});

const bankAccount = makeBankAccount(100);
bankAccount.withdraw(20);
bankAccount.checkBalance(); // 80
```

`balance` is accessible only through the functions `checkBalance` and `withdraw`, which proscribe the manner in which such access can occur. `bankAccount` behaves like a “bank account” even though the functions `checkBalance` and `withdraw` have gained privileged access to private data through the use of a function closure, instead of through explicit syntax. Object-oriented syntax is also insufficient in and of itself to achieve object-oriented semantics. A `bankAccount` “object” that avoids maintaining any underlying balance state

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

will _always_ be comprised of `2` in the first slot and `3` in the second and reduce to two-thirds, a reasonable conclusion is that they are the same. To be sure, substitute one for the other and the meaning of a program is unchanged.[^7] By contrast, consider when two _mutable_ rational number implementations may be deemed the “same.”

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

## Diametrically Opposed

In this light, object-oriented programming can be seen as the diametric opposite of functional programming. Objects are inherently changeable. Moreover, changeability and “object” are intertwined as concepts. Yet, changeability undermines functional programming. Just as oil cannot inhabit the same physical space as water, object-oriented programming cannot occupy the same virtual space as functional programming. Use of one excludes the other. When writing programs, we may choose mutability or immutability, objects or functions, but not both at once.

[^1]:
    Many of the insights underlying this post can be found in original form in the [Structure and Interpretation of Computer Programs ](https://web.mit.edu/alexmv/6.037/sicp.pdf) (SICP). There you will find a life-altering discussion of the same topics using Scheme, a Lisp dialect like Clojure. All code examples included in this post, however, will be couched in terms of JavaScript, even if borrowed. If you know JavaScript and are unfamiliar with Scheme, this post may be immediately accessible to you without first learning how “[to balance all those parens](https://crockford.com/javascript/javascript.html).” Little is lost in translation as well. JavaScript has first-class functions (i.e. lambdas), closures (i.e. function-delimited lexical scoping) and generally thrives when used functionally.

    > JavaScript’s functions are first class objects with (mostly) lexical scoping. JavaScript is the first lambda language to go mainstream. Deep down, JavaScript has more in common with Lisp and Scheme than with Java. It is Lisp in C’s clothing. — Douglas Crockford, [JavaScript: The Good Parts](https://www.oreilly.com/library/view/javascript-the-good/9780596517748/ch01s02.html)

    There is even an ongoing [academic effort](https://sicp.comp.nus.edu.sg/) to translate the full text of SICP into JavaScript. Also considered, JavaScript is a close cousin of TypeScript, which enables traditional object-oriented constructs like `private` and `public` and functional constructs like `readonly` and `as const` at compile time. Perhaps in JavaScript (and TypeScript), we get enough support of functional and object-oriented programming paradigms to enable a discussion of both within a single, ubiquitous language.

[^5]: Never has the delineation between syntax and semantics been more pronounced than with [value objects](https://martinfowler.com/bliki/ValueObject.html), which commandeer object-oriented syntax to effect _non_-object semantics — i.e. immutable values. If not for the divergence between syntax and semantics, so-called “value objects” would be a contradiction in terms. We’ll cover the inherent mutability of objects soon in the sections titled [Changeability is Fundamental to Object Semantics](#changeability-is-fundamental-to-object-semantics) and [“Object” Names Changeability](#“object”-names-changeability).
[^6]:
    Contextual immutability says nothing of local variables. In fact, a variable that is reassigned within the same procedure in which it was initialized cannot impact the semantics of such procedure.

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

[^7]:
    That two equivalent expressions may be substituted for one another without altering the meaning of the program is known as [referential transparency](https://en.wikipedia.org/wiki/Referential_transparency).

    > A language that supports the concept that “equals can be substituted for equals” in an expression without changing the value of the expression is said to be referentially transparent — SICP Section 3.1.3

[^8]: ❤️ The original insight️ ❤️

    > In general, so long as we never modify data objects, we can regard a compound data object to be precisely the totality of its pieces. For example, a rational number is determined by giving its numerator and its denominator. But this view is no longer valid in the presence of change, where a compound data object has an “identity” that is something different from the pieces of which it is composed. A bank account is still “the same” bank account even if we change the balance by making a withdrawal; conversely, we could have two different bank accounts with the same state information. This complication is a consequence, not of our programming language, but of our perception of a bank account as an object. — SICP Section 3.1.3

    Rich Hickey on the same subject:

    > If it is immutable, it now taps into that definition of value we saw before. Because by being immutable we can go and take a string value, and another string value, and say: are they the same? Do they have the same magnitude? Are they talking about the same thing? Are they expressing the same specific meaning? All of those definitions of values apply to something that is not mutable. So that relative worth thing kicks in. — Rich Hickey, [The Value of Values](https://github.com/matthiasn/talk-transcripts/blob/master/Hickey_Rich/ValueOfValuesLong.md)
