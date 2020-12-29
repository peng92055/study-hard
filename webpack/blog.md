# webpack
  - webpack是一个模块打包器（module bundler）。基于tapable的插架架构，扩展性强，支持众多的loader和plugin。
  - webpack只能解析JS文件，所以需要loader来处理各种非js模块。
  - 常用配置： devtool, entry, output, module,resolve,plugins,externals等。
## 原理
  - 获取主模块内容
  - 分析模块，安装@babel/parser包（转ast）
  - 对模块内容进行处理
    - 安装@babel/traverse包（遍历ast收集依赖）
    - 安装@babel/core和@babel/preset-env包（es6转es5）
  - 递归所有模块
  - 生成最终代码
  
## loader原理
  - Loader描述了webpack如何处理非js模块（例如css,sass,ts等），并且在build中引入这些依赖。用来做模块转换。
  - 常见loader: 
    - 样式：sass-loader,css-loader, css-loader,
    - 编译：babel-loader,ts-loader,
    - 文件： file-loader,url-loader，
    - 校验测试： jshint-loader, eslint-loader
    - 框架： vue-loader
  - 写一个loader
    - 不能用箭头函数，使用this来接受参数 this.query
    - 替换js文件中所有涵盖“中化石化电子商务有限公司”字样替换成“xx”
    - uat-replace-loader
      ```
        module.exports = function (source) {
          const result = source.replace("中化石化", "xx");
          this.callback(null, result);
        };
      ``` 
    - 在webpack.config.js中引入 
      ```
        module: {
          rules: [{
            test: /\.js$/,
            use: [{
              loader: 'uat-replace-loader'
            }]
          }]
        }
      ``` 
## plugin原理
  - plugin可以扩展webpack的功能，在webpack运行的生命周期中会广播出很多事件，plugin可以监听这些事件，从而扩展功能。例如打包优化、压缩，定义环境，处理各种子任务等功能。
    - 常用plugin:
      - CommonChunkPlugin
      - html-webpack-Plugin
      - uglifyJsPlugin
    - 写一个plugin插件步骤
      - 编写一个js命名的函数
      - 在它的原型是定义一个apply方法
      - 指定挂载的webpack事件钩子
      - 处理webpack内部实例的特定数据
      - 功能完成后调用webpack提供的回调
        ```
          // A JavaScript class.
          class MyExampleWebpackPlugin {
            // Define `apply` as its prototype method which is supplied with compiler as its argument
            apply(compiler) {
              // Specify the event hook to attach to
              compiler.hooks.emit.tapAsync(
                'MyExampleWebpackPlugin',
                (compilation, callback) => {
                  console.log('This is an example plugin!');
                  console.log('Here’s the `compilation` object which represents a single build of assets:', compilation);

                  // Manipulate the build using the plugin API provided by webpack
                  compilation.addModule(/* ... */);

                  callback();
                }
              );
            }
          }
        ```
    - 编写plugin时，可以访问compiler和compilation,通过钩子webpack执行。
  
## loader和plugin的区别,常用的loader和plugin
 - loader是一个function 
 - plugin是一个类，类似node中间件,可以贯穿整个生命周期。
  
## tree shaking
  - 最早是由rollup作者提出，本质是用于消除无用代码，webpack2增加了该功能。
  - DCE(Dead code elimination) 去除无用代码，tree shaking是DCE的一种实现方式。传统DCE是消除不可用代码，tree shaking是消除没有用到的代码》
  - 减少文件加载体积对js意义重大
  - DCE特征
    - 代码不会被执行，不可到达
    - 代码执行的结果不用被用到
    - 代码只会影响死变量（只写不读）
  - 传统编译器将dead code从ast中删除是通过uglify做到的。
  - Tree Shaking
    - 依赖于ES6的模块性，es6 module特点：
      - 只能作为模块顶层的语句出现
      - import的模块名只能是字符串常量
      - import binding是immutable(不可变)的
    - tree shaking的基础：依赖关系是确定的，和运行时的状态无关，可以进行可靠的静态分析，然后消除
    - 在rollup和webpack2，要用es module synatax才能tree-shaking
    - webpack tree shaking实现：
      - 把所有的import标记为有使用/无使用两种，在后续压缩式进行处理
        - 统一标记import为/* harmony import*/
        - 被使用过export标记为/* harmony export([type])*/
        - 没被使用过的import被标记/* unused harmony export [FuncName]*/  FuncName为export的方法名称
      - 通过uglifyjs（类似其他）工具进行代码精简
  
## rollup,webpack,closure compiler差异
  - 三大工具的tree-shaking对无用代码消除是有限的，closuer complier是最好的。

## webpack5
- 通过持久化缓存提高性能
- 采用更好的持久化缓存算法和默认行为
- 通过优化tree shaking和代码生成来减少bundle体积
- 提高web平台的兼容性
- 清除之前为了webpack4没有不兼容变更导致的不合理的state
- 尝试现在引入重大个更改来为将来的功能做准备，以使我们能够尽可能长时间的使用webpack5
- webpack也可以生成es6的代码

## webpack优化
- 优化图片，使用url-loader优化，将小图片转成base64
  ```
    module: {
      rules: [{
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192,
            outputPath: 'img/'
          }
        }]
      }]
    }
  ```
- 分离第三方包 将第三方包分离出来（如axios,vue,react,vue-router等）
  ```
  // 使用commonsChunkPlugin插件合并所有第三方包
  entry: {
    vendor: ['babel-polyfill', 'axios', 'react',...],
    app: './src/main.js‘
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'verdor',
      filename: 'js/vendor.js',
      minChunks: Infinity
    })
  ]
  // 打包时忽略以下文件
    externals: {
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'axios': 'axios',
      'element-ui': 'ELEMENT'
    },
  ```
- 分离css文件并压缩css文件
- 压缩js文件
  ```
    new UglifyJsPlugin()
  ```
- 压缩Html
  ```
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    })
  ```

## 参考 [https://mp.weixin.qq.com/s/2GaTS9_-ErJf15AIAFdoLw]