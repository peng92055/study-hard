# Vue2.x 源码学习日志
  - 数据响应式采用：观察者模式+数据劫持
  - 事件机制采用eventbus： 发布订阅模式

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
    - 通过defineProperty定义Vue.prototype上的一些属性
    - 定义Vue.version
  - 在 platforms/web/runtime/index.js 中引入Vue,并导出
    - 增强Vue.config的一些配置
    - 配置Vue.prototype.__patch__方法 *补丁函数，用以patching算法进行更新*
    - 定义$mount方法，接收参数(el) **挂载函数，将vue实例到指定宿主元素（获得dom并替换宿主元素）** （return mountComponent(this, query(el))）
  
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
      - **initData(vm)** -> 初始化data数据, 执行数据响应化
        - 从options中获取data
        - 判断data是否为函数，如果是函数，则执行并返回data实例
        - 将data赋值到vm._data上
        - 获取data上的Object.keys(),循环处理每个key,对每个key进行别名代理（proxy）(映射到_data上)
        - **observe(data, asRootData:true)** 将data执行数据响应化
          - 此阶段还未进行界面数据的依赖收集，只是准备工作，并如果有用户watcher，则会触发一次get，收集一次依赖
          - 递归执行data,通过defineReactive对每个对象的key进行数据响应式
          - 为每一个对象创建一个Observer实例，并将通过__ob__在data中指向ob实例
            - observer实例中包含一个Dep实例
          - 为每一个key绑定一个dep实例，存放在闭包中，并对每个key都通过defineProperty进行数据劫持。
          - Dep（发布者）实例用来保存依赖（watcher实例），一旦有更新，就通知所有的watcher
          - Watcher（观察者）用来观察数据变化，执行更新。内部保存了所有的deps。
      - initComputed(vm) -> 初始化计算属性，将计算属性也绑定到vm上，computed计算属性也会创建一个watcher实例
      - initWatch(vm) -> 初始化用户的watch，执行vm.$watch()方法,实例化一个watch对象，如果不是懒执行，则执行一次watch中的方法获取当前值。
        - 执行 this.get() -> this.getter.call() -> this.expOrFn.call() -> pushTarget() -> **Dep.target = this** -> popTarget()
    - initProvide(vm) // 初始化提供方法，先注入，后提供。resolve provide after data/props
    - callHook(vm, 'created') -> 执行生命周期的create方法  callHook会判断是否有生命周期监听事件，如果有，则emit
  3. $mount(el) ---> 执行$mount方法，内部执行mountComponent(vm, query(el)),将vue实例和根元素传递到挂载方法中。
    - 如果options中挂载了el，则在上一步初始化自动执行vm.$mount(vm.$options.el)。如果没有，则等待主动调用
    - 处理el,query(el)得到真实的dom节点
    - 判断是options中否有template，如果有，则compile成渲染函数，如果没有，则将el外部的html编译 最终得到渲染函数render
      - 编译三部曲： parse -> optimize -> generate
    - 执行 instance/lifeclycle.js 中的mountComponent()方法进行挂载
    - callHook(vm, 'beforeMount') -> 执行挂载前的生命周期的方法
    - 定义updateComponent = () => { vm._update(vm._render())}
      - vm._render() -> 生成vdom并返回
      - vm._update() -> 执行patch,diff,更新到真实的dom
    - new Watcher(vm, updateComponent) 给整个组件实例绑定一个watcher对象,传递更新函数到watcher。 
      - 主动执行this.get() -> pushTarget(this)
      - Dep.target = watcher实例, 将当前的watcher实例绑定到全局目标对象上
      - 执行更新函数，此时也就是vm._update(vm._render())
        - vm._render() （完成依赖收集）
          - 触发template中被引用的对象上的get，开始进行依赖收集。
          - dep.depend(),如果有子对象，将当前watcher实例与子对象的dep进行相互依赖
            - Dep.target.addDep(this) -> watcher.addDep(dep) 将dep添加到watcher中
              - dep.addSub(watcher) 将watcher添加到dep中
        - vm._update(vnode)
          - vm.__patch__(vm.$el | prevVnode, vnode)
            - patch函数是由createPatchFunction工厂函数返回的
          - 初始化时，旧的虚拟dom不存在，传递真实的dom节点。
          - createEle() -> 创建真实的dom节点
          - removeVnodes() -> 删除旧的dom节点
    - callHook(vm, 'mounted')
    - 结束挂载及初始化

