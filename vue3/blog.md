# vue3 学习笔记
  vue3分为三大核心
  
- reactivity
  ### 响应式核心 依赖proxy 
- compile （dom -> core）
  ### 掌握编译原理真的可以为所欲为
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
      const { createApp } = Vue
      createApp({
        date() {
          return {
            count: 0
          }
        },
      }).mount('#app)
    ```
  - 区别1： 由new变成工厂函数来初始化实例对象
  - 区别2： 挂载对象由$mount变成mount

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

## vite
