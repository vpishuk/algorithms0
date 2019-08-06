const path = require('path')
const {readFileAsMatrix} = require('../utils/fs');
const {HuffmanTree} = require('../utils/trees');

function test(file) {
    readFileAsMatrix(path.resolve(__dirname, file))
    .then(list => {
        const huffmanTree = new HuffmanTree(list);
        console.log(huffmanTree.getMaxHeight() - 1, huffmanTree.getMinHeight() - 1);
    });
}

test('data/huffman.txt'); // 19, 9
