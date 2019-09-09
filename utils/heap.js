function iParent(idx) {
  if (idx > 0) {
    return Math.floor((idx - 1) / 2);
  }
  return 0;
}

function iChildren(idx) {
  const twoTimes = 2 * idx + 1;
  return [twoTimes, twoTimes + 1];
}

function swapAB(arr, a, b) {
  const left = arr[a];
  const right = arr[b];
  arr[a] = right;
  arr[b] = left;
}

class Heap {
  constructor(data) {
    this._size = 0;
    this._heap = [];
    Array.from(data || []).forEach((e) => this.insert(e));
  }

  size() {
    return this._size;
  }

  insert(key) {
    this._heap.push(key);
    this._size++;
    this._bubbleUp(key.valueOf());
  }

  extract() {
    if (this._size <= 0) {
      return null;
    }
    const res = this._heap[0];
    swapAB(this._heap, 0, this._size - 1);
    this._heap.pop();
    this._size--;
    this._rebalance();
    return res;
  }
}

class MinHeap extends Heap {
  _bubbleUp(key) {
    let idx = this._size - 1;
    let parentIdx;
    do {
      parentIdx = iParent(idx);
      if (this._heap[parentIdx] <= key) {
        break;
      }
      swapAB(this._heap, idx, parentIdx);
      idx = parentIdx;
    } while (parentIdx > 0);
  }

  _rebalance() {
    let top = 0;
    if (this._size <= 0) {
      return;
    }
    const elem = this._heap[0].valueOf();
    while (top < this._size - 1) {
      const [left, right] = iChildren(top);
      const leftVal = this._heap[left] ? this._heap[left].valueOf() : null;
      const rightVal = this._heap[right] ? this._heap[right].valueOf() : null;
      if (leftVal && rightVal) {
        if (leftVal < elem && rightVal < elem) {
          if (leftVal > rightVal) {
            swapAB(this._heap, right, top);
            top = right;
          } else {
            swapAB(this._heap, left, top);
            top = left;
          }
        } else if (leftVal < elem) {
          swapAB(this._heap, left, top);
          top = left;
        } else if (rightVal < elem) {
          swapAB(this._heap, right, top);
          top = right;
        } else {
          break;
        }
      } else if (leftVal && leftVal < elem) {
        swapAB(this._heap, left, top);
        top = left;
      } else if (rightVal && rightVal < elem) {
        swapAB(this._heap, right, top);
        top = right;
      } else {
        break;
      }
    }
  }
}

class MaxHeap extends Heap {
  _bubbleUp(key) {
    let idx = this._size - 1;
    let parentIdx;
    do {
      parentIdx = iParent(idx);
      if (this._heap[parentIdx] >= key) {
        break;
      }
      swapAB(this._heap, idx, parentIdx);
      idx = parentIdx;
    } while (parentIdx > 0);
  }

  _rebalance() {
    let top = 0;
    const elem = this._heap[0];
    while (top < this._size - 1) {
      const [left, right] = iChildren(top);
      if (this._heap[left] && this._heap[right]) {
        if (this._heap[left] > elem && this._heap[right] > elem) {
          if (this._heap[left] < this._heap[right]) {
            swapAB(this._heap, right, top);
            top = right;
          } else {
            swapAB(this._heap, left, top);
            top = left;
          }
        } else if (this._heap[left] > elem) {
          swapAB(this._heap, left, top);
          top = left;
        } else if (this._heap[right] > elem) {
          swapAB(this._heap, right, top);
          top = right;
        } else {
          break;
        }
      } else if (this._heap[left] && this._heap[left] > elem) {
        swapAB(this._heap, left, top);
        top = left;
      } else if (this._heap[right] && this._heap[right] > elem) {
        swapAB(this._heap, right, top);
        top = right;
      } else {
        break;
      }
    }
  }
}

module.exports = {
  MinHeap,
  MaxHeap,
};
