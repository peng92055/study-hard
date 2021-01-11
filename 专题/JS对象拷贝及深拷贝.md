# Object
  - getOwnPropertyDescriptor 方法返回指定对象上一个自有属性对应的属性描述符
  - getOwnPropertyDescriptors 方法用来获取一个对象的所有自身属性的描述符
  - Object.getOwnPropertyNames()方法返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组。
  - Object.getOwnPropertySymbols() 方法返回一个给定对象自身的所有 Symbol 属性的数组。
  - Object.getPrototypeOf() 方法返回指定对象的原型（内部[[Prototype]]属性的值）。
  - Object.seal()方法封闭一个对象，阻止添加新属性并将所有现有属性标记为不可配置。当前属性的值只要原来是可写的就可以改变。
  - Object.freeze() 方法可以冻结一个对象。一个被冻结的对象再也不能被修改；冻结了一个对象则不能向这个对象添加新的属性，不能删除已有属性，不能修改该对象已有属性的可枚举性、可配置性、可写性，以及不能修改已有属性的值。此外，冻结一个对象后该对象的原型也不能被修改。freeze() 返回和传入的参数相同的对象。
## 浅拷贝
- ...obj,只能浅拷贝，当属性值为对象时，拷贝的是引用。
  ```
    let a = {a: 1,b: 2}
    let b = {...a}
  ```
- Object.assing() 方法只会拷贝源对象自身的并且可枚举的属性到目标对象。如果是值是对象，拷贝的是引用。
  ```
    let a = {a: 1,b: 2}
    let b = Object.assign({}, a)
  ```
- Object.create(Object.getPrototypeOf(obj),Object.getOwnPropertyDescriptors(obj),Object.getOwnPropertySmbols())

## 深拷贝
- JSON.parse(JSON.stringify(obj)) 不可以拷贝undefined，function，RegExp,Date等类型
- 递归拷贝
  ```
    //针对Date,function,Array等也是失效的。
    function deepClone(obj) {
      let _obj = {}
      for(let key in obj) {

        if(obj[key] !== null && type obj[key] === 'object') {
          _obj[key] = deepClone(obj[key])
        } else {
          _obj[key] = obj[key]
        }
      }
      return _obj
    }
  ```
  ```
    //完整clone
    function deepClone(obj) {
      if(obj == null || typeof obj !== 'object') return obj
      let _obj;
      //当前为Date类型，typeof值其实是object
      if(obj instanceof Date) {
        _obj = new Date();
        _obj.setTime(obj.getTime())
        return _obj
      }

      //当前是数组类型，typeof值是object
      if(obj instanceof Array) {
        _obj = []
        for(let i = 0; i < obj.length; i++) {
          _obj[i] = deepClone(obj[i])
        }
        return _obj
      }

      //当前是函数
      if(obj instanceof Function) {
        _obj = function() {
          return obj.apply(this, arguments)
        }
        return _obj
      }

      //为对象
      if(obj instanceof Object) {
        _obj = {}
        for(let attr in obj) {
          if(obj.hasOwnProperty(attr)) {
            _obj[attr] = deepClone(obj[attr])
          }
        }
        return _obj
      }

      throw new Error('unable to copy obj as type isnot supported:' + obj.constructor.name)
    }


    function deepClone(obj) {
      var copy;

      // Handle the 3 simple types, and null or undefined
      if (null == obj || "object" != typeof obj) return obj;

      // Handle Date
      if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
      }

      // Handle Array
      if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = deepClone(obj[i]);
        }
        return copy;
      }

      // Handle Function
      if (obj instanceof Function) {
        copy = function() {
          return obj.apply(this, arguments);
        }
        return copy;
      }

      // Handle Object
      if (obj instanceof Object) {
          copy = {};
          for (var attr in obj) {
              if (obj.hasOwnProperty(attr)) copy[attr] = deepClone(obj[attr]);
          }
          return copy;
      }

      throw new Error("Unable to copy obj as type isn't supported " + obj.constructor.name);
    }
  ```