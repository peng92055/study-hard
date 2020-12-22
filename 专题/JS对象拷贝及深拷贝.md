## 浅拷贝
## 深拷贝

- JSON.parse(JSON.stringify(obj))
- ...obj
- 深拷贝
  ```
    <!-- function clone(obj) {
      let _obj = {}
      for(let key in obj) {

        if(obj[key] !== null && type obj[key] === 'object') {
          _obj[key] = clone(obj[key])
        } else {
          _obj[key] = obj[key]
        }
      }
      return _obj
    } -->
  ```