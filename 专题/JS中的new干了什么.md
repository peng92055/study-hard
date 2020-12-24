## JS中new关键字干了什么事
```
  function Car() {}
  let car = new Car()

  class Car {}
  let car = new Car
```
## 使用new构造器，分为三步
  - 创建一个空对象，将它的引用赋值给this,继承函数的原型
  - 通过this将属性和方法添加至这个对象
  - 返回this指向的新对象，也就是实例。如果没有，则返回第一个创建的对象。
  ```
    function myNew(fn) {
      let obj = {}
      obj.__proto__ = fn.prototype
      fn.call(obj, ...arguments)
      return obj
    }

    function myNew2(fn) {
      let obj = Object.create(fn.prototype)
      fn.apply(obj, arguments)
      return obj
    }
  ```