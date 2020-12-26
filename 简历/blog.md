## 关键词
- 使用yeoman制作cli脚手架，提炼多管理系统公共模块，制作管理系统脚手架并发布内部NPM仓库，脚手架功能： 初始化项目，配置动态菜单、权限控制、请求拦截器、标准登录及数据存储模式、部分业务公共模块及组件、component套件生成等
- 量化功能指标，人天/速率提升performance/js错误率/
- 组件性能优化
- 研发流程优化
- 技术框架和组件库沉淀
- react-native 热更新方案  部署独立热更新服务，并打包docker镜像
- 借鉴vue中 虚拟dom的类型PatchFlags的定义 0<<1 优化权限判断
  - vue或者react |及&处理优势： 将多个类型通过|合并为一个组合值，在通过&来判断单独的值是否在组合中，如果结果和单独的值一致则说明存在，降低用数组来存储，减少空间及数组判断速度 。注意要求多个属性设置为不冲突的二进制数。js二进制数只有32位有效，故而用来优化权限有限制，仅限于32个类型。
- 借鉴浏览器缓存机制优化app数据字典获取机制
<!-- - 制作rn插件，js和native交互，反射~ -->
- 构建基于react-native app壳子的基础建设工作，直接通过webview来访问站点，基础建设工作包含：
  - webview加载失败反馈
  - 网络失败反馈
  - 资源预加载（Html5预打包）
  - 热更新集成
  - 阿里云消息推送
- fontspider plugin

## 学习参考博客 
- https://github.com/Nealyang/PersonalBlog  PersonalBlog Nealyang 全栈前端
- https://mp.weixin.qq.com/s/7rqBKpm55MP6K3KL7FLBaQ   3 年创业公司成长经历 && 面试总结

## 关键思路
- 编写cli脚手架 使用 Yeoman 开发的脚手架，介绍了一下 Yeoman 的能力，用来初始化vue管理系统项目，包好权限控制，请求拦截器，基础页面等功能
- 编写vscode插件
- 学习docker镜像打包部署
- nodejs 常见场景：工具、BFF 应用
- 学习react源码
- 云开发总结
- taro源码学习 taro-cli
- 构思业务技术解决方案模型
- react-native 热更新方案  部署独立热更新服务，并打包docker镜像
- react-native 崩溃日志方案
- 执行gitlab提交前校验规范，降低codeview成本    编码规范，以及一套 ESLint/StyleLint/CommitLintd
- 字节、阿里前端高频核心面试题深度剖析 阿里P8面试官 止水 https://www.bilibili.com/video/BV1mK4y1Z7aQ/
- 字节跳动面试官，我也实现了大文件上传和断点续传 https://juejin.im/post/6844904055819468808
- 使用XXX框架，并增加loader/plugin/中间件/npm 封装了什么功能
- 准备一些runtime的插件 比如做一个UBB的js-parser或者RN插件
- 打包优化 例如做一些针对webpack打包的优化 提升打包编译效率
- 借鉴vue中 虚拟dom的类型PatchFlags的定义 0<<1 优化权限判断
- 借鉴浏览器缓存机制优化app数据字典获取机制
- 制作rn插件，js和native交互，反射~
- 构建基于react-native app壳子的基础建设工作，直接通过webview来访问站点，基础建设工作包含：
  - webview加载失败反馈
  - 网络失败反馈
  - 资源预加载（Html5预打包）
  - 热更新集成
  - 阿里云消息推送
