# Promise/A+
  - Promise是一种规范，是一套处理JavaScript异步的机制
  - ES6遵循Promise/A+规范
  - Promise本质只一个状态机,每个promise有三种状态：pending、fulfilled和rejected。状态改变只能从pending -> fulfilled 或者pending -> rejected。不可逆。fulfilled多以resolve来指代。
  - then方法必须返回一个新的Promise。可以多次调用。
  - 值可以穿透。
## 简单实用
```
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('hello promise')
      resolve('success')
    }, 1000)
  })
  promise.then(res => console.log(res)).catch(err => console.log(err))
```
## 手写promise
```
  // 简单版本，不支持then链式调用
  const PENDING = 'pending';
  const FULFILLED = 'fulfilled';
  const REJECTED = 'rejected';

  function myPromise(callback) {
    var self = this;
    //定义初始值 （void 0 返回undefined,防止undefined在老浏览器中被篡改）
    self.value = void 0;
    //定义当前状态机
    self.status = PENDING;
    //定义成功状态时的回调函数集合
    self.onResolvedCallbacks = [];
    //定义失败状态时的回调函数集合
    self.onRejectedCallbacks = [];

    //定义resolve方法和reject方法
    self.resolve = function(value) {
      //将回调任务放在JS引擎的任务队列中
      setTimeout(() => {
        // 可能有多个回调函数
        if(self.status === PENDING) {
          self.status = FULFILLED;
          self.value = value;
          self.onResolvedCallbacks.forEach(cb => cb(value))
        }
      })
    }

    self.reject = function(error) {
      setTimeout(() => {
        if(self.status === PENDING) {
          self.status = REJECTED;
          self.value = error;
          self.onRejectedCallbacks.forEach(cb => cb(error))
        }
      })
    }

    //执行callback函数，并传递resolve和reject方法
    callback(self.resolve, self.reject)
  }

  myPromise.prototype.then = function(onFulfilled, onRejected) {
    this.onResolvedCallbacks.push(onFulfilled);
    this.onRejectedCallbacks.push(onRejected);
  };

  let promise = new myPromise((resolve, reject) => {
    resolve('success');
  });
  promise.then(value => {
    console.log('promise resolve: ', value)
  }, error => {
    console.log('promise reject: ', error)
  })
```
## 手写promise.all
## 手写promise.race

### 参考链接
- [https://www.ituring.com.cn/article/66566]
- [https://github.com/sisterAn/blog/issues/13]