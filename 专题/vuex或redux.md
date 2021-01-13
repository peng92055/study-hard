# Vuex / Redux
  - 状态管理的思路： 把组件之间需要共享的状态抽离出来，遵循一定的约定，统一管理，让状态的变化可以预测。
    - 思路1： 全局对象。容易造成数据更改导致相关依赖变化错乱，不可预测
    - 思路2： action。通过dispatch派发行为action
  - redux实现思路： 发布订阅模式 在dispatch中调用reduce方法
    - redux的异步更新实现：发送两个action,在请求前和请求后都发送action来更新。
  - Vuex,更改对象，利用vue的数据响应式原理来更新
    - mutation用来做同步事务
    - action用来做异步事务
  - redux: view -> dispatch -> actions -> reducer -> state变化 -> view变化
  - vuex:  view -> commit  -> mutations -> state变化 -> view变化
           view -> dispatch -> actions -> mutations -> state变化 -> view变化 

## vuex的mutation和redux的reducer为什么不能做异步操作
  - 因为更改state的函数必须是纯函数，纯函数既是统一输入就会统一输出，没有任何副作用；如果是异步则会引入额外的副作用，导致更改后的state不可预测；          

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

### 参考链接
  - [https://zhuanlan.zhihu.com/p/53599723]  Vuex、Flux、Redux、Redux-saga、Dva、MobX