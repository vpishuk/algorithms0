const fs = require('fs');
const readline = require('readline');
const path = require('path');
const colors = require('colors');

const LOGGER = {
    logs: [],
    log: (...rest) => {
        LOGGER.logs.push(rest);
        //console.log(...rest);
    },
    clear: () => {
        LOGGER.logs = [];
    },
    flush: () => {
        for (let i = 0; i < LOGGER.logs.length; i++) {
            console.log(...LOGGER.logs[i]);
        }
        LOGGER.clear();
    }
};

function readGraphAsAdjancyList(file) {
    const arr = [];
    let firstLine = true;
    return readFile(file, (line) => {
        if (line && !firstLine) {
            arr.push(line.replace(/\s+/gi, " ").split(" "))
        }
        firstLine = false;
    }).then(() => {
        console.log('read done');
        return arr;
    })
}

function readFile(file, callback) {
    return new Promise((_resolve) => {
        const lineReader = readline.createInterface({
            input: fs.createReadStream(path.resolve(__dirname, file))
        });

        lineReader.on('line', (line) => {
            try {
                callback(line)
            } catch(e) {
                console.error(e)
            }
        });

        lineReader.on('close', () => {
            console.log('read complete')
            _resolve();
        });
    });
}

class Heap {
    constructor () {
        this._size = 0;
        this._debug = false;
        this._heap = [];
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

class TreeNode {
    constructor(value) {
        this.value = value;
        this.parent = null;
        this.leftChild = null;
        this.rightChild = null;
    }

    setParent(parent) {
        this.parent = parent;
    }

    setLeftChild(child) {
        this.leftChild = child;
    }

    setRightChild(child) {
        this.rightChild = child;
    }
}

const RB_TREE_COLORS = {
    BLACK: 0,
    RED: 1
}

class RedBlackTree {
    constructor() {
        this.root = null;
        this.colors = new Map()
        this.size = 0;
    }

    insert(item) {
        this.size++;
        if (!this.root) {
            this.root = new TreeNode(item);
            this.colors.set(this.root, RB_TREE_COLORS.BLACK);
            return;
        }
        const newNode = new TreeNode(item);
        let parent = this.root;
        do {
            if (parent.value > newNode.value) {
                if (parent.leftChild) {
                    parent = parent.leftChild;
                } else {
                    newNode.setParent(parent);
                    parent.setLeftChild(newNode);
                    break;
                }
            } else if (parent.value < newNode.value) {
                if (parent.rightChild) {
                    parent = parent.rightChild;
                } else {
                    newNode.setParent(parent);
                    parent.setRightChild(newNode);
                    break;
                }
            } else {
                return null;
            }
        } while(!newNode.parent)
        this.colors.set(newNode, RB_TREE_COLORS.RED);
        this._recolorTree(newNode);
        this.colors.set(this.root, RB_TREE_COLORS.BLACK);
    }

    print(nodes = null, level = 0) {
        let arr = []
        if (nodes == null) {
            nodes = [this.root]
        }
        if (nodes.filter(n => n).length <=0) {
            return []
        }
        arr.push(nodes.map(n => this._printNode(n)))
        arr = arr.concat(this.print(nodes.map(n => n ? [n.leftChild, n.rightChild] : [null, null]).reduce((acc, curr) => [...acc, ...curr], [])))
        arr.forEach((a) => {
            if (a) {
                console.log(...a)
            }
        })
    }

    _printNode(node) {
        if (node) {
            const color = this.colors.get(node)
            if (color === RB_TREE_COLORS.BLACK) {
                return node.value.toString();
            } else {
                return node.value.toString().red
            }
        }
        return '*'
    }

    _recolorTree(node) {
        while(node.parent && node.parent.parent) {
            const parentColor = this.colors.get(node.parent);
            if (parentColor === RB_TREE_COLORS.BLACK) {
                break;
            }
            const uncle = node.parent.parent.rightChild === node.parent ? node.parent.parent.leftChild : node.parent.parent.rightChild;
            const uncleColor = uncle ? this.colors.get(uncle) : RB_TREE_COLORS.BLACK;
            if (uncleColor === RB_TREE_COLORS.BLACK) {
                this.colors.set(node.parent.parent.rightChild, RB_TREE_COLORS.BLACK);
                this.colors.set(node.parent.parent.leftChild, RB_TREE_COLORS.BLACK);
                this.colors.set(node.parent.parent, RB_TREE_COLORS.RED);
                node = node.parent.parent;
                continue;
            }
            if (uncleColor === RB_TREE_COLORS.RED) {
                const isLeftChild = node.parent.leftChild === node;
                const isParentLeftChild = node.parent.parent.leftChild === node.parent;
                if (isLeftChild && isParentLeftChild) {
                    this._rotateToRight(node.parent.parent)
                    this.colors.set(node.parent, RB_TREE_COLORS.BLACK);
                    this.colors.set(node.parent.parent, RB_TREE_COLORS.RED);
                    continue;
                }

                if (!isLeftChild && isParentLeftChild) {
                    this._rotateToLeft(node.parent);
                    this._rotateToRight(node.parent);
                    this.colors.set(node.parent, RB_TREE_COLORS.BLACK);
                    this.colors.set(node.parent.parent, RB_TREE_COLORS.RED);
                    continue;
                }

                if (!isLeftChild && !isParentLeftChild) {
                    this._rotateToLeft(node.parent.parent);
                    this.colors.set(node.parent, RB_TREE_COLORS.BLACK);
                    this.colors.set(node.parent.parent, RB_TREE_COLORS.RED);
                    continue;
                }

                if (isLeftChild && !isParentLeftChild) {
                    this._rotateToRight(node.parent);
                    this._rotateToLeft(node.parent);
                    this.colors.set(node.parent, RB_TREE_COLORS.BLACK);
                    this.colors.set(node.parent.parent, RB_TREE_COLORS.RED);
                    continue;
                }
            }
        }
    }

    _rotateToRight(parentNode) {
        parentNode.leftChild.setParent(parentNode.parent);
        parentNode.setParent(parentNode.leftChild);
        parentNode.setLeftChild(parentNode.leftChild.rightChild);
        parentNode.leftChild.setRightChild(parentNode);
    }

    _rotateToLeft(parentNode) {
        parentNode.rightChild.setParent(parentNode.parent);
        parentNode.setParent(parentNode.rightChild);
        parentNode.setRightChild(parentNode.rightChild.leftChild)
        parentNode.rightChild.setLeftChild(parentNode);
    }

    

    getMedian() {
        let midx = 0;
        if (this.tree.length % 2 == 0) {
            midx = Math.floor(this.tree.length / 2);
        } else {
            midx = Math.floor((this.tree.length + 1) / 2);
        }
        return this.getOrderStatistic(midx - 1);
    }

    getOrderStatistic(i) {
        return this.tree[i];
    }

    balance() {
        const i = this.tree.length - 1;
        const item = this.tree[i];
        let k = i-1;
        while (k >= 0 && this.tree[k] > item) {
            this._swapAB(k, k+1);
            k--;
            
        };
    }

    searchPredecessor(item) {
        let size = Math.floor((this.tree.length) / 2);
        let point = this.tree.length - size - 1;
        console.log('-');
        console.log('search for', item, size, point);
        while(point >= 0 && point <= this.tree.length){
            const right = this.tree[point + 1];
            const left = this.tree[point];
            console.log(this.tree, size, point, left, '<', item, '<', right);

            if ((right && right > item) && (left && left <= item)) {
                return point + 1;
            }
            size = Math.floor(size / 2) || 1;
            if (this.tree[point + 1] > item && this.tree[point] > item) {
                point -= size;
            } else if (this.tree[point + 1] < item && this.tree[point] < item) {
                point += size;
            } else if (!this.tree[point] || !this.tree[point + 1]) {
                break;
                console.log('bbbb', this.tree, point, this.tree[point + 1], this.tree[point], item );
            }
        } 
        //console.log('bbbb', this.tree, point, this.tree[point + 1], this.tree[point], item );
        return point <= 0 ? 0 : -1;
    }

    _swapAB(a, b) {
        this.tree[a] = this.tree[a] + this.tree[b];
        this.tree[b] = this.tree[a] - this.tree[b];
        this.tree[a] = this.tree[a] - this.tree[b];
     }
}

module.exports = {
    LOGGER,
    readFile,
    MinHeap,
    MaxHeap, 
    RedBlackTree,
    readGraphAsAdjancyList
}