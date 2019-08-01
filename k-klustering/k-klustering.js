const {readGraphAsAdjancyList} = require('../old/utils');
const {MinHeap} = require('../utils/heap');
const UnionFind = require('../utils/union-find');

class Vertex {
    constructor(id) {
        this.id = id;
    }

    valueOf() {
        return this.id;
    }    
}

class Edge {
    constructor(vertexA, vertexB, cost) {
        this.vertexA = vertexA;
        this.vertexB = vertexB;
        this.cost = cost;
    }

    valueOf() {
        return this.cost;
    }
}

function kClustering(graph, clusters) {
    const { setOfEdges, setOfVertexes } = graph
    const minHeap = new MinHeap(setOfEdges)
    const unionFind = new UnionFind(setOfVertexes)
    do {
        const minEdge = minHeap.extract()
        unionFind.union(minEdge.vertexA, minEdge.vertexB)
    } while(unionFind.amountOfClusters > clusters || minHeap.size() > 0)
    if (minHeap.size() <= 0) {
        return 0
    }
    const edge = minHeap.extract()
    return edge.cost
}

function test(file, clusters) {
    readGraphAsAdjancyList(file)
    .then(graph => {
        const setOfVertexes = new Set();
        const visited = new Set();
        const setOfEdges = new Set();

        graph.forEach(element => {
            const vaId = parseInt(element[0], 10);
            const vbId = parseInt(element[1], 10);
            const cost = parseInt(element[2], 10);

            const va = new Vertex(vaId);
            const vb = new Vertex(vbId);
            const vbVaEdge = new Edge(vb, va, cost);
            setOfEdges.add(vbVaEdge)

            if (!visited.has(vaId)) setOfVertexes.add(va)
            if (!visited.has(vbId)) setOfVertexes.add(vb)
            visited.add(vaId)
            visited.add(vbId)
        })
        return { setOfEdges, setOfVertixes }
    })
    .then(data => {
        const answer = kClustering(data, clusters);
        console.log(answer);
    });
}

test('data/k-clustering.txt', 4);
