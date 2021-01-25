## JS与Native通信
  - js -> native
    - JS调用Native通信的三种方式
      - 拦截Scheme
        - IOS中通过UIWebView相关的UIWebViewDelegate协议中的方法做拦截，通过url的协议或者特征字符串来触发。
        - NSURL *url = [request URL] if([[url scheme]] is EqualToString:@"sendEvent")
        - IOS8之后，用WKWebView取代，内存更少，性能更好
        - 通过客户端拦截我们的既定规则的请求，通过callback来回调
        - 缺点：连续调用location.href会出现消息丢失，URL会有长度限制。
      - 弹窗拦截
        - 利用弹窗触发WebView相应事件拦截，比如onJsAlert,onJsConfirm等。缺点UIWebView不支持。
      - 注入JS上下文
        - 利用内置的JSCore框架，通过webview向JS的上下文注入对象和方法，可以让JS直接调用原生。
    - 调用是异步
  - native -> js
    - 直接JS代码字符串，类似js的eval去执行。使用loadUrl、evaluateJavaScript等方法。
    - [webview stringByEvaluatingJavaScriptFromString:@"alert('hello world')"]
    - 调用是同步的

## rn与cordova区别
  - React Native通过JavaScript编写APP的方式，乍看以为是以webview提供的现成的JS与原生语言之间的互调，但是如果当我们调试一个React Native程序的时候，在debug视图中是不会看到任何webview被调用的痕迹。所以，实际上React Native并没有使用现成的与webview的通信方法，而是使用了更直接的JS运行环境，比如在iOS中为系统自带的JavaScriptCore。这与Phonegap这类以webview为主的界面展现与本地能力调用的模式有本质上的区别，也是确保React Native高性能和高效率的基础。


### 参考链接
  - [https://mp.weixin.qq.com/s/T78J3dM9i5TvLu0h6joX3A] JS Bridge通信原理