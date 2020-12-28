## vue2
- Vue源码剖析之整体流程：http://t.kuick.cn/RIUp
- 数据双向采用：观察者模式+数据劫持
- 事件机制： 发布订阅模式

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