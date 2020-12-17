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

class MyComponent {
  
}


function toy_createElement(type, attributes, ...children) {
  let el;
  if(typeof type === 'string') {
    el = document.createElement(type)
  } else {
    el = new type
  }
  for(let a in attributes) {
    el.setAttribute(a, attributes[a])
  }
  for(let child of children) {
    if(typeof child === 'string') {
      child = document.createTextNode(child)
    }
    el.appendChild(child)
  }
  return el
}

document.body.append(<MyComponent id='a' class='b'>
  <div>aaa</div>
  <div></div>
  <div></div>
</MyComponent>)