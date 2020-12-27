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
## rollup,webpack,closure,compiler差异
## webpack5

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