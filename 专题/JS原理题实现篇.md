# JS原理实现系列

## instanceof原理
```
  //原理  left.__proto === right.prototype
  function myInstanceof(left, right) {
    let leftValue = left.__proto__
    let rightValue = right.prototype
    while(true) {
      if(leftValue === null) {
        return false
      }
      if(leftValue === rightValue) {
        return true
      }

      leftValue = leftValue.__proto__
    }
  }

  Function instanceof Object
  myInstanceof(Function, Object)
```

## Object.create原理
```
  function create(obj) {
    function F() {}
    F.prototype = obj
    return new F()
  }
```

## new原理
```
  function myNew(fn) {
    let obj = {};
    let Constructor = [].shift.call(arguments);
    obj.__proto__ = Constructor.prototype;
    let res = Constructor.call(obj, ...arguments)
    return typeof res === 'object' ? res : obj
  }

  function Car(name) {
    this.name = name
  }
  let car = myNew(Car)('redCar')
```

## setTimout模拟实现setInterval原理
```
  function myInterval(fn, delay) {
    let timer = null
    let loop = () => {
      fn();
      setTimeout(loop, delay)
    }
    setTimeout(loop, delay)
  }

  function fn() {console.log('hello interval')};
  myInterval(fn, 3000)
  setInterval(fn, 2000)
```

## 使用requestAnimationFrame实现setInterval
```
  function myInterval(fn, delay) {
    let startTime = Date.now()
    const loop = () => {
      if(Date.now() - startTime > delay) {
        fn()
        startTime = Date.now()
      }
      if(typeof window === 'undefined') {
        //node环境中使用setImmediate
        setImmediate(loop)
      } else {
        requestAnimationFrame(loop)
      }
    }
    loop()
  }
  function fn() {console.log('hello interval')};
  myInterval(fn, 3000)
```

## ajax原理
```
  function myAjax(url) {

  }
```

## 实现一个reduce
```
```

## 实现一个String.prototype._trim函数

### 参考[https://juejin.cn/post/6844903891591495693]
