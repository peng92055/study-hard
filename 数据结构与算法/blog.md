# 数据结构与算法
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
   
# 树&二叉树&二叉搜索树 主要考察广度遍历、深度遍历及搜索
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
2. 二叉树遍历（前序pre-order 根-左-右、中序In-order 左-根-右、后序Post-order 左-右-根）