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