### 更新
  - 触发劫持对象的set方法，调用dep.notify()
  - 获取dep中的所有观察者watcher,循环调用watcher.update()
  - watcher中，update通过异步更新机制来更新 queneWatcher(this) 将更新任务放进异步更新队列
    - quene.push(watcher) -> nextTick(flushSchedulerQueue) -> timerFunc() -> 获取当前环境的异步更新支持情况执行，优先Promise
  - callHook(vm, 'beforeUpdate')
  - 通过事件循环机制，在下一个执行周期中执行flushSchedulerQueue()
  - 异步获取更新任务watcher,watcher在队列中是不可重复的。所以如果在上一个周期中多次同步更新变量，在这里通过watcher会拿到最终值。
  - watcher.before -> 执行beforeUpdate钩子
  - watcher.run() -> 执行watcher的run方法。
  - watcher.get() -> this.getter.call() -> updateComponent() -> _render() -> _update() -> patch() -> patchVnode() -> updateChildren()
  - 此时已经更新完真实dom
  - watcher.cb(this.vm, value, oldValue)
  - callUpdatedHooks()
  - callHook(vm, 'updated')

### 数据双向绑定流程
  - new Vue() -> 
  - this._init() -> 
  - initState(vm) -> 
  - observe(vm._data = {}, true) -> 
  - new Observer(value) -> 
  - this.observeArray(value),this.walk(value) ->
  - defineReactive() -> 
  - Object.defineProperty

### 依赖收集流程
  - observe -> 
  - walk -> 
  - defineReactive -> 
  - get -> 
  - dep.depend() -> 
  - watcher.addDep(new Dep()) -> 
  - watcher.newDeps.push(dep) -> 
  - dep.addSub(new Watcher()) -> 
  - dep.subs.push(watcher)

### 生命周期
  - beforeCreate
    - new Vue()的第一个钩子，初始化实例上的属性、事件和渲染(包括插槽对象)函数。并给实例绑定响应式的$listener和$attrs
  - create
    - 在此钩子执行前，获取注入数据，初始化props,methods,data,computed,watch。
    - 对属性和data中的数据完成了数据观测，但是还未进行依赖收集
    - 对computed和watch进行初始化，并进行了数据的依赖收集
    - 可以对数据进行更改，但是不会触发updated函数，也不能与Dom交互，如果一定要操作，可以使用vm.$nextTick来访问dom
  - beforeMounted
    - 在此钩子执行前，得到真实的根节点，根据是否传递el来自动执行$mount或者等待手动执行$mount。
    - 执行mountComponent()方法，获取渲染函数（render）
      - 获取渲染函数三部曲 parse -> optimize -> generate
  - mounted
    - 在此钩子前，定义updateComponent方法，updateComponent = () => update(render())
    - 实例化Watcher,并传递updateComponent做为更新函数
    - 在Watcher的构造函数中，执行this.get()方法，并触发一次更新函数
    - 执行render(),通过createElement生成虚拟Dom也就是VNode,并触发get方法进行依赖收集
    - 执行update(),挂载到真实dom
      - 内部执行vm.__patch__,也就是patch方法，传递（vm.$el, vnode）
        - patch方法由createPatchFunction工厂函数构造而来
        - 判断是老节点是真实节点，则直接创建新的节点
    - 此阶段已经完成真实Dom的挂载，数据完成双向绑定，可以访问节点，可以使用$refs属性操作dom
  - beforeUpdate
    - 此阶段可以更新数据，触发对象属性的set的方法，调用dep.notify()
    - 获取所有的watcher，调用watcher.update(),通过异步队列机制来更新
    - 调用watcher.before()
    - 此阶段可以更改数据，不会造成重新渲染
  - updated
    - 在此之前，执行watcher.run()，执行真正的更新函数 render() -> updated()
    - 已经完成dom更新，避免在此阶段更改数据，会导致无限循环更新
  - beforeDestory
    - 实例销毁前，在此处清理定时器
  - destoryed
    - 发生在实例销毁后，只剩下dom空壳子，组件已经被拆解，数据绑定被卸除，监听被移除，子实例也被销毁完成。

## vue2
- Vue源码剖析之整体流程：http://t.kuick.cn/RIUp
