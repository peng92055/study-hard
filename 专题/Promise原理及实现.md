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
      if(value instanceof myPromise) {
        return value.then(self.resolve, self,reject)
      }
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
    try {
      callback(self.resolve, self.reject)
    } catch(e) {
      self.reject(e)
    }
  }

  myPromise.prototype.then = function(onFulfilled, onRejected) {
    // this.onResolvedCallbacks.push(onFulfilled);
    // this.onRejectedCallbacks.push(onRejected);
    
    let self = this;
    // 规范2.2.1 onFulfilled和onRejected 都是可选参数，并且如果不是函数需要忽略，且值穿透
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : error => { throw error };

    return new myPromise((resolve, reject) => {
      function handle(callback) {
        try {
          const result = callback(self.value)
          if(result instanceof myPromise) {
            result.then(resolve, reject)
          } else {
            resolve(result)
          }
        } catch (error) {
          reject(error)
        }
      }

      if(self.status === PENDING) {
        self.onResolvedCallbacks.push(() => handle(onFulfilled));
        self.onRejectedCallbacks.push(() => handle(onRejected));
      } else if(self.status === FULFILLED) {
        setTimeout(() => {
          handle(onFulfilled)
        })
      } else {
        setTimeout(() => {
          handle(onRejected)
        })
      }
    })
  };

  myPromise.prototype.catch = function(onRejected) {
    return this.then(null, onRejected)
  }

  myPromise.prototype.finally = function(callback) {
    return this.then(function(value) {
      return myPromise.resolve(callback()).then(() => value)
    }, function(err) {
      return myPromise.resolve(callback()).then(() => { throw err })
    })
  }

  myPromise.resolve = function(value) {
    return new myPromise((resolve, reject) => {
      if(value instanceof myPromise) {
        value.then(resolve, reject)
      } else {
        resolve(value)
      }
    })
  }

  myPromise.reject = function(error) {
    return new myPromise((resolve, reject) => {
      reject(error)
    })
  }
```
## 手写promise.race
  ```
    myPromise.race = function(promises) {
      return new myPromise((resolve, reject) => {
        promises.forEach(promise => {
          myPromise.resolve(promise).then(resolve, reject)
        })
      })
    }
  ```

## 手写promise.all
  ```
    myPromise.all = function(promises) {
      //成功的数据集合
      const resolveValues = new Array(promises.length);
      let resolveCount = 0;
      return new myPromise((resolve, reject) => {
        promises.forEach((promise, index) => {
          myPromise.resolve(promise).then(value => {
            resolveValues[index] = value;
            resolveCount++;
            if(resolveCount === resolveValues.length) {
              resolve(resolveValues)
            }
          }).catch(err => {
            reject(err)
          })
        })
      })
    }
  ```

### 参考链接
- [https://www.ituring.com.cn/article/66566]
- [https://github.com/sisterAn/blog/issues/13]
- [https://blog.csdn.net/cc_together/article/details/105454045] 最优