ref: https://frontarm.com/james-k-nelson/jsx-live-cheatsheet/  https://velopert.com/3626

part 3.JSX

-Use <lowercase /> tags when you need a DOM elements, and <Capitalized /> tags for component elements.
```js
// Use `<lowercase />` tags for DOM elements
let domElement = <h1>Hello, world</h1>

// And use `<Capitalized />` tags for component elements.
let HelloWorld = () => domElement
let helloWorldElement = <HelloWorld /> 

ReactDOM.render(helloWorldElement, document.getElementById('root
```
-JSX children can be text, elements, or a mix of both
```js
// Children can be text.
let textChildren = <p>What good is a phone call...</p>

// Children can be elements.
let elementChildren = <p><em>If you're unable...</em></p>

// Or they can be a mix of both.
let mixedChildren = <p>To <strong>speak?</strong></p>

ReactDOM.render(
  React.createElement(
    'div',
    null,
    textChildren,
    elementChildren,
    mixedChildren,
  ),
  document.getElementById('root')
)
```
-Attributes are props
Use "" quotes when your props are strings, Use {} braces when your props are literals or variables, And use bare attribute names to indicate a value of true
```js 
let form =
  <form>
    <input value="Test 1" tabIndex={3} />
    <input
      // The `value` prop will have the string value `"Test"`
      value="Test 2"

      // The `tabIndex` prop will have the number value `2`
      tabIndex={2}

      // The `autoFocus` prop will have the boolean value `true`, but
      // I've disabled it to prevent the page starting in this example ;)
      /* autoFocus */
    />
    <input value="Test 3" tabIndex={1} />
  </form>
  
ReactDOM.render(form, document.getElementById('root'))
```
-A pair of empty <> and </> tags get’s turned into a React.Fragment elemen

-{} interpolates children
When a pair of {} braces is encountered within a JSX element, it’s value will be interpolated in as a child
```js
let Hello = (props) => <div>Hello, {props.to}</div>

let hellosElement =
  <div>
    <Hello to="World!" />
    <Hello to={<strong style={{color: '#61dafb'}}>React!</strong>} />
    <Hello to={[<em>Mum</em>, " and ", <em>Dad</em>]} />
  </div>
  
ReactDOM.render(hellosElement, document.getElementById('root'))
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
