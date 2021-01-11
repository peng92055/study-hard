console.log('BEGIN Promise Coding....')

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
      if(value instanceof MyPromise) {
        return value.then(resolve, reject)
      }
      setTimeout(() => {
        if(this.status === PENDING) {
          this.status = FULFILLED;
          this.value = value;
          this.onFulfilledCallbacks.forEach(cb => cb(value))
        }
      })
    }

    const reject = (error) => {
      setTimeout(() => {
        if(this.status === PENDING) {
          this.status = REJECTED;
          this.value = error;
          this.onRejectedCallbacks.forEach(cb => cb(error))
        }
      })
    }

    try {
      excutor(resolve, reject)
    } catch(error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    let self = this;
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : error => { throw error };
    return new MyPromise((resolve, reject) => {
      function handler(callback) {
        try {
          const result = callback(self.value);
          if(result instanceof MyPromise) {
            result.then(resolve, reject)
          } else {
            resolve(result)
          }
        } catch (error) {
          reject(error)
        }
      }
      if(self.status === PENDING) {
        self.onFulfilledCallbacks.push(() => handler(onFulfilled));
        self.onRejectedCallbacks.push(() => handler(onRejected));
      } else if(self.status === FULFILLED) {
        setTimeout(() => {
          handler(onFulfilled)
        })
      } else {
        setTimeout(() => {
          handler(onRejected)
        })
      }
    })
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }

  finally(onFinally) {
    return this.then(value => {
      return MyPromise.resolve(onFinally()).then(() => value);
    }).catch(error => {
      return MyPromise.resolve(onFinally()).then(() => { throw error });
    })
  }
}

MyPromise.resolve = (value) => {
  return new MyPromise((resolve, reject) => {
    if(value instanceof MyPromise) {
      value.then(resolve, reject)
    } else {
      resolve(value)
    }
  })
}

MyPromise.reject = (error) => {
  return new MyPromise((resolve, reject) => {
    reject(error)
  })
}

MyPromise.race = (promises) => {
  return new MyPromise((resolve, reject) => {
    promises.forEach(promise => {
      MyPromise.resolve(promise).then(resolve, reject)
    })
  })
}

MyPromise.all = (promises) => {
  const length = promises.length;
  const resolveValues = new Array(length);
  let resolveCount = 0;
  return new MyPromise((resolve, reject) => {
    promises.forEach((promise, index) => {
      MyPromise.resolve(promise).then(value => {
        resolveValues[index] = value;
        resolveCount++;
        if(resolveCount >= length) {
          resolve(resolveValues)
        }
      }).catch(error => {
        reject(error)
      })
    })
  })
}

let promise = new MyPromise((resolve, reject) => {
  resolve('111')
})

promise.then(res => {
  console.log('res', res)
}).catch(err => {
  console.log('err', err)
}).finally(() => {
  console.log('finally')
})

const promise1 = new MyPromise((resolve, reject) => {
  console.log('promise1 race or all test start...')
  setTimeout(() => {
    console.log('promise1 race or all begin resolve')
    resolve('promsie1 success')
  }, 1000)
})
const promise2 = new MyPromise((resolve, reject) => {
  console.log('promise2 race or all test start...')
  setTimeout(() => {
    console.log('promise2 race or all begin resolve')
    resolve('promise2 success')
  }, 1600)
})

MyPromise.race([promise1, promise2]).then(res => {
  console.log('promise race result: ', res)
}).catch(err => {
  console.log('promise race catch: ', err)
})

MyPromise.all([promise1, promise2]).then(res => {
  console.log('promise all result: ', res)
}).catch(err => {
  console.log('promise all catch: ', err)
}).finally(() => {
  console.log('promise finally!')
})


const data = {
  name: 'root',
  children: [{
    name: 'a',
    children: [
      { name: 'b', children: [{ name: 'e' }] },
      { name: 'c', children: [{ name: 'f' }] },
      { name: 'd', children: [{ name: 'g' }] },
    ]
  },{
    name: 'a2',
    children: [
        { name: 'b2', children: [{ name: 'e2' }] },
        { name: 'c2', children: [{ name: 'f2' }] },
        { name: 'd2', children: [{ name: 'g2' }] },
    ]
  }]
}
function dfs1(node, nodeList = []) {
  console.log('dfs1', node.name)
  if(!node) return nodeList;
  nodeList.push(node)
  let children = node.children
  if(children) {
    for(let i = 0; i < children.length; i++) {
      dfs1(children[i], nodeList)
    }
  }
  return nodeList
}

const nodes1 = dfs1(data);

function dfs2(node, nodeList = []) {
  let stack = [];
  if(!node) return nodeList;
  stack.push(node);
  console.log(stack)
  while(stack.length) {
    let n = stack.pop();
    console.log('dfs2',n.name)
    nodeList.push(n);
    let children = n.children;
    if(children) {
      for(let i = children.length - 1; i >= 0; i--) {
        stack.push(children[i])
      }
    }
  }
  return nodeList
}

function bfs(node, nodeList = []) {
  if(!node) return nodeList;
  let quene = [];
  quene.push(node);
  while(quene.length) {
    let n = quene.shift(); //取出第一个
    console.log('bfs', n.name)
    nodeList.push(n)
    let children = n.children;
    if(children) {
      for(let i = 0; i < children.length; i++) {
        quene.push(children[i])
      }
    }
  }
  return nodeList
}

const nodes4 = bfs(data)
console.log(data)
