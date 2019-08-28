const {readFileAsMatrix} = require('../utils/fs');
const {Edge, Vertex} = require('../utils/graphs');
const {findSCCs, isInSCC} = require('../scc-dfs-loop/dfs-search');

function twoSATProblemSolver(graph, max, min) {
    const sccs = findSCCs(graph, max, min)
    console.log('SCCS build finished')
    for (let i = 0; i < sccs.length; i++) {
        const iterator = sccs[i].values()
        let next = iterator.next()
        while (!next.done) {
            if (sccs[i].has(next.value) && sccs[i].has(next.value * (-1))) {
                console.log(sccs[i])
                return false;
            }
            next = iterator.next()
        }
    }
    return true
}

function getGraph(file) {
    return readFileAsMatrix(file).then((matrix) => {
        const graph = new Map()
        let maxVertex = -Infinity
        let minVertex = Infinity
        matrix.forEach(line => {
            const vertexALabel = parseFloat(line[0])
            const vertexBLabel = parseFloat(line[1])
            const vertexNotALabel = vertexALabel*(-1)
            const vertexNotBLabel = vertexBLabel*(-1)

            const edgesA = graph.get(vertexALabel) || {out: new Set(), in: new Set()}
            graph.set(vertexALabel, edgesA)
            const edgesB = graph.get(vertexBLabel) || {out: new Set(), in: new Set()}
            graph.set(vertexBLabel, edgesB)
            const edgesNotA = graph.get(vertexNotALabel) || {out: new Set(), in: new Set()}
            graph.set(vertexNotALabel, edgesNotA)
            const edgesNotB = graph.get(vertexNotBLabel) || {out: new Set(), in: new Set()}
            graph.set(vertexNotBLabel, edgesNotB)

            // if (vertexALabel === 8 || vertexALabel === -8 || vertexBLabel === 8 || vertexBLabel === -8) {
            //     console.log('A', vertexALabel, 'B', vertexBLabel, 'NOT A', vertexNotALabel, 'NOT B', vertexNotBLabel)
            //     console.log(vertexNotALabel, '=>', vertexBLabel, ',', vertexNotBLabel, '=>', vertexALabel)
            //     console.log('EDGES A',vertexALabel, edgesA)
            //     console.log('EDGES B', vertexBLabel, edgesB)
            //     console.log('EDGES NOT A', vertexNotALabel, edgesNotA)
            //     console.log('EDGES NOT B', vertexNotBLabel, edgesNotB)
            //     console.log('------')
            // }

            edgesNotA.out.add(new Edge(vertexNotALabel, vertexBLabel, 0))
            edgesB.in.add(new Edge(vertexNotALabel, vertexBLabel, 0))

            edgesNotB.out.add(new Edge(vertexNotBLabel, vertexALabel, 0))
            edgesA.in.add(new Edge(vertexNotBLabel, vertexALabel, 0))


            // if (vertexALabel === 8 || vertexALabel === -8 || vertexBLabel === 8 || vertexBLabel === -8) {
            //     console.log('EDGES',vertexALabel, edgesA)
            //     console.log('EDGES B', vertexBLabel, edgesB)
            //     console.log('EDGES NOT A', vertexNotALabel, edgesNotA)
            //     console.log('EDGES NOT B', vertexNotBLabel, edgesNotB)
            //     console.log('------')
            // }

            graph.set(vertexALabel, edgesA)
            graph.set(vertexBLabel, edgesB)
            graph.set(vertexNotALabel, edgesNotA)
            graph.set(vertexNotBLabel, edgesNotB)
            maxVertex = Math.max(maxVertex, vertexALabel, vertexBLabel, vertexNotALabel, vertexNotBLabel)
            minVertex = Math.min(minVertex, vertexALabel, vertexBLabel, vertexNotALabel, vertexNotBLabel)

        })
        return [graph, maxVertex, minVertex]
    })
}

function test(file) {
    return getGraph(file)
    .then((result) => {
        console.log('processing', file)
        
        // console.log('e 1')
        // console.dir(graph.get(1))
        // console.log('----')
        // console.log('')
        // console.log('e 2')
        // console.dir(graph.get(2))
        // console.log('----')
        // console.log('')
        // console.log('e 3')
        // console.dir(graph.get(3))
        // console.log('----')
        // console.log('')
        // console.log('e 4')
        // console.dir(graph.get(4))
        // console.log('----')
        // console.log('')
        // console.log('e 6')
        // console.dir(graph.get(6))
        // console.log('----')
        // console.log('')
        // console.log('e 8')
        // console.dir(graph.get(8))
        // console.log('----')
        // console.log('')

        // console.log('e -1')
        // console.dir(graph.get(-1))
        // console.log('----')
        // console.log('')
        // console.log('e -2')
        // console.dir(graph.get(-2))
        // console.log('----')
        // console.log('')
        // console.log('e -3')
        // console.dir(graph.get(-3))
        // console.log('----')
        // console.log('')
        // console.log('e -4')
        // console.dir(graph.get(-4))
        // console.log('----')
        // console.log('')
        // console.log('e -6')
        // console.dir(graph.get(-6))
        // console.log('----')
        // console.log('')
        // console.log('e -8')
        // console.dir(graph.get(-8))
        // console.log('----')
        // console.log('')
        // return
        const answer = twoSATProblemSolver(result[0], result[1], result[2]);
        console.log('finished', file)
        return answer ? 1 : 0
    });
}

module.exports = {
    test,
    twoSATProblemSolver
}

test('data/test.txt').then((answer) => console.log(answer))

// Promise.all([
//     test('data/2sat1.txt'),
//     test('data/2sat2.txt'),
//     test('data/2sat3.txt'),
//     test('data/2sat4.txt'),
//     test('data/2sat5.txt'),
//     test('data/2sat6.txt'),
// ]).then(a => console.log(a.join('')))
//console.log(findMinVertex(m));
