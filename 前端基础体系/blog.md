# 前端基础知识体系

## JavaScript
- 运行时
  - 数据结构
    - 类型 Undefined Null String Number Array Object Symbol
      1. 为什么有的编程规范要求用void 0 代替undefined? 因为undefined在javascript中是变量，不是关键词，所以避免被更改,建议使用void运算来把任意一个表达式变成undefined值
      2. 字符串是否有最大长度？ 表示文本数据，最长长度为2**53-1,但实际string表示的是字符串UTF16的编码，最大长度受编码长度影响
    - 实例
  - 执行过程
    - 事件循环
      - 宿主发起的任务称为宏观任务，把JS引擎发的任务称为微观任务
      - 实现一个sleep
        ```
          function sleep(duration){
            return new Promise((resolve, reject) => {
              setTimeout(resolve, duration)
            })
          }

          sleep(5000).then(() => console.log('hhh'))
        ```
      - 实现一个红绿灯
        ```
          function sleep(duration) {
            return new Promise(resolve => {
              setTimeout(resolve, duration)
            })
          }

          async function changeColor(duration, color){
            document.getElementById('traffic').style.background = color
            await sleep(duration)
          }

          async function main() {
            while(true){
              await changeColor(3000, 'green')
              await changeColor(1000, 'yellow')
              await changeColor(2000, 'red')
            }
          }

          main()
        ```  
    - 微任务执行
    - 函数执行
      - 闭包、作用域、执行上下文、this值
        - 闭包是绑定了执行环境的函数（注意，不能理解为作用域或者上下文，本质就是一个函数，与普通函数的区别就在于携带了执行的环境）
        - 执行上下文是执行的基础设施，js标准中，把一段代码（包括函数），执行所需要的所有信息定义为“执行上下文”
        - this是执行上下文很重要的一部分，普通函数的this值由“调用它所使用的引用”决定。其中奥秘就在于：我们获取函数的表达式，它实际上返回的并非函数本身，而是一个 Reference 类型。
        - call apply bind
        - 函数种类： 
          - 普通函数，使用function定义
          - 箭头函数，使用=>
          - 方法，在class中定义的函数
          - 生成器函数 用function*定义的函数
          - 类，用class定义的类
          - 异步函数，普通函数、箭头函数、生成器函数加上async
    - 语句级的执行
      - 每个语句执行都会返回相应的completion record
- 文法
  - 词法
    - 空白字符 whitespace
    - 换行符 lineTerminator
    - 注释 comment
    - 词Token
      - indentifierName 标识符，关键字就在其内
        - 关键字: await break case catch class const continue debugger default delete do else export extends finally for function if import instance of new return super switch this throw try typeof var void while with yield (enum, null, true, false)
      - Punctuator 符号，运算符和大括号等符号
      - NumericLiteral 数字直接量
        - 12.toString() Invalid or unexpectred token
        - 原因是数字直接量可以支持十进制数，而十进制可以带小数，并且小数前后都可以省略，但是不能同时省略。例如.12,12.,12.01都是可以的。所以当12.toString()时，会把12.当做一个被省略的数字，看成单独一个整体，就缺少了函数调用“.”，要想成功调用，加入空格即可“12 .toString()或者12..toString()”
      - StringLIteral 字符串直接量
      - RegularExpressionLiteral 正则表达式直接量 
      - Template 字符串模板
  - 语法
    - 到底要不要写分号： 尤雨溪曾经在知乎说：真正会导致上下行解析出问题的 token 有 5 个：括号，方括号，正则开头的斜杠，加号，减号。我还从没见过实际代码中用正则、加号、减号作为行首的情况，所以总结下来就是一句话：一行开头是括号或者方括号的时候加上分号就可以了，其他时候全部不需要。哦当然再加个反引号。
    - js程序有两种源文件：脚本和模块。模块是在es6引入的机制。脚本具有主动性的 JavaScript 代码段，是控制宿主完成一定任务的代码；而模块是被动性的 JavaScript 代码段，是等待被调用的库。
    - script 标签如果不加type=“module”，默认认为我们加载的文件是脚本而非模块，如果我们在脚本中写了 export，当然会抛错。
    - js语法的全局机制： 预处理（先声明，后执行）和指令序言(严格模式)
  - Bitmask技术 按位或运算常常被用在一种叫做 Bitmask 的技术上
