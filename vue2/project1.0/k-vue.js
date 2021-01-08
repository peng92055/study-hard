class KVue {

  constructor(options) {
    this.$options = options;
    this.$data = options.data;

    observe(this.$data);

    //临时代理
    proxy(this, '$data')

    new Compiler(options.el, this)
  }
}

const watchers = [];

class Watcher {
  constructor(vm, key, updateFn) {
    this.vm = vm;
    this.key = key;
    this.updateFn = updateFn;

    Dep.target = this;
    this.vm[this.key];
    Dep.target = null;
  }

  update() {
    this.updateFn.call(this.vm, this.vm[this.key])
  }
}

// 每个key对应有一个观察者对象，当key发生变化，会通知所有使用key的watcher来更新
class Dep {
  constructor() {
    this.deps = [];
  }

  addDep(dep) {
    this.deps.push(dep)
  }

  notify() {
    this.deps.forEach(dep => dep.update())
  }
}

class Observer {
  constructor(value) {
    this.value = value;

    if (typeof value === 'object') {
      this.walk(value)
    }
  }

  walk(obj) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key])
    })
  }
}

function observe(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return
  }

  new Observer(obj)
}

function defineReactive(obj, key, val) {
  observe(val)

  const dep = new Dep()

  Object.defineProperty(obj, key, {
    get() {
      console.log('get ' + key);
      Dep.target && dep.addDep(Dep.target)
      return val
    },
    set(newVal) {
      if (newVal !== val) {
        console.log('set ' + key + ':' + newVal);
        val = newVal;
        dep.notify()
      }
    }
  })
}

function proxy(vm, sourceKey) {
  Object.keys(vm[sourceKey]).forEach(key => {
    Object.defineProperty(vm, key, {
      get() {
        return vm[sourceKey][key]
      },
      set(newValue) {
        vm[sourceKey][key] = newValue
      }
    })
  })
}


const arrayProto = Array.prototype
const arrayMethods = object.create(arrayProto);

['push', 'pop', 'shift', 'unshift', 'splice', 'sort','reverse'].forEach(function(method) {
  const original = arrayProto[method]
  Object.defineProperty(arrayMethods, method, {
    value: function(...args) {
      const result = original.apply(this, args);
      const ob = this.__ob__;
      let insertd;
      switch(method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;
        case 'splice':
          insertd = args.slice(2)
          break
      }
      if(insertd) ob.observeArray(inserted)
      ob.dep.notify()
      return result
    },
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
})