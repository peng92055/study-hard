// 编译器
// 递归dom树，判断元素类型，如果是文本，则使用插值绑定
// 如果是元素，则判断其属性是否是指令或者事件，然后递归遍历子元素
class Compiler {
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = document.querySelector(el)

    if (this.$el) {
      this.compiler(this.$el)
    }
  }

  compiler(el) {
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach(node => {
      if (this.isElement(node)) {
        // 判断是元素
        this.compilerElement(node)
      } else if (this.isInter(node)) {
        // 判断是插值
        this.compilerText(node)
      }

      if (node.childNodes && node.childNodes.length > 0) {
        this.compiler(node)
      }
    })
  }

  compilerText(node) {
    this.update(node, RegExp.$1, 'text')
  }

  compilerElement(node) {

  }



  update(node, exp, dir) {
    const fn = this[dir + 'Updater'];
    fn && fn(node, this.$vm[exp])

    new Watcher(this.$vm, exp, function(val) {
      fn && fn(node, val)
    })

  }

  textUpdater(node, value) {
    node.textContent = value
  }

  isElement(node) {
    return node.nodeType === 1
  }

  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }
}