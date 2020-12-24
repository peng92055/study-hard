# class与构造函数

## function来做构造函数
```
  function Car(name) {
    this.name = name
  }

  Car.prototype.run = function() {
    console.log(this.name + ' running...')
  }

  let redCar = new Car('red')
  let blueCar = new Car('blue')
  redCar.run() //red running
  blueCar.run() // blue running
```

## es6新增类
```
  class Car1 {
    constructor(name) {
      this.name = name
    }

    run() {
      console.log(this.name + ' running...')
    }
  }

  let greenCar = new Car1('green')
  let blackCar = new Car1('black')
  greenCar.run() // green running
  blackCar.run() // black running
```

## 相同与不同
  - 相同点：
    - 类声明仅仅是基于已有自定义类型的语法糖。 typeof Car1 === 'function'
    - 类上的constructor实际就是function里的方法。 run其实就是绑定在自定义类型的prototype上。
  - 不同点：  
    - 函数声明可以被提升，但是类与let类似，不能被提升。真正执行前，是一直处于临时死区
    - 类声明中的所有代码自动运行在严格模式，而且无法强行脱离严格模式
    - 在自定义类型中，通过object.defineProperty()方法可以手工指定某个方法不可枚举。而在类中，所有方法都不可枚举。
    - 每一个类都有一个[[construct]]的内部方法，通过关键字new调用。那些不含[[construct]]方法会导致程序报错
    - 使用除关键字new以为的方式调用类的构造函数会导致程序报错
    - 在类中修改类名会导致程序报错

