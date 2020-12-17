# JSX原理及实现
- 使用webpack打包js yarn add webpack webpack-cli -S
- 引入babel loader来编译es6 yarn add babel-loader @babel/core @babel/preset-env -S
- 引入babel-transform-react-jsx来编译jsx变成js yarn add @babel/plugin-transform-react-jsx -S
- 编写自己的jsx解析
- 可以在js中直接写html,由插件jsx将html转变成js代码并执行
  ```
    function toy_createElement(tagName, attributes, ...children) {
      let el = document.createElement(tagName)
      for(let a in attributes) {
        el.setAttribute(a, attributes[a])
      }
      for(let child of children) {
        if(typeof child === 'string') {
          child = document.createTextNode(child)
        }
        el.appendChild(child)
      }
      return el
    }

    document.body.append(<div>
      <div id='a' class='b'>aaa</div>
      <div></div>
      <div></div>
    </div>)
  ```

  ## 添加生命周期
  ## 增加setState