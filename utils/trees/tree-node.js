class TreeNode {
    constructor(value) {
        this.value = value;
        this.parent = null;
        this.leftChild = null;
        this.rightChild = null;
    }

    valueOf() {
        return this.value;
    }

    setParent(parent) {
        this.parent = parent;
    }

    getParent() {
        return this.parent;
    }

    setLeftChild(child) {
        this.leftChild = child;
    }

    getLeftChild() {
        return this.leftChild;
    }

    hasLeftChild() {
        return !!this.leftChild;
    }

    setRightChild(child) {
        this.rightChild = child;
    }

    getRightChild() {
        return this.rightChild;
    }

    hasRightChild() {
        return !!this.rightChild;
    }
}

module.exports = TreeNode