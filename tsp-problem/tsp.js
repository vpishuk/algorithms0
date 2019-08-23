const {readFileAsMatrix} = require('../utils/fs');
const {Edge, Vertex} = require('../utils/graphs');

function minRouteDFSLoop(vertices, startingPoint) {
    // const stack = [startingPoint]
    // const visited = new Set()
    // do {
    //     const vA = stack.shift()
    //     const coordsA = vA.getMetadta('coords')
    //     for (let k = 0; k < vertices.length; k++) {
    //         const vB = vertices[k]
    //         const coordsB = vB.getMetadta('coords')
    //         const distance = Math.sqrt(Math.pow(Math.abs(coordsA.x - coordsB.x), 2) + Math.pow(Math.abs(coordsA.y - coordsB.y), 2))

    //     }
    //     vertex.getEdges().forEach((edge) => {
    //         const target = edge.getTail() !== vertex.getLabel() ? edge.getTail() : 
    //     })
    // } while (stack.length > 0)
}

function TSPProblem(vertices) {
    //return minRouteDFSLoop(vertices, vertices[i])
}

function getGraph(file) {
    return readFileAsMatrix(file).then((matrix) => {
        const vertices = []
        matrix.forEach((line, idx) => {
            const vertex = new Vertex(idx + 1, 0)
            vertex.setMetadta({coords: {x: line[0], y: line[1]}})
            vertices.push(vertex)
        })
        // for (let i = 0; i < vertices.length; i++) {
        //     const vA = vertices[i]
        //     const coordsA = vA.getMetadta('coords')
        //     for (let k = i + 1; k < vertices.length; k++) {
        //         const vB = vertices[k]
        //         const coordsB = vB.getMetadta('coords')
        //         const distance = Math.sqrt(Math.pow(Math.abs(coordsA.x - coordsB.x), 2) + Math.pow(Math.abs(coordsA.y - coordsB.y), 2))
        //         //const edge = new Edge(vA.getLabel(), vB.getLabel(), distance)
        //         //vA.addEdge(edge)
        //         //vB.addEdge(edge)
        //         //edges.push(edge)
        //     }
        // }
        return vertices
    })
}

function test(file) {
    return getGraph(file)
    .then((vertices) => {
        console.dir(vertices)
        return TSPProblem(vertices);
    });
}

module.exports = {
    test,
    TSPProblem
}

test('data/test.txt').then(answer => console.log(answer))
