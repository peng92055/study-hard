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
  function myAjax(url, fn) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true)
    xhr.onreadstatechange = function() {
      if(xhr.readyState === 4 && xhr.status === 200 || xhr.status == 304) {
        fn.apply(this, xhr.responseText)
      }
    }
    xhr.send()
  }
```

## 实现一个reduce
```
  let arr = [1,2,3];

  function reduce(arr, fn, init) {
    let _arr = init ? [].concat(arr, init) : [...arr]
    let prev = _arr[0];
    for(let i = 1; i < _arr.length; i++) {
      curr = _arr[i]
      prev = fn.apply(this, [prev, curr])
    }
    return prev
  }

  let fn = (x, y) => x + y;
  let init = 2;
  arr.reduce(fn, init); // 6
  reduce(arr, fn, init);
```

## 实现一个String.prototype._trim函数
```
  String.prototype._trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, "")
  }

  String.prototype._trim = function() {
    let strs = this;
    let startIndex = -1,endIndex = strs.length - 1;
    for(let i = 0; i < strs.length; i++) {
      if(strs.charAt(i) !== ' ') {
        startIndex = i;
        break
      }
    }
    if(startIndex === -1) {
      return ''
    }
    for(let i = endIndex; i >= 0; i--) {
      if(strs.charAt[i] !== ' ') {
        endIndex = i;
        break;
      }
    }
    return strs.slice(startIndex, endIndex)
  }
```

## 实现数组扁平化及排序
```
  let arr = [21,12,[42,30,[93,4]],[12,53]];
  function flat(arr) {
    return arr.toString().split(",").map(num => Number(num)).sort((a,b) => a - b)
  }
  flat(arr)
  //去重+扁平化+排序
  let arr = [21,12,[42,30,[93,4]],[12,53]];
  function flat2(arr) {
    return [...new Set(arr.toString().split(",").map(num => Number(num)).sort((a,b) => a - b))]
  }
  flat2(arr)
  // reduce方式
  function flat3(arr) {
    return arr.reduce((acc, cur) => {
      if(Array.isArray(cur)) {
        cur = flat(cur)
      }
      return acc.concat(cur)
    }, [])
  }
```

## 模拟实现 Array.prototype.splice
```
  // 参考[https://github.com/sisterAn/JavaScript-Algorithms/issues/138]
```

### 实现parsetInt
```
  var nums = '12012323';
  function myParseInt(string) {
    if(typeof string === 'number') {
      return a
    } else if(typeof string === 'string') {
      string = string.trim();
      let length = string.length;
      if(length === 0) return NaN
      let arr = string.split('').map(code => {
        return code.charCodeAt() - '0'.charCodeAt()
      })
      let nums = 0;
      for(let n of arr) {
        nums *= 10;
        nums += n;
      }
      return nums;
    } else {
      return NaN
    }
  }
  console.log(parseInt(nums))
  console.log(myParseInt(nums))
