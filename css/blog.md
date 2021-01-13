# CSS常见问题
  1. BFC是什么，能解决什么问题
    - BFC(Block Formatting Context)块级格式化上下文 
    - 在BFC中，每个元素左外边与包含块的左边相接触，即时存在浮动也是如此。除非这个元素也创建了新的BFC。可以理解为BFC有自己的结界。
    - BFC的结界特性用途： 去margin重叠或清除float带来的影响，也就是说触发BFC的时候，就不需要清除浮动操作。BFC最重要的用途是实现更健壮、更智能的自适应布局。
    - 触发BFC的常见情况：
      - <html>根元素
      - float的值不为none;
      - overflow的值为auto,scroll或hidden
      - display的值为table-cell,table-caption或inline-block;
      - position的值不为relative和static
  2. 垂直居中
  3. css写一个环状进度条
  4. css写一个三角形
    ```
      width: 0;
      height: 0;
      border-width: 10px;
      border-top-color: red;
      border-bottom-color: transparent;
      border-left-color: transparent;
      border-right-color: transparent;
    ``` 
  5. position为relative的元素 可以使用top、left进行定位吗？
    - 可以使用
    - position:relative的特性是相对自身，无侵入。
    - 相对定位元素left/top/right/bottom的百分比值是相对于包含块计算，而不是自身。
    - relative最小化影响原则
  6. 盒模型
    - 标准盒模型： width=content  box-sizing: content-box
    - IE盒模型： width=content+padding+border  box-sizing: border-box
  7. 文本单行和多行溢出省略
    - 单行
      ```
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      ```   
    - 多行
      ```
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical
      ``` 