const {LOGGER, readFile} = require('./utils');

function DFSLoop(graph, vertex, direction = 1, finishingTimes = new Map(), visited = new Set(), t = 0) {
    const visitedOnCurrentLoop = new Set([vertex]);
    const toVisitSet = [vertex];
    do {
        let next = toVisitSet.shift();
        if (!visited.has(next.value)) {
            visited.add(vertex);
            visitedOnCurrentLoop.add(vertex);
            const edges = (direction === 1 ? graph.heads.get(vertex) : graph.tails.get(vertex)) || new Set();
            edges.forEach(v => toVisitSet.push(v));
        }
    } while(toVisitSet.length > 0);
    t++;
    finishingTimes.set(t, vertex);
    return [visitedOnCurrentLoop, t];
}

function generateGraph(graph) {
    const heads = new Map();
    const tails = new Map();
    const vertexes = new Set();
    graph.forEach(element => {
        const setOfTails = heads.get(element.head) || new Set();
        setOfTails.add(element.tail);
        heads.set(element.head, setOfTails);

        const setOfHeads = tails.get(element.tail) || new Set();
        setOfHeads.add(element.head);
        tails.set(element.tail, setOfHeads);

        vertexes.add(element.head);
        vertexes.add(element.tail);
    });
    return {heads, tails, vertexes};
}

function findSCCs(graph, maxVertex, minVertex) {
    let finishingTimes = new Map();
    let visited = new Set();
    let t = 0, _ = null;
    console.log('starting from ', maxVertex)
    for (let i = maxVertex; i >= minVertex; i--) {
        if (!graph.get(i)) {
            continue;
        }
        if (!visited.has(i)) {
            [_, t] = DFSLoop(graph, i, -1, finishingTimes, visited, t);
        }
    }
    //finishingTimes.set(1, 3);
    //finishingTimes.set(2, 5);
    //finishingTimes.set(3, 5);
    //finishingTimes.set(4, 5);
    //finishingTimes.set(5, 6);
    //finishingTimes.set(6, 9);
    //finishingTimes.set(7, 1);
    //finishingTimes.set(8, 4);
    //finishingTimes.set(9, 7);
    //console.log(finishingTimes);
    //return [];
    visited.clear();
    let i = finishingTimes.size
    const sccs = [];
    for (; i > 0; i--) {
        let vertex = finishingTimes.get(i);
        if (!visited.has(vertex)) {
            sccs.push(DFSLoop(graph, vertex, 1, new Map(), visited));
        }
    }
    return sccs;
}

function countSizes(sccs) {
    return sccs.map(([set]) => set.size);
}

function test(file, expected) {
    readFile(file, (line) => {
        const arr = line
            .replace(/\s+/gi, " ")
            .split(" ")
            .map(i => parseInt(i, 10))
            .filter(i => !isNaN(i));
        return {head: arr[0], tail: arr[1]};
    })
    .then((graphData) => {
        return generateGraph(graphData);
    })
    .then(graph => {
        const sccs = findSCCs(graph);
        const counts = countSizes(sccs);
        //console.log('sccs:', sccs);
        console.log('Result:', counts.join(','));
        //console.log('status:', (expected.join(',') === counts.join(',') ? 'SUCCESS' : 'FAILED'));
    });
}

//test('scc.2.txt', [3, 3, 3]);
//test('scc.1.txt', [1, 1, 3]);
test('scc.txt', [1, 1, 3]);
