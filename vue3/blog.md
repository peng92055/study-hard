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