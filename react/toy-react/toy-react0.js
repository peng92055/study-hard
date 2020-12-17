class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type)
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value)
  }
  appendChild(component) {
    this.root.appendChild(component.root)
  }
}

class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content)
  }
}

export class Component {
  constructor() {
    this.props = Object.create(null);
    this.children = []
    this._root = null
  }
  setAttribute(name, value) {
    this.props[name] = value
  }
  appendChild(component) {
    this.children.push(component)
  }
  get root() {
    if(!this._root){
      this._root = this.render().root;
    }
    return this._root
  }
}

export function toy_createElement(type, attributes, ...children) {
  let el;
  if(typeof type === 'string') {
    el = new ElementWrapper(type)
  } else {
    el = new type
  }
  for(let a in attributes) {
    el.setAttribute(a, attributes[a])
  }
  let insertChildren = (children) => {
    for(let child of children) {
      if(typeof child === 'string') {
        child = new TextWrapper(child)
      }
      if(typeof child === 'object' && child instanceof Array) {
        insertChildren(child)
      } else {
        el.appendChild(child)
      }
    }
  }
  insertChildren(children)
  return el
}

export function render(component, parentElement) {
  parentElement.appendChild(component.root)
}