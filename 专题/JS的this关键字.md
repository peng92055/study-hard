# this指向
- this指向调用者的环境，与绑定时无关
- this设计目的： 在函数体内部，指代函数当前的运行环境
- this是在函数被调用时，才发生的绑定。也就是说this具体指向取决于怎么调用函数。

## this的四种绑定规则
  - 默认绑定、隐式绑定、显示绑定、new绑定。 优先级从低到高
  - 默认绑定
    - 也就是没有其他绑定规则存在时的默认规则。
    - 在非严格模式时， function foo(){console.log(this.a)};var a = 2; foo(); 
      - this指向的是window
    - 在严格模式时， function foo(){'use strict'; console.log(this.a)};var a = 2; foo();
      - 执行时报错，全局对象将无法使用默认绑定。 Uncaugth TypeError: Cannot read property 'a' of undefined
  - 隐式绑定
    - 函数的调用是在某个对象是触发时，即调用位置上存在上下文对象。
      - function foo(){console.log(this.a)};var a = 2; var obj = {a: 3,foo:foo};obj.foo();
        - 此时this指向obj
  - 显示绑定
    - call、apply和bind
  - new操作符，在js中，它就是一个函数的调用，只是被new修饰了。
    - 使用new创建对象的的四步骤：
      - 创建一个全新的对象 obj
      - 将对象的原型属性__proto__指向构造对象的原型 Foo.prototype
      - 将这个新对象绑定到函数调用的this并调用。 Foo.call(obj, ...arguments)
      - 如果函数有返回对象，则返回，如果没有，则返回新创建的对象。
  - () => {this}  箭头函数中的this指向最近一层非箭头函数中的this。即this是在箭头函数定义时就绑定了。call、apply、bind不能更改this指向


## 参考链接
- [https://github.com/jasonGeng88/blog/blob/master/201804/js-this.md]
- [https://github.com/Nealyang/PersonalBlog/issues/56]
- [https://github.com/Nealyang/YOU-SHOULD-KNOW-JS/blob/master/doc/basic_js/%E5%BD%BB%E5%BA%95%E6%98%8E%E7%99%BDthis%E6%8C%87%E5%90%91.md?1536536968756]