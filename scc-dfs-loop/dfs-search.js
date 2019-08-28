const {readFileAsMatrix} = require('../utils/fs');
const {Edge, Vertex} = require('../utils/graphs');
const {MaxHeap} = require('../utils/heap');

function fillInOrder(graph, vertex, visited = new Set(), finishingTimes = null, t = 0) {
    visited.add(vertex)
    // console.log('v', vertex, 't', t)
    const edges = graph.get(vertex).in
    const iterator = edges.values()
    let nextEdge = iterator.next()
    while(!nextEdge.done) {
        const nextVertex = nextEdge.value.getHead()
        if (!visited.has(nextVertex)) {
            t = fillInOrder(graph, nextVertex, visited, finishingTimes, t)
        }
        nextEdge = iterator.next()
        t=t+1;
        // console.log('f(', vertex, ')', '=',t)
        finishingTimes.set(t, vertex)
    }
    
    return t
}

function DFSLoop(graph, vertex, visited = new Set(), visitedOnCurrentLoop = new Set()) {
    // console.log('v', vertex)
    // console.log('visited', visitedOnCurrentLoop)
    visited.add(vertex)
    visitedOnCurrentLoop.add(vertex)
    const edges = graph.get(vertex).out
    // console.log(edges)
    const iterator = edges.values()
    let nextEdge = iterator.next()
    while(!nextEdge.done) {
        const nextVertex = nextEdge.value.getTail()
        if (!visited.has(nextVertex)) {
            DFSLoop(graph, nextVertex, visited, visitedOnCurrentLoop)
        }
        nextEdge = iterator.next()
    }
}

function findSCCs(graph, maxVertex, minVertex) {
    // console.log('Looking for SCCS')
    let finishingTimes = new Map()
    let visited = new Set()
    let t = 0, _ = null
    // console.log('max', maxVertex, 'min', minVertex)
    for (let i = maxVertex; i >= minVertex; i--) {
        if (!graph.get(i)) {
            continue;
        }
        // console.log(i)
        if (!visited.has(i)) {
            // console.log('trying to visit', i)
            t = fillInOrder(graph, i, visited, finishingTimes, t);
        }
    }
    console.log('DFS loop on reverse graph complete!')
    // console.log(finishingTimes)
    visited.clear();
    let i = finishingTimes.size
    const sccs = [];
    for (; i > 0; i--) {
        let vertex = finishingTimes.get(i);
        // console.log('running DFS loop on vertex', vertex)
        if (!visited.has(vertex)) {
            // console.log('----')
            // console.log('trying to visit', vertex)
            const visitedOnCurrentLoop = new Set()
            DFSLoop(graph, vertex, visited, visitedOnCurrentLoop)
            // console.log('visited', visitedOnCurrentLoop)
            // console.log('')
            sccs.push(visitedOnCurrentLoop);
            // console.log(sccs[sccs.length - 1])
        }
    }
    return sccs;
}

//Map { 1 => 8, 2 => -8, 3 => -3, 4 => 4, 5 => 2, 6 => 1 }
function countSizes(sccs) {
    return sccs.map((set) => set.size);
}

function test(file, expected) {
    readFileAsMatrix(file)
        .then((matrix) => {
            const graph = new Map()
            let maxVertex = -Infinity
            let minVertex = Infinity
            matrix.forEach(line => {
                const vertexALabel = parseFloat(line[0])
                const vertexBLabel = parseFloat(line[1])
                const edgesA = graph.get(vertexALabel) || {out: new Set(), in: new Set()}
                const edgesB = graph.get(vertexBLabel) || {out: new Set(), in: new Set()}
                const edge = new Edge(vertexALabel, vertexBLabel, 0)
                edgesA.out.add(edge)
                edgesB.in.add(edge)
                graph.set(vertexALabel, edgesA)
                graph.set(vertexBLabel, edgesB)
                maxVertex = Math.max(maxVertex, vertexALabel, vertexBLabel)
                minVertex = Math.min(minVertex, vertexALabel, vertexBLabel)
            })
            return [graph, maxVertex, minVertex]
        })
        .then((result) => {
            const sccs = findSCCs(result[0], result[1], result[2]);
            const counts = countSizes(sccs);
            console.log('Result:', counts.join(','));
        });
}

// test('data/scc.2.txt', [3, 3, 3]);
//test('scc.1.txt', [1, 1, 3]);
module.exports = {
    test,
    findSCCs
}
