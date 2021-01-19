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
              // other
              compiler.plugin('event', (compilation, callback) => {
                // 这种形式就表明这是一个异步事件
                // 处理结束后需要调用callback参数，否则流程会被一直卡在这里不会向下运行
                callback()
              })
            }
          }
        ```
    - 编写plugin时，可以访问compiler和compilation,通过钩子webpack执行。
    - 事件流主要流程：
      - entry-option：初始化options
      - run：开始编译
      - make：从entry开始递归的分析依赖，对每个依赖模块进行build
      - before-resolve - after-resolve： 对其中一个模块位置进行解析
      - build-module ：开始构建 (build) 这个module,这里将使用文件对应的loader加载
      - normal-module-loader：对用loader加载完成的module(是一段js代码)进行编译,用 acorn 编译,生成ast抽象语法树。
      - program： 开始对ast进行遍历，当遇到require等一些调用表达式时，触发 call require 事件的handler执行，收集依赖，并。如：AMDRequireDependenciesBlockParserPlugin等
      - seal： 所有依赖build完成，下面将开始对chunk进行优化，比如合并,抽取公共模块,加hash
      - optimize-chunk-assets：压缩代码，插件 UglifyJsPlugin 就放在这个阶段
      - bootstrap： 生成启动代码
      - emit： 把各个chunk输出到结果文件
  
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

### webpack异步加载原理
  - 首先异步加载的模块，webpack在打包的时候会将独立打包成一个js文件（webpack如何将异步加载的模块独立打包成一个文件）(打包出来的文件开头(window["webpackJsonp"]=window["webpackJsonp"]||[]).push()）
  - 然后需要加载异步模块的时候：
  - 2.1 创建script标签，src为请求该异步模块的url，并添加到document.head里，由浏览器发起请求。
  - 2.2 请求成功后，将异步模块添加到全局的__webpack_require__变量(该对象是用来管理全部模块)后
  - 2.3 请求异步加载文件的import()编译后的方法会从全局的__webpack_require__变量中找到对应的模块
  - 2.4 执行相应的业务代码并删除之前创建的script标签
  - 异步加载文件里的import()里的回调方法的执行时机，通过利用promise的机制来实现的

  - webpackJsonp：chunk文件加载后的callback函数，主要将文件中的模块存储到modules对象中，同时标记chunk文件的下载情况，对于入口chunk来说，等所有的模块都放入modules之后，执行入口模块函数。

  - __webpack_require__：模块加载函数，加载的策略是：根据moduleid读取，优先读取缓存installedModules，读取失败则读取modules，获取返回值，然后进行缓存。

### 插件功能：自动生成README文件，标题取自插件option 

 ```
  const MY_PLUGIN_NAME = "MyReadMePlugin";  
  
  // 插件功能：自动生成README文件，标题取自插件option  
  class MyReadMePlugin {  
    
    constructor(option) {  
      this.option = option || {};  
    }  
    
    apply(compiler) {  
      compiler.hooks.emit.tapAsync(  
        MY_PLUGIN_NAME,  
        (compilation, callback) => {  
          compilation.assets["README.md"] = {  
            // 文件内容  
            source: () => {  
              return `# ${this.option.title || '默认标题'}`;  
            },  
            // 文件大小  
            size: () => 30,  
          };  
          callback();  
        }  
      );  
    }  
  }  
    
  // 7、模块导出  
  module.exports = MyReadMePlugin;  
 ```


## 参考 
- [https://mp.weixin.qq.com/s/2GaTS9_-ErJf15AIAFdoLw]
- [https://www.cnblogs.com/libin-1/p/6938581.html]
