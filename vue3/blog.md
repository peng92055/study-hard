# vue3 学习笔记
## vue3分为三大核心
- reactivity
  - 响应式核心 依赖proxy 
- compile （dom -> core）
  - 掌握编译原理真的可以为所欲为
   编译五步骤
   1. baseParse(template) -> ast
   2. transform(ast)
   3. generate(ast) 生成代码字符串string
   4. 使用new Function 把string转换成可执行函数
   5. 执行函数，返回的就是vdom(包含静态标记)
- runtime (dom -> core)
### 平台化 替换compile-dom和runtime-dom即可 底层都是用core

## 初始化流程
- 初始化vue2和vue3的区别
  - vue2
    ```
      new Vue({
        date() {
          return {
            count: 0
          }
        }
      }).$mount('#app)
    ``` 
  - vue3
    ```
      const { createApp, reactive, computed } = Vue
      createApp({
       setup() {
         const data = reactive({
           counter: 1,
           doubleCounter: computed(() => data.counter * 2)
         })
         return {data}
       }
      }).mount('#app)
    ```
  - 区别1： 由new变成工厂函数来初始化实例对象
  - 区别2： 挂载对象由$mount变成mount
  - 区别3： 可以将操作同一数据的定义和函数写在一起，减少开发时页面横跳。

- 初始化过程 创建vnode -> 渲染vnode -> 生成dom
1. 从Vue中引入createApp构造方法
2. createApp方式实际是有renderer渲染器提供 renderer.createApp()
3. 渲染器需要一个构造函数来创建渲染器，ensureRenderer = () => { return renderer}
4. ensureRenderer() { return renderer || renderer = createRenderer()} 返回一个单例的renderer渲染器
5. 由baseCreateRenderer来创建渲染器。baseCreateRenderer() { return renderer }
6. baseCreateRenderer 真实代码从420行到2228行，此方法返回 return { render, hydrate, createApp: createAppAPI(render, hydrate) }
7. 渲染器renderer包含render方法和createApp方法
8. 创建app的实例实际来自于createAppAPI
9. createAppAPI返回了真实的app。其实就是一个object,并赋值到了上下文中。
10. app对象包含：
    ```
      app = {
        _context: context,
        _container: null,
        version,
        set config(){},
        get config(){},
        //与vue2静态调用不同的点
        use() {},
        mixin(){},
        component(){},
        directive(){},
        mount(rootContainer, isHydrate){
          //初始化vnode
          const vnode = createVNode(rootComponent, rootProps)
          ...
          if(isHydrate) {
          } else {
            //渲染函数,真实渲染
            render(vnode, rootContainer)
          }
        },
        unmount(){},
        provide(){}
      }
    ```
11. mount中的render方法是由baseCreateRenderer里生成的，render方法中最关键的就是patch
12. patch来根据旧vnode和新的vnode进行diff算法，从而挂载元素
13. 在初始化时，第一次传递到createApp({})中是一个对象，这个对象最后解析会当做组件类型，即此时的vnode的类型是组件，初始化时会进行一次patch
14. 在patch中，根据组件类型判断，调用processComponent() -> mountComponent()来初始化组件
15. mountComponent() 中调用了setupRenderEffect（）//副作用函数
16. setupRenderEffect() -> 创建subTree，并调用patch挂载，patch(null, subTree)
17. patch中根据type类型，通过nodeOps来实际操作dom元素
   
### Vue.use、Vue.componment等变成 由全局静态 -> 改变成实例上的方法
- 较少全局污染, 这些方法只在当前实例上调用，不会绑定在全局Vue上。
- 静态全局无法使用摇树优化代码，
- 每次调用都会返回当前app实例，可以链式调用，优化代码使用
- compostionAPI中reactive和computed可以写到一起，减少页面横跳。

## vue3数据响应式
- Proxy是一种可以拦截并改变底层JS引擎操作的包装器。
- 代理后对象 反射API以Reflect对象的形式出现。
- Reflect代理的方法可以基于操作是否成功来返回恰当的值。增加容错性。
```
  function defineReactive(obj) {
    return new Proxy(obj, {
      get(target, key) {
        return target[key]
      },
      set(target, key, val) {
        target[key] = val
        update()
      }
    })
  }
```
### vue2响应式和vue3响应式的差别
- vue2中响应式内部基于了observe,初始化时将obj的keys全部获取，并递归所有的key,递归耗时影响性能（速度慢，内存占用大）。
- vue3中使用proxy,不需要对每个key进行遍历，并且只在需要用的时候，才访问对象。
- vue2对于数组需要特殊处理，修改数据是不能使用索引方式。
- vue2中动态添加或者删除对象属性不能直接监听，需要额外使用API(Vue.set()/delete())，动态添加观察者。
- vue3中利用proxy就可以解决上诉问题。proxy可以通过deleteProperty来拦截动态删除。利用set可以拦截动态添加
  
### vue3依赖收集具体实现
- 依赖收集 {target<Object>, {key<String>:[cb1, cb2,...]<Set>}<Map>}<WeakMap>
- 定义targetMap对象，WeapMap格式，用来保存对象和effect函数之间的依赖。由于key为对象，故而用weakmap。
- targetMap中key为target整个对象
- tragetMap中value为key与cb函数数组的映射对象。为普通map
- map中key为响应式的key
- map中的value为cb集合对象set,方便去重

## vite
- Vite 是一个由原生 ESM 驱动的 Web 开发构建工具。在开发环境下基于浏览器原生 ES imports 开发，在生产环境下基于 Rollup 打包。
- 它主要具有以下特点：
  - 快速的冷启动
    - vite 利用浏览器原生支持模块化导入这一特性，省略了对模块的组装，也就不需要生成 bundle，所以 冷启动是非常快的
  - 即时的模块热更新
  - 真正的按需编译
    - 打包工具会将各模块提前打包进 bundle 里，但打包的过程是静态的——不管某个模块的代码是否执行到，这个模块都要打包到 bundle 里，这样的坏处就是随着项目越来越大打包后的 bundle 也越来越大。而 ESM 天生就是按需加载的，只有 import 的时候才会去按需加载
    - vite 就是在按需加载的基础上通过拦截请求实现了实时按需编译