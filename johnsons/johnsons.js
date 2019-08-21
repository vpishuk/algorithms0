const {readFileAsMatrix} = require('../utils/fs');
const {Edge, Vertex} = require('../utils/graphs');
const {BellmanFord} = require('../bellman-ford/bellman-ford');
const {DijkstraShortestPath} = require('../dijkstra/dijkstra');

function Johnsons(vertices, edges) {
    if (vertices.size <= 0) {
        return null
    }
    const vPrime = new Vertex(0, 0)
    let arrayOfVertices = Array.from(vertices.values())
    const edgesPrime = arrayOfVertices.map(v => new Edge(0, v.getLabel(), 0))
    arrayOfVertices.push(vPrime)
    const bellmanFordPaths = BellmanFord(arrayOfVertices, [...edgesPrime, ...edges], vPrime)
    arrayOfVertices = null
    //console.log(bellmanFordPaths)
    if (!bellmanFordPaths) {
        return null
    }
    // console.log('vertices.get(1)', vertices.get(1))
    let iterator = vertices.values()
    let next  = iterator.next()
    do {
        const {value} = next
        value.edges.forEach(edge => {
            const tail = bellmanFordPaths[edge.getTail()]
            const head = bellmanFordPaths[edge.getHead()]
            edge.setCost(edge.getCost() + tail - head)
        })
        next = iterator.next()
    } while(!next.done)
    // console.log('vertices.get(1)', vertices.get(1))
    // console.log('vertices.get(@)', vertices.get(1))
    let shortestShortest = Infinity
    iterator = vertices.values()
    next = iterator.next()

    do {
        const {value} = next
        const dijkstraScores = DijkstraShortestPath(vertices, value.getLabel())
        dijkstraScores.delete(value.getLabel())
        //console.log('scores for ', value.getLabel(), dijkstraScores)
        Array.from(dijkstraScores.entries()).forEach(([vertexLabel, score]) => {
            const tail = bellmanFordPaths[vertexLabel]
            const head = bellmanFordPaths[value.getLabel()]
            const shortestPath = score + tail - head
            shortestShortest = Math.min(shortestShortest, shortestPath)
        }) 
        next = iterator.next()
    } while(!next.done)
    return shortestShortest
}

function getGraph(file) {
    return readFileAsMatrix(file).then((matrix) => {
        const vertices = new Map()
        const edges = []
        matrix.forEach(line => {
            const edge = new Edge(line[0], line[1], line[2])
            const veretexA = vertices.get(line[0]) || new Vertex(line[0], 0)
            const veretexB = vertices.get(line[1]) || new Vertex(line[1], 0)
            veretexA.addEdge(edge)
            vertices.set(line[0], veretexA)
            vertices.set(line[1], veretexB)
            edges.push(edge)
        })
        return [vertices, edges]
    })
}

function test(file) {
    return getGraph(file)
    .then(([vertices, edges]) => {
        //console.dir(edges)
        return Johnsons(vertices, edges);
    });
}

module.exports = {
    test,
    Johnsons
}

async function getForAll() {
    const g1 = await test('data/g1.txt') // -196775
    console.log('g1', g1)
    const g2 = await test('data/g2.txt') //-154685
    console.log('g2', g2)
    const g3 = await test('data/g3.txt') //-18
    console.log('g3', g3)
    console.log(g1, g2, g3)
}

getForAll()//
//console.log(findMinVertex(m));
//test('data/test.txt').then(answer => answer === null ? 'NULL' : console.log(answer.toString()))
