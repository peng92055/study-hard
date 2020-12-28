## setTimeout
```
  // 利用requestAnimationFrame实现
  function settimeout(fn, delay) {
    let start = new Date().getTime()
    const loop = () => {
      timer = window.requestAnimationFrame(loop)
      now = new Date().getTime()
      if(now - start >= delay) {
        fn.apply(this, arguments)
        window.cancelAnimationFrame(timer)
      }
    }
    window.requestAnimationFrame(fn)
  }

  function foo (name) {
    console.log(name)
  }
  setTimeout(() => {
    foo('name')
  }, 1000)

  settimeout(() => {
    foo('name')
  }, 2000)
```

### 参考链接
- [https://github.com/sisterAn/JavaScript-Algorithms/issues/98]