# LRU (Least recently used) (最近最少使用)
- 浏览器缓存淘汰策略，常见策略：FIFO(先进先出)，LFU(最少使用),LRU(最近最少使用)
- LRU根据数据的历史访问记录进行淘汰数据。核心思想：如果数据最近被访问过，那么将来被访问的概率也更高。优先淘汰最近没有被访问的数据。
- 实现: 支持获取数据get和写入数据put
  ```
    let cache = new LRUCache(2) //最长长度
    cache.put('home',{name: 'home'});  
    cache.put('goods',{name: 'goods'});
    cache.get('goods');
    cache.put('list');

  ```
  ```
    //使用map
    function LRUCache(max) {
      this.cache = new Map();
      this.max = max;
    }

    LRUCache.prototype.get = function(key) {
      if(this.cache.has(key)) {
        let page = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, page)
        return page
      }
      return -1
    }

    LRUCache.prototype.put = function(key, page) {
      if(this.cache.has(key)) {
        this.cache.delete(key);
      }
      if(this.cache.size >= this.max) {
        //删除map中第一个元素，即最先加入的数据
        this.cache.delete(this.cache.keys().next().value)
      }
      this.cache.set(key, page)
    }
    
  ```