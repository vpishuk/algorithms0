class Heap {
    constructor (data) {
        this._size = 0;
        this._debug = false;
        this._heap = [];
        Array.from(data || []).forEach(e => this.insert(e));
    }

    size() {
        return this._size;
    }

    insert(key) {
        this._heap.push(key);
        this._size++;
        if (this._debug) {
            console.log('size', this._size, this._heap)
            console.log('heap', this._heap)
        }
        this._bubbleUp(key.valueOf());
    }

    extract() {
        if (this._size <= 0) {
            return null;
        }
        const res = this._heap[0];
        this._swapAB(0, this._size - 1);
        this._heap.pop();
        this._size--;
        this._rebalance();
        return res;
    }

    _iParent(idx) {
        if (idx > 0) {
            return Math.floor((idx - 1) / 2);
        }
        return 0
    }

    _iChildren(idx) {
        const twoTimes = 2 * idx + 1;
        return [twoTimes, twoTimes + 1]
    }

    _swapAB(a, b) {
        const left = this._heap[a];
        const right = this._heap[b];
        this._heap[a] = right;
        this._heap[b] = left;
     }
}

class MinHeap extends Heap {
    _bubbleUp(key) {
        let idx = this._size - 1;
        let parentIdx;
        do {
            parentIdx = this._iParent(idx);
            if (this._debug) {
                console.log('parentIdx', parentIdx, this._heap[parentIdx])
            }
            if (this._heap[parentIdx] <= key) {
                break;
            }
            if (this._debug) {
                console.log('swap', idx, parentIdx)
            }
            this._swapAB(idx, parentIdx);
            idx = parentIdx;
        } while(parentIdx > 0)
    }

    _rebalance() {
        let top = 0;
        if (this._size <= 0) {
            return
        }
        const elem = this._heap[0].valueOf();
        while (top < this._size - 1) {
            let [left, right] = this._iChildren(top);
            let leftVal = this._heap[left] ? this._heap[left].valueOf() : null;
            let rightVal = this._heap[right] ? this._heap[right].valueOf() : null
            if (leftVal && rightVal) {
                if (leftVal < elem && rightVal < elem) {
                    if (leftVal > rightVal) {
                        this._swapAB(right, top);
                        top = right;
                    } else {
                        this._swapAB(left, top);
                        top = left;
                    }
                } else if (leftVal < elem) {
                    this._swapAB(left, top);
                    top = left;
                } else if (rightVal < elem) {
                    this._swapAB(right, top);
                    top = right;
                } else {
                    break;
                }
            } else {
                if (leftVal && leftVal < elem) {
                    this._swapAB(left, top);
                    top = left;
                } else if (rightVal && rightVal < elem) {
                    this._swapAB(right, top);
                    top = right;
                } else {
                    break;
                }
            }
        }
    }
}

class MaxHeap extends Heap {
    _bubbleUp(key) {
        let idx = this._size - 1;
        let parentIdx;
        do {
            parentIdx = this._iParent(idx);
            if (this._heap[parentIdx] >= key) {
                break;
            }
            this._swapAB(idx, parentIdx);
            idx = parentIdx;
        } while(parentIdx > 0)
    }

    _rebalance() {
        let top = 0;
        const elem = this._heap[0];
        while (top < this._size - 1) {
            let [left, right] = this._iChildren(top);
            if (this._heap[left] && this._heap[right]) {
                if (this._heap[left] > elem && this._heap[right] > elem) {
                    if (this._heap[left] < this._heap[right]) {
                        this._swapAB(right, top);
                        top = right;
                    } else {
                        this._swapAB(left, top);
                        top = left;
                    }
                } else if (this._heap[left] > elem) {
                    this._swapAB(left, top);
                    top = left;
                } else if (this._heap[right] > elem) {
                    this._swapAB(right, top);
                    top = right;
                } else {
                    break;
                }
            } else {
                if (this._heap[left] && this._heap[left] > elem) {
                    this._swapAB(left, top);
                    top = left;
                } else if (this._heap[right] && this._heap[right] > elem) {
                    this._swapAB(right, top);
                    top = right;
                } else {
                    break;
                }
            }
        }
    }
}

module.exports = {
    MinHeap,
    MaxHeap
}