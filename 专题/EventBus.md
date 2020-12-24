## event bus
```
  class EventEmmitter {
    constructor() {
      this.events = this.events || new Map()
    }

    addListener(type, fn) {
      if(!this.events.get(type)) {
        this.events.set(type, fn)
      }
    }

    emit(type) {
      let handle = this.events.get(type)
      handle.apply(this, [...arguments].slice(1))
    }
  }

  let emmitter = new EventEmmitter()

  emmitter.addListener('ages', age => {
    console.log(age)
  })

  emmitter.emit('ages', 18)
```