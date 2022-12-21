---
title: Object Names Changeability
date: 2022-12-21
tags: post
layout: layouts/post.liquid
---

Excerpted from [Functional Programming and the Semantics of Change, State & Time](/post/functional-programming-and-identity-state-and-time/#“object”-names-changeability). {.introductory-caveat}

Changeability _implies_ an object. The rational number “2/3” cannot change, for example. Change the denominator of “2/3” from 3 to 5 and its identity changes as well to “2/5”. Neither can the integer "24." Increase the number of units represented by “24” and it may change to “25.”

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

[^8]: ❤️ The original insight️ ❤️

    > In general, so long as we never modify data objects, we can regard a compound data object to be precisely the totality of its pieces. For example, a rational number is determined by giving its numerator and its denominator. But this view is no longer valid in the presence of change, where a compound data object has an “identity” that is something different from the pieces of which it is composed. A bank account is still “the same” bank account even if we change the balance by making a withdrawal; conversely, we could have two different bank accounts with the same state information. This complication is a consequence, not of our programming language, but of our perception of a bank account as an object. — SICP Section 3.1.3

    Rich Hickey on the same subject:

    > If it is immutable, it now taps into that definition of value we saw before. Because by being immutable we can go and take a string value, and another string value, and say: are they the same? Do they have the same magnitude? Are they talking about the same thing? Are they expressing the same specific meaning? All of those definitions of values apply to something that is not mutable. So that relative worth thing kicks in. — Rich Hickey, [The Value of Values](https://github.com/matthiasn/talk-transcripts/blob/master/Hickey_Rich/ValueOfValuesLong.md)