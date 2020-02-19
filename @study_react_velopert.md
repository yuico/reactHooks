reference: https://frontarm.com/james-k-nelson/jsx-live-cheatsheet/  https://velopert.com/3626

3.JSX
```js
-Use <lowercase /> tags when you need a DOM elements, and <Capitalized /> tags for component elements.
-JSX children can be text, elements, or a mix of both
-Attributes are props
Use "" quotes when your props are strings, Use {} braces when your props are literals or variables, And use bare attribute names to indicate a value of true
```

1.var vs let and const

let allows you to declare variables that are limited to a scope of a block statement, or expression on which it is used, unlike the var keyword, which defines a variable globally, or locally to an entire function regardless of block scope.

```js
function foo() {
  var a = 'hello';
  if (true) {
    var a = 'bye';
    console.log(a); // bye
  }
  console.log(a); // bye
}
```
```js
function foo() {
  let a = 'hello';
  if (true) {
    let a = 'bye';
    console.log(a); // bye
  }
  console.log(a); // hello
}
```


2.IIFF

An immediately invoked function expression (or IIFE, pronounced "iffy") is a JavaScript programming language idiom which produces a lexical scope using JavaScript's function scoping
```js
import React, { Component } from 'react';

class App extends Component {
  render() {
    const value = 1;
    return (
      <div>
        {
          (function() {
            if (value === 1) return (<div>하나</div>);
            if (value === 2) return (<div>둘</div>);
            if (value === 3) return (<div>셋</div>);
          })()
        }
      </div>
    );
  }
}

export default App;
```
