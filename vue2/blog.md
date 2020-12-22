## vue2
- Vue源码剖析之整体流程：http://t.kuick.cn/RIUp

## 数据响应式
```
  function defineReactive(obj, key, val) {
    return Object.defineProperty(obj, key, {
      get() {
        return val
      },
      set(newVal) {
        val = newVal;
        update()
      }
    })
  }
```
## 依赖收集