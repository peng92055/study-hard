## 怎么画1px像素线，逻辑像素,物理像素的概念
- css像素是没有实际大小的抽象单位，它是一个相对长度，相对于显示器的分辨率。
- 物理像素在设备中是固定的，由分辨率决定，代表设备实际拥有的像素点。Retina 2倍屏幕说的就是物理像素。
- 逻辑像素是一个抽象概念。css像素使用的就是逻辑像素。例如retina屏幕，1pxcss像素等于4个物理像素。
- 实现真正的1px物理像素
- devicePixelRatio可以获取设备物理像素分辨率与 CSS 像素分辨率的比率
  - ios8+ 可以支持0.5px写法，可以动态获取设备的devicePixelRatio，统一增加css hack,将border-width设置成0.5px。
  - 伪类+transform
    - 使用伪类元素before或者after重做border,并将transform:scale(0.5)
  - viewport+rem
    - devicePixelRatio为2时设置<mata name='viewport' content='width=device-width, initial-scale=0.5,maximum-scale=0.5, minimum-scale=0.5, user-scalable=no'>
    - devicePixelRatio为3时设置<mata name='viewport' content='width=device-width, initial-scale=0.33333333,maximum-scale=0.33333333, minimum-scale=0.33333333, user-scalable=no'>
  - border-image or background-image
    - 使用2倍的边框为1px的图，将border-weidth设置为1px。



## 参考[https://mp.weixin.qq.com/s/IrV0-v3v5Cl969yFCI58Rg]
