# 数据结构与算法
## 数组与链表
* 数组
  - 查询快,每个元素在内存中有地址，可以通过计算机的寻址方式快速找到元素，所以查询的时间复杂度是O(1)
  - 插入删除慢，由于数组是有序的，插入或者删除后会影响其他元素的位置，固然需要挪动其他元素，时间复杂度是O(n)
* 链表
  - 查询慢，需要一个个往指定的第几位找，时间复杂度是O(1)
  - 插入删除快，不会影响其他元素的位置，是个散列摆放，固然直接将上一个元素的next指向新元素，将新元素的next指向之前的下一个元素即可，时间复杂度是O(1)
  - 双向链表也是如此，方便正反方向来操作

eg:
1. 链表反转
   input: 1->2->3->4->5->NULL
   output: 5->4->3->2->1->NULL
   ```
   function ListNode(val) {
     this.val = val
     this.next = null
   }

   function reverseList(head) {
     let prev = null
     let curr = head
     let next = null
      while(curr) {
        next = curr.next
        curr.next = prev
        prev = curr
        curr = next
      }
      return prev
   }
  ```
2. 链表交换相邻元素
3. 判断链表是否有环
   - 一直循环 加个最长时间（.5s)
   - 使用set数据结构，每次循环将地址加进去，判断地址是否在set中出现 o(n)
   - 龟兔赛跑 快指针间隔2步 满指针间隔1步 不需要额外的数据结构 如果没有环，永远不会相撞，如果有环，则会相遇 时间复杂度o(n)
      ```
      def hasCycle(self, head):
        fast = slow = head
        while slow and fast and fast.next
          slow = slow.next
          fast = fast.next.next
          if slow is fast:
            return true
          return false

      function hasCycle(head) {
        let slow = head
        let fast = head
        while(slow && fast && fast.next) {
          slow = slow.next
          fast = fast.next.next
          if(slow === fast) {
            return true
          }
        }
        return false
      }
    ```
# 堆栈stack和队列quene
  * stack 先进后出
  * quene 先进先出  （特殊：双端队列）
1. 判断括号字符是否有效 使用stack
2. 用队列实现栈&用栈实现队列

# 优先队列 
* 一般使用堆heap或者二叉搜索树binary search tree
* 小顶堆或者大顶堆
1. 返回数据流中的第K大的元素
2. 返回滑动窗口中的最大值

# 哈希表 map&set
1. 有效的字母异位词
2. 两数之和 使用map o(n) 
   ```
    /**
    * 给定 nums = [2, 7, 11, 15], target = 9。因为 nums[0] + nums[1] = 2 + 7 = 9。所以返回 [0, 1]。
    */
    function twoSum(nums, target) {
      let map = new Map()
      for(let i = 0,len = nums.length; i < len; i++) {
        let diff = target - nums[i]
        if(map.has(diff)) {
          return [map.get(diff), i]
        }
        map.set(nums[i], i)
      }
      return
    }
   ```
3. 三数之和 使用map  o(n**2) 空间复杂度是o(n)  如果先排序，再使用双指针缩小，则可以省掉空间复杂度，时间复杂度不变
   ```
    let res = []
    let hash = {}
    for (let i = 0; i < nums.length - 2; i++) { // 每个人
      for (let j = i + 1; j < nums.length - 1; j++) { // 依次拉上其他每个人
        if (hash[nums[j]] !== undefined) { // 已经有合适自己的两人组
          res.push([nums[j]].concat(hash[nums[j]]))
          hash[nums[j]] = undefined
        } else { // 没有合适自己的两人组
          let mark = 0 - nums[i] - nums[j]
          hash[mark] = [nums[i], nums[j]]
        }
      }
    }
    return res
   ```
   ```
    var threeSum = function (nums) {
      let ans = [];
      const len = nums.length;
      if(nums == null || len < 3) return ans;
      nums.sort((a, b) => a - b); // 排序
      for (let i = 0; i < len ; i++) {
          if(nums[i] > 0) break; // 如果当前数字大于0，则三数之和一定大于0，所以结束循环
          if(i > 0 && nums[i] == nums[i-1]) continue; // 去重
          let L = i+1;
          let R = len-1;
          while(L < R){
              const sum = nums[i] + nums[L] + nums[R];
              if(sum == 0){
                  ans.push([nums[i],nums[L],nums[R]]);
                  while (L<R && nums[L] == nums[L+1]) L++; // 去重
                  while (L<R && nums[R] == nums[R-1]) R--; // 去重
                  L++;
                  R--;
              }
              else if (sum < 0) L++;
              else if (sum > 0) R--;
          }
      }        
      return ans;
    } // 示意代码 未AC
   ```
   
# 树&二叉树&二叉搜索树
* 链表是特殊的树
* 树是特殊的图形  (图形就是含有环形的链表，常用判断最优路径）
1. 验证二叉搜索树
  - 做一次中序遍历 时间复杂度o(n)
    ```
      function isValisBST(root) {
        let stack = []
        let inorder = -Infinity
        while(root !== null || stack.length) {
          while(root !== null) {
            stack.push(root)
            root = root.left
          }
          root = stack.pop()
          if(root.val <= inorder) {
            return false
          }
          inorder = root.val
          root = root.right
        }
        return true
      }
    ``` 
  - 递归 时间复杂度o(n)
    ```
      function isValidBST(root, min = -Infinity, max = Infinity) {
        return root === null || root.val > min && root.val < max && isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max)
      }
    ```