```

### 字符串取反
  ```
    function processString(s) {
      return s.split("").map(char => {
        char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
      }).join("")
    }
  ```

### 实现一个字符串匹配算法，从长度为 n 的字符串 S 中，查找是否存在字符串 T，T 的长度是 m，若存在返回所在位置
  ```
    function find(S,T) {
      if(S.length < T.length) return -1
      for(let i = 0; i < S.length - T.length; i++) {
        if(S.subStr(i, T.length) === T) return i;
      }
      return -1;
    }
  ```

### 打印出 1 - 10000 之间的所有对称数 例如 121、1331 等
  ```
    function print(max) {
      return [...new Array(max).keys()].filter(item => {
        item = item++;
        return item.toString().length > 1 && item === Number(item.toString().split("").reverse().join(""))
      })
    }
    print(1000)
  ```

### 给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
  ```
    function move(nums) {
      let length = nums.length;
      let j = 0;
      for(let i = 0; i < length - j; i++) {
        if(nums[i] === 0) {
          nums.push(0);
          nums.splice(i, 1);
          i--;
          j++;
        }
      }
      return nums
    }
    let nums = [0,1,0,3,12]
    console.log(move(nums))
  ```

### 请实现一个 add 函数，满足以下功能add(1),add(1)(2),add(1,2)(3)(4)
  ```
    function add() {
      let args = [...arguments]
      let fn = function() {
        let fn_args = [...arguments]
        return add.apply(null, args.concat(fn_args))
      }
      fn.toString = function() {
        return args.reduce((a, b) => a + b)
      }
      return fn
    }
    add(1,2)(3)(4);
  ```

### 用 JavaScript 写一个函数，输入 int 型，返回整数逆序后的字符串。如：输入整型 1234，返回字符串“4321”。要求必须使用递归函数调用，不能用全局变量，输入函数必须只有一个参数传入，必须返回字符串。
  ```
    function convert(num) {
      let num1 = num / 10;
      let num2 = num % 10;
      if(num1 < 1) {
        return num
      } else {
        num1 = Math.floor(num1);
        return `${num2}${convert(num1)}`
      }
    }
    convert(198320)
  ```
  打印0-99
  function print(n){
    setTimeout((() => {
      console.log(n);
      return () => {}
    }).call(null, []), Math.floor(Math.random() * 1000));
  }
  for(var i = 0; i < 10; i++){
    print(i);
  }

## 常用正则
  - trim: /(^\s*)|(\s*$)/g
  - 数字  /^[0-9]*$/
  - n位数字  /^\d{n}$/
  - 手机号 /^1[3-9]\d{9}$/
  - 邮箱  /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/

### 找出字符串中连续出现最多的字符和个数
  ```
    'abcaakjbb' => {'a':2,'b':2}
    'abbkejsbcccwqaa' => {'c':3}

    const arr = str.match(/(\w)\1*/g);  // str.match(/(\w)\1+/g)
    const maxLen = Math.max(...arr.map(s => s.length));
    const result = arr.reduce((pre, curr) => {
      if (curr.length === maxLen) {
        pre[curr[0]] = curr.length;
      }
      return pre;
    }, {});

    console.log(result);
  ```

## 金额格式化
  - 将100000000000 格式化为100,000,000.000  每三位进行分割
  ```
    // 德国以 . 分割金钱, 转到德国当地格式化方案即可
    10000000000..toLocaleString('de-DE') 

    // 寻找字符空隙加 .
    '10000000000'.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

    // 寻找数字并在其后面加 . 
    '10000000000'.replace(/(\d)(?=(\d{3})+\b)/g, '$1.')
  ``` 

### 编程题，写个程序把 entry 转换成如下对象 
```
  var entry = {
    'a.b.c.dd': 'abcdd',
    'a.d.xx': 'adxx',
    'a.e': 'ae'
  }
  var output = {
    a: {
      b: {
        c: {
          dd: 'abcdd'
        }
      },
      d: {
        xx: 'adxx'
      },
      e: 'ae'
    }
  }

  function convert(entry) {
    const res = Object.create(null)
    for (let key in entry) {
      const keys = key.split(".");
      if (keys.length == 1) {
        res[key] = entry[key]
      } else {
        keys.reduce((prev, curr, index) => {
          if (index === keys.length - 1) {
            return prev[curr] = entry[key]
          } else {
            prev[curr] = prev[curr] || {};
            return prev[curr]
          }
        }, res)
      }
    }
    return res
  }
```

### 编程题，写个程序把 entry 转换成如下对象 
```
  var entry = {
    a: {
      b: {
        c: {
          dd: 'abcdd'
        }
      },
      d: {
        xx: 'adxx'
      },
      e: 'ae'
    }
  }
  var output = {
    'a.b.c.dd': 'abcdd',
    'a.d.xx': 'adxx',
    'a.e': 'ae'
  }
 ``` 

### 参考[https://juejin.cn/post/6844903891591495693]