- 语义

## HTML和CSS
  - 从 HTML 5 开始，我们有了 section 标签，这个标签可不仅仅是一个“有语义的 div”，它会改变 h1-h6 的语义。section 的嵌套会使得其中的 h1-h6 下降一级 

## 浏览器实现原理与API
- 实现原理，浏览器会尽量流式处理整个过程
  - 解析
    - 把一个URL变成屏幕上显示的网页过程
      - DNS解析域名，通过ip主机地址及HTTP或者HTTPS协议访问服务器请求页面
      - 将请求回来的HTML代码解析成DOM树
      - 计算DOM树的CSS属性
      - 根据css属性对元素逐个进行渲染，得到内存中的位图
      - 一个可选的步骤是对位图进行合并，可以极大提高后续绘制速度
      - 将合成后的位图绘制到界面上
    - HTTP1.1协议（rfc规定的协议）
      - 基于TCP协议
      - 请求分为： 
        - 请求行（method,path,version) eg: POST /chapther/user.html HTTP/1.1
        - 请求头(accept,accept-encoding, accept-language,cache-control, connection,host,**if-modified-since**,**if-none-match**, user-agent, cookie)
        - 请求体,请求参数
          - application/json 
          - application/x-www-form-urlencoded 表单数据默认行为
          - multipart/form-data 上传文件常用
          - text/html
      - 响应与请求类似
        - 响应头（cache-control,connection, content-encoding, content-length, content-type, date, **etag**, expires, keep-alive, **last-modified**, server, set-cookie, via(服务端请求链路)）
      - HTTP status code
        - 1xx 临时回应，表示客户端继续，被浏览器http库直接处理
        - 2xx 请求成功系列 例如：200
        - 3xx 请求目标有变化，希望客户端进一步处理 301&302 304(**重点**)
        - 4xx 客户端请求错误 403无权限 404页面不存在
        - 5xx 服务端请求错误 500服务端错误 503服务端暂时性错误，可以一会再试
    - HTTPS协议
      - 使用加密通道来传输http的内容。首先与服务端建立TLS加密通道。
      - TLS构建于TCP协议之上
    - HTTP2.0 （1.1的升级）
      - 支持服务端推送， 可以在收到第一个请求到服务端时，提前将一部分内容推送给客户端放入缓存
      - 支持TCP连接复用， 可以把使用同一个tcp来传输多个http请求，避免tcp连接建立时的三次握手开销
  - 构建DOM树
    - 字符流 -> 状态机 -> 词token -> 栈 -> DOM树
  - 计算CSS
    - 在构建dom的过程就同步将css属性计算出来，因为浏览器是流式处理
    - 通过选择器（匹配器）给节点附带css属性
  - 渲染、合并和绘制
    - 渲染：把模型变成位图的过程。位图是内存里简历的一张二维表格，把一张图片的每个像素对应的颜色保存进去。位图信息也是DOM树中占据浏览器内存最多的信息，我们在做内存优化时，主要考虑的就是这部分。
    - 浏览器渲染过程，就是将每个元素对应的盒变成位图。一个元素可能对应多个盒。每一个盒对应一张位图。
    - 渲染总体分为图形和文字。
    - 利用will-change可以提高合成策略效果
    - 将位图最终绘制到屏幕上的过程就是绘制。脏矩形算法，将屏幕均匀的分成若干矩形区域。
- API
  - DOM
  - CSSOM
  - 事件
  - API总集合
  
## 前端工程实践
- 性能
- 工具链
- 持续集成
- 搭建系统
- 构架与基础库