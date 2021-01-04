# Vue2.x 源码学习日志

## 初始化过程分析
  - Vue库的引入
  - 自定义vue项目中，template部分经过compiler之后生成渲染函数render
  - 在浏览器启动项目，从new Vue实例开始
  
### 加载Vue库
  - 在 core/instance/index.js中 并导出
    - 定义Vue构造函数，函数内 定义了初始化方法 this.init(options)
    - 为Vue初始化
      - 执行 initMixin(Vue); -> 定义_init方法并挂载到prototype
      - 执行 stateMixin(Vue); -> 定义状态相关的API:$data, $props, $set, $delete, $watch并挂载到prototype上
      - 执行 eventsMixin(Vue); -> 定义事件相关的API:$on, $once, $emit, $off并挂载到prototype上
      - 执行 lifecycleMixin(Vue); -> 定义生命周期相关的API: _update, $forceUpdate, $destory并挂载到prototype上
      - 执行 renderMixin(Vue); -> 定义渲染相关的API: $nextTick, _render并挂载到prototype上
  - 在 core/index.js 引入Vue，并导出
    - 执行 initGlobalAPI(Vue)
      - 配置Vue.set = set (set从observer/index中引入)
      - 配置Vue.delete = del (del从observer/index中引入)
      - 配置Vue.nextTick = del (nextTick从util/index中引入)
      - 配置Vue.options = Object.create(null)
        - 配置Vue.optons.'component'&'directive'&'filter' = Object.create(null)
        - 配置Vue._base = Vue
      - 执行 initUse(Vue) -> 配置Vue.use方法
      - 执行 initMixin(Vue) -> 配置Vue.mixin方法
      - 执行 initExtend(Vue) -> 配置Vue.extend方法
      - 执行 initAssetRegisters(Vue) -> 注册 Vue.component & Vue.directive & Vue.filter方法
    - 通过defineProperty劫持Vue.prototype上的一些属性
    - 定义Vue.version
  - 在 platforms/web/runtime/index.js 中引入Vue,并导出
    - 增强Vue.config的一些配置
    - 配置Vue.prototype.__patch__方法 *补丁函数，用以patching算法进行更新*
    - 定义$mount方法，接收参数(el) *挂载函数，将vue实例到指定宿主元素（获得dom并替换宿主元素）* （return mountComponent(this, query(el))）
  
### 加载vue项目代码
  1. new Vue(data{}).$mount('#app')
  2. init(options) ---> 执行Vue的构造函数，调用init方法，并返回Vue的实例
     - 将新实例化的对象this赋值给vm vm = this; 此时，vm.__proto__ === Vue.prototype
     - vm.uid = uid++; 给vue实例增加唯一id
     - initLifecycle(vm) -> 初始化实例上的一些属性，例如$parent, $root, $children, $refs
     - initEvents(vm) -> 初始化事件，如果_parentListeners有事件，则处理父组件传递的事件和回调
     - initRender(vm) -> 初始化渲染，设置vm.vnode = null;配置$slots, $scopeSlots, $createElement函数; 通过defineReactive对实例上的 $attrs, $listeners属性进行劫持。
     - callHook(vm, 'beforeCreate') -> 执行生命周期钩子函数
     - initInjections(vm) // 获取注入的数据，resolve injections before data/props
     - initState(vm) *初始化属性、方法、数据、计算属性、watch等*
       - initProp(vm) -> 初始化props对象，并通过defineReactive进行劫持
       - initMethods(vm) -> 初始化methods上的方法，并将方法绑定到vm实例上
       - *initData(vm)* -> 初始化data数据, 执行数据响应化
         - 从options中获取data
         - 判断data是否为函数，如果是函数，则执行并返回data实例
         - 将data赋值到vm._data上
         - 获取data上的Object.keys(),循环处理每个key,对每个key进行别名代理（proxy）(映射到_data上)
     - initProvide(vm) // resolve provide after data/props
     - callHook(vm, 'created') 
  3. $mount() ---> 执行$mount方法，内部执行mountComponent(vm, query(el)),将vue实例和根元素传递到挂载方法中。


## vue2
- Vue源码剖析之整体流程：http://t.kuick.cn/RIUp
- 数据响应式采用：观察者模式+数据劫持

## 数据响应式
```
  // 劫持数据
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
