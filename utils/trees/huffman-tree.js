const TreeNode = require('./tree-node')
const {MinHeap} = require('../heap')

function buildTree(list) {
    const heap = new MinHeap(list)
    while (heap.size() > 1) {
        const left = heap.extract()
        const right = heap.extract()
        const node = new TreeNode(left + right)
        node.setLeftChild(left)
        node.setRightChild(right)
        left.setParent(node)
        right.setParent(node)
        heap.insert(node)
    }
    return heap.extract()
}

class HuffmanTree {
    constructor(list) {
        this.alphabet = list.map(e => new TreeNode(e[0]))
        this.root = buildTree(this.alphabet)
    }

    getMaxHeight() {
        const levels = this.alphabet.map((node) => {
            let level = 0
            do {
                level++;
                node = node.getParent()
            } while(node)
            return level
        })
        return Math.max(...levels)
    }

    getMinHeight() {
        const levels = this.alphabet.map((node) => {
            let level = 0
            do {
                level++;
                node = node.getParent()
            } while(node)
            return level
        })
        return Math.min(...levels)
    }

    print() {
        const toVisitSet = [this.root];
        const array = []
        do {
            let next = toVisitSet.shift();
            try {
                if (next.hasLeftChild()) {
                    toVisitSet.push(next.getLeftChild())
                }
                if (next.hasRightChild()) {
                    toVisitSet.push(next.getRightChild())
                }
            } catch (e) {
                console.error(e)
                console.log(next)
            }
            array.push(next.valueOf())
        } while(toVisitSet.length > 0);
        return array
    }
}

module.exports = HuffmanTree