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

myPromise.race = function(promises) {
  return new myPromise((resolve, reject) => {
    promises.forEach(promise => {
      myPromise.resolve(promise).then(resolve, reject)
    })
  })
}

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

// let promise = new myPromise((resolve, reject) => {
//   console.log('hhh111')
//   setTimeout(() => {
//     resolve('first resolve')
//   }, 1000)
// })
// promise.then(res => {
//   console.log('myPromise1:', res);
//   return new myPromise(resolve => {
//     resolve('second resolve')
//   })
// }).then(res => {
//   console.log('myPromise2: ', res);
//   return new myPromise((resolve, reject) => {
//     reject('first reject')
//   })
// }).catch(err => {
//   console.log('myPromise catch: ', err)
// })

let promise1 = new myPromise(resolve => {
  console.log('hhh222')
  setTimeout(() => {
    console.log('race: mypromise1 success');
    resolve('race:mypromise1')
  }, 1000)
})

let promise2 = new myPromise((resolve, reject) => {
  console.log('hhh333')
  setTimeout(() => {
    console.log('race: mypromise2 success');
    reject('race:mypromise2')
  }, 2000)
})

// myPromise.race([promise1, promise2]).then(res => {
//   console.log('mypromise race result: ', res)
// }).catch(err => {
//   console.warn('mypromise race error: ' + err)
// })

myPromise.all([promise1, promise2]).then(res => {
  console.log('mypromise all result: ', res)
}).catch(err => {
  console.warn('mypromise all error: ' + err)
})

// Promise
// let promise3 = new Promise(resolve => {
//   setTimeout(() => {
//     console.log('promise3 success');
//     resolve('promise3')
//   }, 1000)
// })

// let promise4 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     console.log('promise4 success');
//     resolve('promise4')
//   }, 2000)
// })

// Promise.race([promise3, promise4]).then(res => {
//   console.log('promise race result: ', res)
// }).catch(err => {
//   console.log('promise race error: ', err)
// })

// Promise.all([promise3, promise4]).then(res => {
//   console.log('promise all result: ', res)
// }).catch(err => {
//   console.log('promise all error: ', err)
// })