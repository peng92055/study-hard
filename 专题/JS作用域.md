# 管理作用域
- 数据存储共有4中方式： 字面量、变量、数组项、对象成员。
- 访问字面量和局部变量速度最快，访问数组元素和对象成员较慢。
- 全局变量总出在作用域链的最末端，访问速度总是比局部变量慢。

## 函数
- 每一个js函数都表示为一个对象，更确切的说，是Function对象的实例。

## 对象
- 对象拥有可以访问的属性和只能js引擎存取的内部属性。
- [[scope]]：就是内部属性。包含了一个函数被创建的作用域中对象的集合。

## 函数执行过程
  - 创建一个执行环境的内部对象
  - 初始化作用域链，将当前运行函数的[[scope]]的属性复制到执行环境的作用域链中，并推入到作用域链最前端。 这个新对象就是活动对象。
  - 会经历标识符解析过程，该过程就是搜索执行环境的作用域链。会一直向下查找，直到找不到就会认为未定义。
  - 这个过程会影响性能。固然尽可能使用局部变量。
  - 改变作用域链有两种方式，with及try-catch,catch会将异常对象推入一个变量对象并放在作用域最前端，函数的局部变量会放在第二个作用域对象中。当执行catch完成后，就会返回之前的状态。
  - 动态作用域链（with,try-catch,eval)。只存在代码执行过程中，无法通过静态分析检测。
  
## 闭包、作用域和内存
- 闭包：本质就是一个绑定了执行环境的函数
  - 允许函数访问局部作用域之外的数据。
  - 闭包创建时[[scope]]属性对象和执行环境作用域链的对象引用是相同的。在函数执行完成后，活动对象本来会销毁，但是由于与闭包内的引用还存在闭包[[scope]]中，故而不会销毁。闭包会增加内存开销，用的时候就要注意防止内存泄露。

## 对象成员
- 原型
  - js中的对象是基础原型的。它定义并实现了一个新创建的对象必须包含的成员列表。
  - 所有实例对象都共享原型对象的成员。
  - 对象通过一个内部属性绑定到它的原型（__proto__）。一旦创建了一个内置对象（Object和Array）的实例，就自动拥有一个Object实例作为原型。
  - 实例对象的(__proto__) -> Object.prototype
  - 一个实例对象可以有两种成员类型：实例成员（也成为own成员）和原型成员。
  - hasOwnProperty()就是用来判断对象是否包含特定的实例成员。
  - key in object 可以判断所有成员  eg: 'toString' in book   //true   **in操作既会搜索实例成员也会搜索原型成员**
- 原型链
  - 所有对象都是对象（Object）的实例。并继承了所有方法。eg： Function instanceof Object //true。除了null和undefined不是Object的实例
  - 经典例子：
    ```
      function Book(){} let book = new Book()
      book.__proto__ === Book.prototype
      Book.prototype.__proto__ === Object.prototype
      Object.prototype.__proto__ ==== null
    ``` 


## null undefined等特殊性质
- typeof null //object
- typeof undefined // undefined
- typeof NaN // number
- typeof Function // "function"
- typeof Array // "function"
- typeof Object // "function"
- typeof Number // "function"
- typeof String // "function"


- null instanceof Object  //false
- NaN instanceof Object //false
- undefined instanceof Object  //false
- Function instanceof Object  //true
- Array instanceof Object  //true
- Array instanceof Function //true
- String instanceof Function //true
- String instanceof Object //true