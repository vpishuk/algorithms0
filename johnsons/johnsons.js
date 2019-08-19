const {readFileAsMatrix} = require('../utils/fs');
const {Edge, Vertex} = require('../utils/graphs');
const {BellmanFord} = require('../bellman-ford/bellman-ford');

function Johnsons(vertices, edges) {
    const vPrime = new Vertex(0, 0)
    
}

function getGraph(file) {
    return readFileAsMatrix(file).then((matrix) => {
        const vertices = new Map()
        const edges = []
        matrix.forEach(line => {
            const edge = new Edge(line[0], line[1], line[2])
            const veretexA = vertices.get(line[0]) || new Vertex(line[0], 0)
            const veretexB = vertices.get(line[1]) || new Vertex(line[1], 0)
            vertices.set(line[0], veretexA)
            vertices.set(line[1], veretexB)
            edges.push(edge)
        })
        return [Array.from(vertices.values()), edges]
    })
}

function test(file) {
    getGraph(file)
    .then(([vertices, edges]) => {
        //console.dir(edges)
        const answer = Johnsons(vertices, edges);
        console.log(answer ? Math.min(...answer) : 'NULL');
    });
}

module.exports = {
    test,
    Johnsons
}

//test('data/test.txt');
//console.log(findMinVertex(m));
