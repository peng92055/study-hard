# Vuex / Redux
  - 发布订阅模式 在dispatch中调用reduce方法

## 手写redux的及compose函数
```
  function compose(...funcs) {
    if(funcs.length === 0) {
      return arg => arg
    }
    if(funcs.length === 1) {
      return funcs[0]
    }

    return funcs.reduce((a, b) => (...args) => a(b(...args)))
  }
```



## vuex与redux的区别
  - 更新页面的机制不同
    - vue里，vuex中store的数据也是响应式的，通过vue的响应式机制来更新页面
    - redux里，通过发布订阅模式，在数据更新后，循环执行回调函数