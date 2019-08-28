const {readFileAsMatrix} = require('../utils/fs');
const {Edge, Vertex} = require('../utils/graphs');
const {MaxHeap} = require('../utils/heap');

function DFSLoop(graph, vertex, direction = 1, visited = new Set(), finishingTimes = null, t = 0) {
    const visitedOnCurrentLoop = new Set([vertex]);
    const toVisitSet = [vertex];
    const layers = finishingTimes ? [] : null
    // console.log('-----')
    // console.log('DFS LOOP for Vertex', vertex, 'direction', direction)
    do {
        let next = toVisitSet.shift();
        // console.log('--')
        // console.log('Vertex', next)
        let addedNew = false
        if (!visited.has(next)) {
            visited.add(next);
            visitedOnCurrentLoop.add(next);
            const edges = graph.get(next)
            if (edges) {
                if (direction === 1) {
                    if (edges.out && edges.out.size > 0) {
                        // console.log('Take out edges')
                        // console.log(edges.out)
                        const iterator = edges.out.values()
                        let nextEdge = iterator.next()
                        while(!nextEdge.done) {
                            // console.log(nextEdge)
                            const tail = nextEdge.value.getTail()
                            if (!visited.has(tail)) {
                                toVisitSet.unshift(tail)
                                addedNew = true
                            }
                            nextEdge = iterator.next()
                        }
                    }
                } else {
                    if (edges.in && edges.in.size > 0) {
                        // console.log('Take IN edges')
                        // console.log(edges.in)
                        const iterator = edges.in.values()
                        let nextEdge = iterator.next()
                        while(!nextEdge.done) {
                            // console.log(nextEdge)
                            const head = nextEdge.value.getHead()
                            if (!visited.has(head)) {
                                toVisitSet.unshift(head)
                                addedNew = true
                            }
                            nextEdge = iterator.next()
                        }
                    }
                }
            }
            if (addedNew && finishingTimes) {
                layers.unshift(next)
            }
        }
        if (finishingTimes) {
            if (!addedNew) {
                t++
                finishingTimes.set(t, next)
            }
        }
        // console.log(toVisitSet)
    } while(toVisitSet.length > 0);
    if (finishingTimes) {
        for (let i = 0; i < layers.length; i++) {
            t++
            finishingTimes.set(t, layers[i])
        }
    }
    // console.log(finishingTimes)
    return finishingTimes ? [visitedOnCurrentLoop, t] : visitedOnCurrentLoop;
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
        if (!visited.has(i)) {
            [_, t] = DFSLoop(graph, i, -1, visited, finishingTimes, t);
        }
    }
    // console.log('DFS loop on reverse graph complete!')
    // console.log(finishingTimes)
    visited.clear();
    let i = finishingTimes.size
    const sccs = [];
    for (; i > 0; i--) {
        let vertex = finishingTimes.get(i);
        // console.log('running DFS loop on vertex', vertex)
        if (!visited.has(vertex)) {
            const scc = DFSLoop(graph, vertex, 1, visited)
            sccs.push(scc);
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
            const maxVertex = -Infinity
            const minVertex = Infinity
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

//test('data/scc.2.txt', [3, 3, 3]);
//test('scc.1.txt', [1, 1, 3]);
module.exports = {
    test,
    findSCCs
}
