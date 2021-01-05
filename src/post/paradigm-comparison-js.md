---
title: Using Javascript to Implement the Same Stateful Program in both Object-Oriented and Functional Styles
date: 2021-01-05
tags: post
layout: layouts/post.liquid
---

Excerpted from [Functional Programming and the Semantics of Change, State & Time](/post/functional-programming-and-identity-state-and-time/#now%2C-what-about-programs). {.introductory-caveat}

Some real programs are designed to produce output based solely on input. Ideally, compilers output the same binaries provided the same input files, for example. More frequently, however, programs require state, and user input _together_ with the current state of the program determine the next state or output of the program. Such is the case with our ATM example, where the current balance is crucial to calculating any subsequent balance post withdrawal. To be generally useful, either paradigm must include a model for state, and perhaps time, even if composed entirely of well-behaved state*less* mathematical functions.

## Stateful Object-Oriented Programs

> Modeling with objects is powerful and intuitive, largely because this matches the perception of interacting with a world of which we are part. — [SICP](https://web.mit.edu/alexmv/6.037/sicp.pdf) Section 3.5.5

Creating stateful object-oriented programs is straightforward. An ATM program, for example, that allows the user to set a “withdrawal amount” and effect a withdraw,

<script async src="//jsfiddle.net/jmilgrom/notc93Lv/embed/"></script>

decomposes naturally into `withdrawalAmount` and and `bankAccount` objects, representing the chosen amount to be withdrawn and the user account underlying the session, respectively. The withdrawal amounts are incorporated by and read from `withdrawalAmount`. Withdrawals are incorporated by, and balance confirmations are read from, `bankAccount`. The current balance and the amount to potentially withdraw — the state of the program — are reflected directly by the state of `bankAccount` and `withdrawalAmount` — the state of its composite objects.

### Time

> If we wish to write programs that model this kind of natural decomposition in our world (as we see it from our viewpoint as a part of that world) with structures in our computer, we make computational objects that… must change with time. — [SICP](https://web.mit.edu/alexmv/6.037/sicp.pdf) Section 3.5.5

When we model objects, we also model time. Objects change — as we discussed, the notion of an “object,” having parts that change without changing the identity of the whole, articulates this ability. The flip-side to changing objects is time. Since objects change, _when_ an object is examined is vital to the examination, it goes without saying.

Look no further than the object representations of our computer programs. The “having parts that can change without changing the identity of the whole” quality of `bankAccount` in our ATM program, for example, is implemented by `withdraw`.

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

The flip-side to changing objects is time. In addition to changing the associated balance, any call to `withdraw` also “delineates moments in time” _when_ `balance` _may_ change. Whether `bankAccount.checkBalance()` resolves to `100` or `80` “depends not only on the expression itself, but also on whether the evaluation occurs before or after these moments.” As a result, by modeling objects, “we are forced to admit time into our computational models.” ([SICP](https://web.mit.edu/alexmv/6.037/sicp.pdf) Section 3.4)

### Stateful

Object-oriented programming reifies objects. Further, objects can be composed in other objects, received by object methods, and generally manipulated like numbers, strings and other [first-class citizens](https://en.wikipedia.org/wiki/First-class_citizen) of the program. No such affordances are made for state, on the other hand. State is a quality (i.e. “stateful” or “statefulness”) adjacent to objects. Unlike the objects to which they belong, state can only be _observed_ at runtime, rather than _expressed_ through language.

`bankAccount` and `withdrawalAmount` identify objects, for example. They can be composed in other objects, received by object methods and generally manipulated like other first-class citizens of the program. By reifying these objects, however, `balance` and `amount` state are relegated to object qualities, observable at runtime only through calls to `bankAccount.checkBalance` and `withdrawalAmount.get`.

That objects indeed lack any express notion of state is highlighted by object signatures with more than one getter, where any such notion may only exist through definition, signature by signature:

> How can you perceive a mutable object that has more than one getter? … How do you it? … Who could say right now how to do this? No one can, right? You cannot do this, because you need this other thing. You need the recipe for doing this, and the recipe is something that everybody has to make up over and over and over again. … We cannot actually perceive the whole. Cannot do it without help. Without these recipes. — Rich Hickey, [The Value of Values](https://github.com/matthiasn/talk-transcripts/blob/master/Hickey_Rich/ValueOfValuesLong.md)

An object with a single read method (like `bankAccount`) in a sense defines _the_ method for accessing the whole of an object’s state. However, each additional read method dilutes this claim, underscoring the need for a method specific to the task (e.g. `toJSON`, `serialize`, `inspect`, etc.). In stark contrast to numbers, string and objects themselves, state may be expressed only through programmer-defined constructs evaluated at runtime.

## Stateful Functional Programs

> Is there another approach? Can we avoid identifying time in the computer with time in the modeled world? Must we make the model change with time in order to model phenomena in a changing world? — [SICP](https://web.mit.edu/alexmv/6.037/sicp.pdf) Section 3.5

Building stateful functional programs is less straightforward. To start, notice that imperative iteration can be restructured into functional iteration by recursively calling an iterative function with the results of the previous call. An imperative implementation of factorial, for example,

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
