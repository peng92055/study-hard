console.log('BEGIN Promise Coding....')

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(executor) {
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
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  catch (onRejected) {
    return this.then(null, onRejected)
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : error => { throw error }
    return new MyPromise((resolve, reject) => {
      const handler = (callback) => {
        try {
          const result = callback(this.value)
          if (result instanceof MyPromise) {
            result.then(resolve, reject)
          } else {
            resolve(result)
          }
        } catch (error) {
          reject(error)
        }
      }
      if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(() => handler(onFulfilled));
        this.onRejectedCallbacks.push(() => handler(onRejected));
      } else if (this.status === FULFILLED) {
        setTimeout(() => handler(onFulfilled))
      } else {
        setTimeout(() => handler(onRejected))
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

MyPromise.resolve = (value) => {
  return new MyPromise((resolve, reject) => {
    if (value instanceof MyPromise) {
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
        if (resolveCount >= length) {
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
  }, {
    name: 'a2',
    children: [
      { name: 'b2', children: [{ name: 'e2' }] },
      { name: 'c2', children: [{ name: 'f2' }] },
      { name: 'd2', children: [{ name: 'g2' }] },
    ]
  }]
}

function dfs1(node, nodeList = []) {
  if (!node) return nodeList;
  nodeList.push(node)
  let children = node.children
  if (children) {
    for (let i = 0; i < children.length; i++) {
      dfs1(children[i], nodeList)
    }
  }
  return nodeList
}

const nodes1 = dfs1(data);

function dfs2(node, nodeList = []) {
  let stack = [];
  if (!node) return nodeList;
  stack.push(node);
  console.log(stack)
  while (stack.length) {
    let n = stack.pop();
    nodeList.push(n);
    let children = n.children;
    if (children) {
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push(children[i])
      }
    }
  }
  return nodeList
}

function bfs(node, nodeList = []) {
  if (!node) return nodeList;
  let quene = [];
  quene.push(node);
  while (quene.length) {
    let n = quene.shift(); //取出第一个
    nodeList.push(n)
    let children = n.children;
    if (children) {
      for (let i = 0; i < children.length; i++) {
        quene.push(children[i])
      }
    }
  }
  return nodeList
}

const nodes4 = bfs(data)
console.log(data)

// 发布订阅模式
class EventEmmiter {
  constructor() {
    this.events = this.events || new Map()
  }

  on(type, callback) {
    if (!this.events.has(type)) {
      this.events.set(type, callback)
    }
  }

  emit(type) {
    if (this.events.has(type)) {
      let handler = this.events.get(type)
      handler.apply(this, Array.from(arguments).slice(1))
    }
  }

  off(type) {
    if (this.events.has(type)) {
      this.events.delete(type)
    }
  }

  once(type, callback) {
    let self = this;

    function one() {
      callback.apply(self, arguments);
      self.off(type)
    }
    this.on(type, one)
  }

}

const emmiter = new EventEmmiter()
emmiter.on('click', function(args) {
  console.log(args)
})
emmiter.emit('click', { action: 'click1' })
emmiter.emit('click', { action: 'click2' })
emmiter.once('clickOnce', function(args) {
  console.log(args)
})
emmiter.emit('clickOnce', { action: 'clickOnce1' })
emmiter.emit('clickOnce', { action: 'clickOnce2' })

// 观察者模式
class Observe {
  constructor(name) {
    this.name = name
  }
  update() {
    console.log('update...', this.name)
  }
}

class Subscribe {
  constructor() {
    this.observers = new Set()
  }

  addSub(sub) {
    if (!this.observers.has(sub)) {
      this.observers.add(sub)
    }
  }

  notify() {
    this.observers.forEach(ob => ob.update())
  }
}

console.log('-----------------------------并行串行-----------------------------')
const createPromise = function(name, delay) {
  return () => {
    return new Promise(resolve => {
      console.log(`begin oneByOne promise${name}...`);
      setTimeout(() => {
        console.log(`promise oneByOne done${name}`)
        resolve(`promise oneByOne done${name}`)
      }, delay)
    })
  }
}
const promiseTest1 = createPromise('test1', 2000);
const promiseTest2 = createPromise('test2', 3000);
const promises = [promiseTest2, promiseTest1]

function oneByone(promises) {
  promises.reduce((prev, curr) => {
    return prev.then(curr)
  }, Promise.resolve())
}
oneByone(promises)


const promiseTest3 = createPromise('test3', 2000);
const promiseTest4 = createPromise('test4', 3000);
const promises2 = [promiseTest3, promiseTest4]

function all(promises) {
  let _promises = promises.map(fn => fn.apply())
  console.log('_promsies', _promises)
  return Promise.all(_promises)
}

all(promises2).then(value => {
  console.log(value)
})

function autoRefetch(url, max) {
  let times = 0;
  return new Promise((resolve, reject) => {
    const noop = () => {
      times++;
      const promise = new Promise((resolve2, reject2) => {
        setTimeout(() => {
          reject2(`post ${url} error`, 1000)
        }, 2000)
      })
      console.log("autoRefetch times: ", times)
      promise.then(value => resolve(value)).catch(error => {
        if (times >= max) {
          reject(error)
        } else {
          noop()
        }
      })
    }
    noop()
  })
}

autoRefetch('api/login', 3).catch(err => console.log(err))

var entry = {
  a: {
    b: {
      c: {
        dd: 'abcdd'
      }
    },
    d: {
      xx: 'adxx'
    },
    e: 'ae'
  }
}

var output = {
  'a.b.c.dd': 'abcdd',
  'a.d.xx': 'adxx',
  'a.e': 'ae'
}

function convert(entry) {
  const res = Object.create(null);
  const noop = (obj, prefix = '', result = {}) => {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        let keyName = `${prefix}${key}`;
        if (typeof obj[key] === 'object') {
          noop(obj[key], keyName + '.', result)
        } else {
          result[keyName] = obj[key];
        }
      }
    }
  }
  noop(entry, '', res)
  return res
}

console.log('convert1: ', convert(entry))

let list =[
  {id:1,name:'部门A',parentId:0},
  {id:2,name:'部门B',parentId:0},
  {id:3,name:'部门C',parentId:1},
  {id:4,name:'部门D',parentId:1},
  {id:5,name:'部门E',parentId:2},
  {id:6,name:'部门F',parentId:3},
  {id:7,name:'部门G',parentId:2},
  {id:8,name:'部门H',parentId:4}
];
let result = convert2(list);
function convert2(array) {
  let res = [];
  let map = array.reduce((prev, curr) => (prev[curr.id] = curr, prev), {});
  for(let item of Object.values(map)) {
    if(item.parentId === 0) {
      res.push(item)
      continue
    } else if(item.parentId in map) {
      let parent = map[item.parentId]
      parent.children = parent.children || [];
      parent.children.push(item)
    }
  }
  return res
}
console.log(result)

function wait() {
  return new Promise(resolve =>
    setTimeout(resolve, 2 * 1000)
  )
}
  
async function main() {
  console.time();
  const x = wait();
  const y = wait();
  const z = wait();
  await x;
  await y;
  await z;
  console.timeEnd();
}
main();