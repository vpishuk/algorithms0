const {readGraphAsAdjancyList, MinHeap} = require('../old/utils');

class Edge {
    constructor(vertexA, vertexB, cost) {
        this.vertexA = parseInt(vertexA, 10);
        this.vertexB = parseInt(vertexB, 10);
        this.cost = parseInt(cost, 10);
    }

    valueOf() {
        return this.cost;
    }
}

function kClustering(graph, clusters) {
    const { edgesMap, setOfVertixes } = data
    //const minHeap = 
    do {
    } while()
}

function test(file, clusters) {
    readGraphAsAdjancyList(file)
    .then(graph => {
        const edgesMap = new Map(); // vertix to set of Edges
        const setOfVertixes = new Set()

        graph.forEach(element => {
            const va = parseInt(element[0], 10);
            const vb = parseInt(element[1], 10);
            const cost = parseInt(element[2], 10);
            setOfVertixes.add(va)
            setOfVertixes.add(vb)

            const aSet = edgesMap.get(va) || new Set()
            aSet.add(new Edge(va, vb, cost))
            edgesMap.set(va, aSet)
            const bSet = edgesMap.get(vb) || new Set()
            bSet.add(new Edge(vb, va, cost))
            edgesMap.set(vb, bSet)
        })
        return { edgesMap, setOfVertixes }
    })
    .then(data => {
        const answer = kClustering(data, clusters);
        console.log(answer);
    });
}

test('data/k-clustering.txt', 4);
