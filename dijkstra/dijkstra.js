const {readFile} = require('../utils/fs');
const {MinHeap} = require('../utils/heap');
const {Edge, Vertex} = require('../utils/graphs');

function findMinVertex(weightedMap) {
    const iterator = weightedMap.entries();
    let min = Infinity;
    let vertex;
    let curr;
    do {
        curr = iterator.next();
        if (curr.value && curr.value[1] <= min) {
            min = curr.value[1];
            vertex = curr.value[0];
        }
    } while(!curr.done);
    return vertex;
}

function DijkstraShortestPath(graph, sVertex) {
    const visited = new Set();
    const weighted = new Map();
    const heap = new MinHeap();
    const scores = new Map();
    weighted.set(sVertex, 0);
    do {
        const vertex = findMinVertex(weighted);
        visited.add(vertex);
        const dijkstraScore = weighted.get(vertex);
        const edges = graph.get(vertex) || [];
        for (let i = 0; i < edges.length; i++) {
            const [adjacentVertex, weight] = edges[i];
            if (!visited.has(adjacentVertex)) {
                const oldScore = weighted.get(adjacentVertex) || Infinity;
                const newScore = weight + dijkstraScore;
                const currScore = newScore < oldScore ? newScore : oldScore;
                weighted.set(adjacentVertex, currScore);
            }
        }
        scores.set(vertex, dijkstraScore);
        weighted.delete(vertex);
    } while(weighted.size > 0);
    return scores;
}

function getGraph(file) {
    return readFile(file, (line) => {
        const vertex = new Vertex()
        line
            .replace(/\s+/gi, " ")
            .split(" ")
            .forEach((i, idx) => {
                if (!i) {
                    return acc;
                }
                if (idx === 0) {
                    vertex.setLabel(i)
                } else {
                    const arr = i.split(',').map(k => parseInt(k, 10))
                    vertex.addEdge(new Edge(vertex.label, arr[0], arr[1]))
                }
            });
    }).then(arr => {
        return arr.reduce((acc, curr) => {
            acc.set(curr.vertex, curr.edges);
            return acc;
        }, new Map());
    })
}

function test(file, listOfVertexes, expected) {
    getGraph(file)
    .then(graph => {
        const answer = DijkstraShortestPath(graph, 1);
        const res = listOfVertexes.map(v => answer.get(v) || 1000000);
        console.log(res.join(','));
    });
}

module.exports = {
    test,
    DijkstraShortestPath
}

test('dijkstras.txt', [7,37,59,82,99,115,133,165,188,197]);
//console.log(findMinVertex(m));
