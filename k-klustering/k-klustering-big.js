const path = require('path')
const {readFileAsMatrix, readFileAsSetOfStrings} = require('../utils/fs');
const UnionFind = require('../utils/union-find');

function  calculateCost(left, right) {
    let cost = 0
    for (let i = 0; i < 24; i++) {
        if (((left >> i) & 1) !== ((right >> i) & 1)) {
            cost++
        }
    }
    return cost
}

function kClusteringBig(graph, spacing) {
    const unionFind = new UnionFind(Object.keys(graph))
    console.log(graph)
    console.log('amount of clusters', unionFind.amountOfClusters())
    for (let i = 0; i < graph.length; i++) {
        for (let k = i+1; k < graph.length; k++) {
            const cost = calculateCost(graph[i], graph[k])
            if (cost < spacing) {
                unionFind.union(i.toString(), k.toString())
            } 
        }
    }
    console.log('Hurray!')
    return unionFind.amountOfClusters()
}

function test(file, spacing) {
    readFileAsSetOfStrings(path.resolve(__dirname, file))
    .then(graph => {
        const answer = kClusteringBig(graph.map(a => parseInt(a, 2)), spacing);
        console.log(answer);
    });
}

test('data/test.txt', 3); // 106
//test('data/k-clustering-big.txt', 3); // 170580 - incorrect
