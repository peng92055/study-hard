// function toy_createElement(tagName, attributes, ...children) {
//   let el = document.createElement(tagName)
//   for(let a in attributes) {
//     el.setAttribute(a, attributes[a])
//   }
//   for(let child of children) {
//     if(typeof child === 'string') {
//       child = document.createTextNode(child)
//     }
//     el.appendChild(child)
//   }
//   return el
// }

// document.body.append(<div>
//   <div id='a' class='b'>aaa</div>
//   <div></div>
//   <div></div>
// </div>)


import { toy_createElement, render, Component } from './toy-react'

class MyComponent extends Component {
  constructor() {
    super();
    this.state = {
      a: 1,
      b: 2
    }
  }
  render() {
    return <div>
      <h1>my component</h1>
      {/* <button onClick={() => { this.state.a++;this.rerender()}}>add</button> */}
      <button onClick={() => { this.setState({a: this.state.a + 1})}}>add</button>
      <span>{this.state.a.toString()}</span>
      <span>{this.state.b.toString()}</span>
      {this.children}
    </div>
  }
}

render(<MyComponent id='a' class='b'>
  <div>aaa</div>
  <div></div>
  <div></div>
</MyComponent>, document.body)