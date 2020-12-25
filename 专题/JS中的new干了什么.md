## JS中new关键字干了什么事
- new运算符创建一个指定对象类型的实例
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
    function Car(name) {this.name = name}
    function Car(name) {this.name = name; return {age: name}}

    function myNew(fn) {
      return function() {
        let obj = {}
        obj.__proto__ = fn.prototype
        let res = fn.call(obj, ...arguments)
        return typeof res === 'object' ? res : obj
      }
      //
      return function() {
        let obj = Object.create(fn.prototype)
        let res = fn.apply(obj, arguments)
        return typeof res === 'object' ? res : obj
      }
    }

    function myNew2() {
      let obj = {};
      let Constructor = Array.prototype.shift.call(arguments);
      obj.__proto__ = Constructor.prototype;
      let res = Constructor.call(obj, ...arguments)
      return typeof res === 'object' ? res : obj
    }

    myNew(Car)('red')
    myNew2(Car, 'red')
  ```