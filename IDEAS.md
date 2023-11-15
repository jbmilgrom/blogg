## How AI will impact learning
- Previously, learning happened through some combination of top-down and bottom up. Botton up always works in a sense. Take "Code ..." for example. Information theory lays the groundwork for binary counting, which lays the groundworks for ...., which lays the groud work for computer systems and CPU architecture. Secrets of a Javascript Ninja starts with ....
- Examples of where it succeeded
   - Big query
   - Unix
   - Git
- Examples of where it failed
   - Big Query
   - Git
- So is GPT4 a tutor?
- Is GPT4 an employee?
- Is GPT4 a tool? Is it a compiler?


## Understanding Pointers/Call-by-reference by comparisons b/w c, go and JavaScript

## Go, a beautiful language
 - Rules around variable initialization and types
    - "zero value" initialization per type (included empty slots in fixed array)
    - implied types based on variable values with short/var variable declarations
    - tuple assignments / functions return multiple values
 - variables declared and scoped to if block. I've only ever seen this done with for loops
 - first class functions
 - easy scoping rules within package - everything visible everywhere within package _independent_ of file decomposition
 - easy exports - capitalization
 - side effect operators illegal in expressions
 - switch statement
    - default no fallthrough
    - tagless / boolean expressions
 - types
    - structural typing- separating data abstraction from object semantics
    - classless methods; "objects" used as type- separating data abstraction from object semantics
        e.g. 
        ```go
      // ToC converts type Fahrenheit to a number in celcius units
      func (f Fahrenheit) ToC() Celcius {
      	return Celcius((f - 32) * 5 / 9)
      }
        ```
    - easy type conversion for aliased types e.g. (float64(celsius)) 
 - immutable strings