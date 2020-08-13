class Node {
  constructor(element, next) {
    this.element = element;
    this.next = next;
  }
}

class LinkList {
  constructor() {
    this.head = null;     // 链表头
    this.size = 0;        // 链表的长度
  }
  add(index, element) {
    // 函数重载
    if (arguments.length === 1) {
      element = index;
      index = this.size;
    }
    if (index < 0 || index > this.size) throw new Error('越界');

    // 在索引为0的位置上插入
    if (index == 0) {
      let head = this.head;
      this.head = new Node(element, head);
    } else {
      let prevNode = this.getNode(index - 1);
      prevNode.next = new Node(element, prevNode.next);
    }
    this.size++;
  }
  getNode(index) {
    if (index < 0 || index > this.size) throw new Error('越界');
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current.next;
    }
    return current;
  }
  // 删除
  remove(index) {
    if (index === 0) {
      let node = this.head;
      if (!node) return null;
      this.head = node.next;
      this.size--;
      return node.element;
    }

  }
}

module.exports = LinkList;