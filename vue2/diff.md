# diff 对比

## react diff
  - 单端比较，配置标记位。循环新节点，从老节点中找原始位置
  ```
    // react diff
    function updateChildren(nextChildren, prevChildren) {
      let lastIndex = 0;
      for(let i = 0; i < vnode.length; i++) {
        const nextVNode = nextChildren[i]
        let j = 0;
        find = false; //是否找到原始节点
        for(j; j < prevChildren.length; j++) {
          const prevVNode = prevChildren[j]
          if(nextVNode.key === prevVNode[j]) {
            find = true;
            // 更新节点，如果内部有children，则递归更新
            patch(prevVNode, nextVNode, container)
            if(j < lastIndex) {
              //需要移动
              const refNode = nextChildren[i-1].el.nextSibling;
              container.insertBefore(prevVnode, refNode)
            } else {
              lastIndex = j;
            }
            break;
          }
        }
        // 如果新节点在老节点中找不到，则新增
        if(!find) {
          const refNode = i === 0 ? prevChildren[0].el : nextChildren[i-1].el.nextSibling;
          mount(nextVNode,container, false, refNode);
        }
      }
      //移除已经不存在的老节点
      for(let i = 0; i < prevChilren.length; i++) {
        const prevVNode = prevChildren[i];
        const has = nextChildren.find( nextVnode => nextVnode.key === prevVNode.key)
        if(!has) {
          container.remove(prevVNode.el)
        }
      }
    }
  ```
  - 循环新的节点，初始化在老节点中上一次找到的位置lastIndex
  - 重置是否找能在老节点中找到标记find
  - 循环老节点
  - 找到新老节点key相同的位置i，更新节点内容，更新标记find=true
  - 判断i是否比上一次在老节点中找到的位置小，如果小，则说明节点在上一次节点的前面，需要移动
  - 移动此节点到上一次的老节点之前
  - 如果i大于老节点的位置，则更新lastIndex = i
  - 如果找不到，则说明新节点是全新的，直接创建
  - 继续循环
  - 循环完成之后，判断老节点中节点是否都在新节点中，多余的节点直接删除
## Vue2.x diff
  - 双端比较
  - 使用四个指引，分别指向新旧children的两端。
  - 旧头 === 新头 || 旧尾 === 新尾 || 旧头 === 新尾 || 旧尾 === 新尾 。如果一个符合，都跳出判断。
  ```
    function updateChildren(oldCh, newCh) {
      let oldStartIdx = 0;
      let newStartIdx = 0;
      let oldEndIdx = oldCh.length - 1;
      let newEndIdx = newCh.length - 1;
      let oldStartVnode = oldCh[oldStartIdx];
      let newStartVnode = newCh[newStartIdx];
      let oldEndVnode = oldCh[oldEndIdx];
      let newStartVnode = newCh[newEndIdx];

      while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if(!oldStartVnode) {
          oldStartVnode = oldCh[++oldStartIdx]
        } else if(!oldEndVnode) {
          oldEndVnode = oldCh[--oldEndIdx]
        } else if(oldStartVnode.key === newStartVnode.key) {
          // 调用patch函数更新
          patch(oldStartVnode, newStartVnode, container)
          // 不移动，更新索引
          oldStartVnode = oldCh[++oldStartIdx];
          newStartVnode = newCh[++newStartIdx];
        } else if(oldEndVnode.key === newEndVnode.ley) {
          // 调用patch函数更新
          patch(oldEndVnode, newEndVnode, container)
          // 此时不需要移动
          // 更新角标
          oldEndVnode = oldCh[--oldEndIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if(oldStartVnode.key === newEndVnode.key) {
          // 调用patch函数更新
          patch(oldStartVnode, newEndVnode, container)
          // 移动旧节点到当前新节点的尾部索引地方,也是当前旧尾部索引的地方
          container.insertBefore(oldStartVnode, oldEndVnode.el.nextSibling)
          oldStartVnode = oldCh[++oldStartIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if(oldEndVnode.key === newStartVnode.key) {
          // 调用patch函数更新
          patch(oldEndVnode, newStartVnode, container)
          // 移动,将真实dom中 最后的节点移动到当前最前面
          container.insertBefore(oldEndVnode.el, oldStartVnode.el)
          //移动循环角标
          oldEndVnode = oldCh[--oldEndIdx];
          newStartVnode = newCh[++newStartIdx];
        } else {
          // 找到新children的 当前起始节点 在旧children中的index
          idxInOld = oldCh.findIndex(oldVnode => oldVnode.key === newStartVnode.key);
          if(idxInOld) {
            // 如果新节点在老的节点中存在，则移动存在的老节点到新起始节点索引位置
            const vnodeToMove = oldCh[idxInOld];
            patch(vnodeToMove, newStartVnode, container);
            constainer.insertBefore(vnodeToMove, oldStartVnode.el);
            oldCh[idxInOld] = undefined; // 后续循环到此节点时，根据是起始索引还是终止索引来跳过处理
          } else {
            // 不存在，则新建并添加到当前起始索引位置
            createEle(newStartVnode, oldStartVnode.el)
          }
          newStartVnode = newCh[++newStartIdx]
        }
        if(oldEndIdx < oldStartIdx) {
          // 新节点多余老节点时，可能出现终止位置小于起始位置，但是还有新元素没有处理。则需要单独添加
          for(let i = newStartIdx; i <= newEndIdx; i++) {
            createEle(newCh[i], oldStartVnode.el)
          }
        } else if(newEndIdx < newStartIdx) {
          // 如果旧节点多余新节点，可能出现终止位置小于起始位置，则需要移除多余的老节点
          for(let i = oldStartIdx; i<= oldEndIdx; i++) {
            remove(oldCh[i].el)
          }
        }
      }
    }
  ```
## Vue3.x diff 借鉴inferno
  - 新找到最长递增子序列  
    - 采用贪心算法 + 二分查找