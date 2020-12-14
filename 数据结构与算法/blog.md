# 数组与链表
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

2. 链表交换相邻元素
3. 判断链表是否有环
   - 一直循环 加个最长时间（.5s)
   - 使用set数据结构，每次循环将地址加进去，判断地址是否在set中出现 o(n)
   - 龟兔赛跑 快指针间隔2步 满指针间隔1步 不需要额外的数据结构 如果没有环，永远不会相撞，如果有环，则会相遇 时间复杂度o(n)
     * def hasCycle(self, head):
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
3. 三数之和 使用map  o(n**2) 空间复杂度是o(n)  如果先排序，再使用双指针缩小，则可以省掉空间复杂度，时间复杂度不变
   
# 树&二叉树&二叉搜索树
* 链表是特殊的树
* 树是特殊的图形  (图形就是含有环形的链表，常用判断最优路径）
1. 验证二叉搜索树
  