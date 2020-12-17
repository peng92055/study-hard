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

  ### react事件系统
  - react底层，对事件进行了合并。合并主要做了：事件委派和自动绑定
    - 事件委派： 将所有事件绑定在结构最外层，使用统一的事件监听器。该事件监听器中包含了所有组件内部的事件、处理函数和组件的映射。当事件发生时，只需要在统一的事件监听器中处理，并找到真正的函数并调用。简化了事件处理和回收机制，提高效率。
    - 自动绑定，每个方法的上下文都会只想该组件的实例。即自动绑定this为当前组件
      - bind方法。 handleClick(e){}   <button onClick={this.handleClick.bind(this)}>
      - 构造器内声明 constructor(props){super(props);this.handleClick = this.handleClick.bind(this)}; handleClick(e){} <button onClick={this.handleClick}>
        - 好处是仅需要绑定一次，不用每次调用事件监听器是去执行绑定
      - 箭头函数 ，箭头函数会自动绑定此函数的作用域
        - handleClick = (e) => {}   <button onClick={this.handleClick}>
        - handleClick(e){}  <button onClick={() => this.handleClick()}>
  - react中可以使用原生事件。在componentDidMount()中可以找到真实dom后调用 
    - this.refs.button.addEventListener('click', e => {this.handleClick(e)})
    - 主要使用原生事件后，一定要手动卸载。如果使用合成事件机制，则react会自动处理掉
  - react合成事件与js原生事件差别
    - 事件传播与阻止事件传播
      - 原生事件包含了事件捕获，阻止原生事件传播使用：e.stopProgation()
      - 事件合成只实现了事件冒泡。阻止事件传播： stopProgation()
    - 事件类型
      - React合成事件的时间类型是js原生事件类型的一个子集
    - 事件绑定方式
    - 事件对象
      - 原生dom事件对象在w3c标准和ie标准存在差异，在低版本的ie浏览器中，只能使用window.event来获取事件对象
      - react合成事件系统不存在兼容性问题，在事件处理函数中可以得到一个合成事件对象