# 继承的几种类型
```
  // 父类
  function Car(name) { //提供构造函数，并增加属性和方法
    this.name = name;
    this.colors = ['red','blue']
    this.getName = function() {
      console.log('car name: ', this.name + ' and arguments': ,arguments)
    }
  }
  //增加原型属性和方法
  Car.prototype.wheelCount = 4;
  Car.prototype.run = function() {
    console.log(this.name, " running and arguments: ",arguments)
  }

  function AutoCar() {
    this.name = name;
    this.colors = ['green']
    this.type = 'auto'
  }
```
## 原型链继承
```
  function Bmw(name) {
    this.name = name
  }
  Bmw.prototype = new Car();

  var car1 = new Bmw('red');
  var car2 = new Bmw('blue');
  car1.getName('aa'); 
  car2.run('fast');
  car1.colors.push('black');
  console.log(car2.colors); //['red','blue','black']
```
  - 特点： 通过子类的原型对父类的实例化实现 Bmw.prototype = new Car()
  - 优点： 可继承父类构造函数的属性、方法，原型的属性和方法
  - 缺点： 
    - 子类原型如果更改从父类继承来的引用类型属性(包括构造函数内或者原型链上的属性)时，会影响其他子类属性。
    - 子类实例无法向父类构造函数传递参数
    - 继承单一,不能继承多个父类
## 构造函数继承 （经典继承方式）
```
  function Bmw() {
    Car.call(this, ...arguments)
    AutoCar.apply(this, arguments)
  }
  var car1 = new Bmw('red');
  var car2 = new Bmw('blue');
  car1.getName('aa');
  car2.run('fast'); //报错，没有run方法。

```
  - 特点： 利用call或者apply将父类构造函数引入子类函数并执行
  - 优点： 
    - 避免引用类型属性被所有实例共享
    - 可以向父类传递参数
    - 可以继承多个构造函数属性
  - 缺点：
    - 没有继承父类原型的属性和方法
    - 没有实现构造函数复用，每个新实例都有父类构造函数的副本。
## 组合继承 (常用)
```
  function Bmw() {
    Car.call(this, ...arguments)
  }
  Bmw.prototype = new Car();

  var car1 = new Bmw('red')
  var car2 = new Bmw('blue')
  car1.getName(); //car name: red
  car2.run('slow') // blue running
  car1.colors.push('black');
  console.log(car2.colors) // ['red', 'blue']
```
  - 特点： 结合原型继承和构造函数继承
  - 优点： 可以继承父类构造函数和原型链上方法和属性，并且引用类属性都是独立的。可以向父类传参。
  - 缺点： 两次父类构造函数，耗损内存。
## 原型式继承
```
  function createObj(o) {
    function F(){}
    F.prototype = obj
    return new F();
  }
```
  - 此方法就是es6的Object.create原理实现
  - 所有实例都会继承原型上的属性，但是无法实现复用。并且引用类型也会共享相应的值。
## 寄生式继承
```
  function createObj(o) {
    let clone = Object.create(o)
    clone.sayName = function() {
      console.log('aaa')
    }
    return clone
  }
  - 此方法与构造函数模式一样，每次创建对象都会创建一遍方法。
```
## 寄生组合式继承 （常用）
```
  function create(obj) {
    function F(){};
    F.prototype = obj;
    return new F()
  }

  function Bmw() {
    Car.call(this, ...arguments)
  }

  //组合继承中为： < Bmw.prototype = new Car()>
  // 在此处为了减少构造函数再次执行，直接将Bmw的原型访问Car的原型即可
  let prototype = create(Car.prototype)
  prototype.constructor = Bmw
  Bmw.prototype = prototype

  var car1 = new Bmw('red')
  car1.run()

```
 - 包含组合继承的优势，修复组合继承的问题。构造函数只执行了一次

- 参考文档： 
- [https://github.com/mqyqingfeng/Blog/issues/16]
- [https://blog.csdn.net/qq_32682137/article/details/82426401]
- [https://mp.weixin.qq.com/s/6wJMTMl63S2LYZljobWb9w]