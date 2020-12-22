const isObject = v => typeof v === 'object'
//利用proxy
function reactive(obj) {
  //进来的必须是对象
  if(!isObject(obj)) {
    return obj
  }
  //对于传入的obj做响应式处理
  return new Proxy(obj, {
    get(target, key, receiver) {
      //读取操作拦截
      const res = Reflect.get(target, key)
      console.log('get', res)
      //依赖收集
      track(target, key)
      return isObject(res) ? reactive(res) : res
    },
    set(target, key, val, receiver) {
      //写操作的拦截
      const res = Reflect.set(target, key, val)
      console.log('set', key)
      trigger(target, key)
      return res
    },
    deleteProperty(target, key) {
      //删除属性的拦截
      const res = Reflect.deleteProperty(target, key)
      console.log('delete', res)
      trigger(target, key)
      return res
    }
  })
}

//将effect和target，key映射关系保存  {target<Object>: {key<String>: [cb1, cb2...]<Set>}<Map>}<WeakMap>

//保存依赖函数数组
const effectStack = []

// 将依赖函数执行并保存
function effect(fn) {
  //创建高阶函数
  const e = createReactiveEffect(fn)
  
  e()

  return e
}

function createReactiveEffect(fn) {
  const effect = function reactiveEffect() {
    try {
      effectStack.push(effect)
      return fn()
    } finally {
      effectStack.pop()
    }
  }
  return effect
}

// 保存依赖函数和对象的映射关系
const targetMap = new WeakMap()

// 建立依赖函数和对象的映射关系
function track(target, key) {
  const effect = effectStack[effectStack.length - 1]
  if(effect) {
    let depMap = targetMap.get(target)
    if(!depMap) {
      depMap = new Map()
      targetMap.set(target, depMap)
    }

    let deps = depMap.get(key)
    if(!deps) {
      deps = new Set()
      depMap.set(key, deps)
    }

    //将当前活动的响应式函数放入deps中
    deps.add(effect)
  }
}

//触发函数
function trigger(target, key) {
  //获取刚才的映射关系,执行他们
  const depMap = targetMap.get(target)
  if(!depMap){
    return
  }

  const deps = depMap.get(key)
  if(deps) {
    deps.forEach(dep => dep())
  }
}

const obj = reactive({foo: 'foo', n: {a: 1}})
// obj.foo
// obj.n.a
// obj.n.a = 12
// obj.n.a
effect(() => {
  console.log('effect1', obj.foo)
})
effect(() => {
  console.log('effect2', obj.foo)
})
obj.foo = 'foooooooo'