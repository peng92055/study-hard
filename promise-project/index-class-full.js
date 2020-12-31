console.log('begin promise coding...');
console.log('*************************************')

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {

  constructor(excutor) {
    this.status = PENDING;
    this.value = void 0;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (value instanceof MyPromise) {
        return value.then(resolve, reject)
      }
      setTimeout(() => {
        if (this.status === PENDING) {
          this.status = FULFILLED;
          this.value = value;
          this.onFulfilledCallbacks.forEach(cb => cb(value))
        }
      })
    }

    const reject = (error) => {
      setTimeout(() => {
        if (this.status === PENDING) {
          this.status = REJECTED;
          this.value = error;
          this.onRejectedCallbacks.forEach(cb => cb(error))
        }
      })
    }

    try {
      excutor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  catch (onRejected) {
    return this.then(null, onRejected)
  }

  then(onFulfilled, onRejected) {
    let self = this;
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : error => { throw error };
    return new MyPromise((resolve, reject) => {
      function handle(callback) {
        try {
          const result = callback(self.value);
          if (result instanceof MyPromise) {
            result.then(resolve, reject)
          } else {
            resolve(result)
          }
        } catch (error) {
          reject(error)
        }
      }
      if (self.status === PENDING) {
        this.onFulfilledCallbacks.push(() => handle(onFulfilled));
        this.onRejectedCallbacks.push(() => handle(onRejected));
      } else if (self.status === FULFILLED) {
        setTimeout(() => {
          handle(onFulfilled)
        })
      } else {
        setTimeout(() => {
          handle(onRejected)
        })
      }
    })
  }

  finally(onFinally) {
    return this.then(value => {
      return MyPromise.resolve(onFinally()).then(() => value)
    }).catch(error => {
      return MyPromise.resolve(onFinally()).then(() => { throw error })
    })
  }
}

MyPromise.resolve = function(value) {
  return new MyPromise((resolve, reject) => {
    if (value instanceof MyPromise) {
      value.then(resolve, reject)
    } else {
      resolve(value)
    }
  })
}

MyPromise.reject = function(error) {
  return new MyPromise((resolve, reject) => {
    reject(error)
  })
}

MyPromise.race = function(promises) {
  return new MyPromise((resolve, reject) => {
    promises.forEach(promise => {
      MyPromise.resolve(promise).then(resolve, reject)
    })
  })
}

MyPromise.all = function(promises) {
  let resolveCount = 0;
  const length = promises.length;
  const resolveValues = new Array(length);
  return new MyPromise((resolve, reject) => {
    promises.forEach((promise, index) => {
      MyPromise.resolve(promise).then(value => {
        resolveValues[index] = value;
        resolveCount++;
        if (resolveCount >= length) {
          resolve(resolveValues)
        }
      }).catch(err => {
        reject(err)
      })
    })
  })
}

// const promise = new MyPromise((resolve, reject) => {
//   console.log('promise test start...')
//   setTimeout(() => {
//     console.log('promise begin resolve')
//     resolve('success')
//   }, 1000)
// })

// promise.then(value => {
//   console.log('promise init: **', value, '**in then')
//   return MyPromise.resolve('resolve 2')
// }).then(value => {
//   console.log('promise second: **', value, '** in then')
//   return MyPromise.reject('reject 1')
// }).catch(err => {
//   console.log('promise init: **', err, '**in error')
// })

const promise1 = new MyPromise((resolve, reject) => {
  console.log('promise1 race or all test start...')
  setTimeout(() => {
    console.log('promise2 race or all begin resolve')
    resolve('promsie1 success')
  }, 1000)
})
const promise2 = new MyPromise((resolve, reject) => {
  console.log('promise2 race or all test start...')
  setTimeout(() => {
    console.log('promise2 race or all begin resolve')
    resolve('promise2 success')
  }, 600)
})

// MyPromise.race([promise1, promise2]).then(res => {
//   console.log('promise race result: ', res)
// }).catch(err => {
//   console.log('promise race catch: ', err)
// })

MyPromise.all([promise1, promise2]).then(res => {
  console.log('promise all result: ', res)
}).catch(err => {
  console.log('promise all catch: ', err)
}).finally(() => {
  console.log('promise finally!')
})


console.log('end promise coding...');
console.log('*************************************')