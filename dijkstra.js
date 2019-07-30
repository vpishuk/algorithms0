const {LOGGER, readFile} = require('./utils');

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
        return line
            .replace(/\s+/gi, " ")
            .split(" ")
            .reduce((acc, i, idx) => {
                acc.edges = acc.edges || [];
                if (i) {
                    if (idx == 0) {
                        acc.vertex = parseInt(i, 10);
                    }
                    acc.edges.push(i.split(',').map(k => parseInt(k, 10))) 
                }
                return acc;
            }, {});
    }).then(arr => {
        console.log('read done');
        return arr.reduce((acc, curr) => {
            acc.set(curr.vertex, curr.edges);
            return acc;
        }, new Map());
    })
}

function test(file, listOfVertexes, expected) {
    getGraph(file)
    .then(graph => {
        console.log('struct done');
        const answer = DijkstraShortestPath(graph, 1);
        //console.log(answer);
        const res = listOfVertexes.map(v => answer.get(v) || 1000000);
        console.log(res.join(','));
        //const res = listOfVertexes.map(v => answer[v]).join(',');
        //console.log('Result:', res);
        //console.log('status:', (expected.join(',') === res ? 'SUCCESS' : 'FAILED'));
    });
}

test('dijkstras.txt', [7,37,59,82,99,115,133,165,188,197]);
//console.log(findMinVertex(m));
