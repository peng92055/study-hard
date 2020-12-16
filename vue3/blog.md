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

- 初始化过程
1. createApp
2. renderer渲染器创建的 renderer.createApp()
3. createRenderer来创建渲染器
4. 初始化时，vnode的类型是组件，初始化时会进行一次patch
5. mount
   
### Vue.use、Vue.componment等变成 由全局静态 -> 改变成实例上的方法
- 较少全局污染
- 静态全局无法使用摇树优化代码
- 链式调用，优化代码使用
