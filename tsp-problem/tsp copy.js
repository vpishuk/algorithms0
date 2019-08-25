const { readFileAsMatrix } = require('../utils/fs');
const { Vertex } = require('../utils/graphs');
const { kClustering, Edge } = require('../k-klustering/k-klustering')

function TSPProblem(vertices, distances, r) {
    if (vertices.length === 1) {
        return [0, vertices[0], [vertices[0]]]
    }

    r = r || 0
    let path = []
    let lastVertex = null
    const startVertex = vertices[0]
    let minCost = Infinity
    let subproblem = []
    const spacing = (new Array(r)).fill('      ', 0, r).join('') + "+"
    console.log(spacing, '-----------------')
    console.log(spacing, 'Level #', r)
    for (let m = 1; m < vertices.length; m++) {
        subproblem = [vertices[m]];
        for (let i = 1; i < vertices.length; i++) {
            if (i != m) {
                subproblem.push(vertices[i])
            }
        }
        console.log(spacing, 'Iteration #', m)
        console.log(spacing, '----')
        console.log(spacing, subproblem)
        console.log(spacing, 'sV', startVertex.getLabel(), 'm', vertices[m].getLabel(), 'distance', distances.get(`${startVertex.getLabel()}_${vertices[m].getLabel()}`))
        const result = TSPProblem(subproblem, distances, r + 1)
        const startToEndCost = distances.get(`${startVertex.getLabel()}_${result[1].getLabel()}`);
        const subproblemCost = result[0]
        let newCost = subproblemCost + distances.get(`${startVertex.getLabel()}_${vertices[m].getLabel()}`)
        if (r === 0 ) {
            newCost = newCost + startToEndCost;
        }
        if (newCost < minCost) {
            //console.log(spacing, 'changing mincost', 'prev path', path[r])
            minCost = newCost
            lastVertex = result[1]
            path = result[2]
        }
        console.log(spacing, 'subproblemCost', subproblemCost, 'cost', newCost, 'minCost', minCost)
        console.log(spacing, 'last vertex', lastVertex.getLabel())
        //console.log(spacing, 'path', path)
    }
    path.push(startVertex)
    console.log(spacing, 'path', path)
    console.log(spacing, 'END Recursion #', r)
    console.log(spacing, '-----------------')
    return r === 0 ? [minCost + distances.get(`${startVertex.getLabel()}_${lastVertex.getLabel()}`), lastVertex, path] : [minCost, lastVertex, path];
}

function getGraph(file) {
    return readFileAsMatrix(file).then((matrix) => {
        const vertices = []
        //const edges = []
        const distances = new Map()
        matrix.forEach((line, idx) => {
            const vertex = new Vertex(idx + 1, 0)
            vertex.setMetadta({ coords: { x: line[0], y: line[1] } })
            vertices.push(vertex)
        })
        for (let i = 0; i < vertices.length; i++) {
            const vA = vertices[i]
            const coordsA = vA.getMetadta('coords')
            for (let k = 0; k < vertices.length; k++) {
                if (k === i) continue;
                const vB = vertices[k]
                const coordsB = vB.getMetadta('coords')
                const distance = Math.sqrt(Math.pow(coordsA.x - coordsB.x, 2) + Math.pow(coordsA.y - coordsB.y, 2))
                distances.set(`${vA.getLabel()}_${vB.getLabel()}`, distance)
                distances.set(`${vB.getLabel()}_${vA.getLabel()}`, distance)
                //edges.push(new Edge(vA, vB, distance))
            }
        }
        return [vertices, distances]
    })
}

module.exports = {
    TSPProblem
}

// getGraph('data/tsp.txt')
//     .then(([vertices, distances, edges]) => {
//         const [a, clustering] = kClustering({ setOfEdges: new Set(edges), setOfVertexes: new Set(vertices) }, 3)
//         // console.log(distances.get('13_12'))
//         // console.log(distances.get('1_6'))

//         console.log(clustering.getClusterized())
//     })

//const left = 14857.412337607882
//const right = 17633.798342533977


const p1 = getGraph('data/test3.txt')
    .then(([vertices, distances]) => {
        console.log(vertices.map(v => v.meta))
        console.log(distances)
        const result = TSPProblem(vertices, distances)
        console.log(Math.floor(result[0]))
        console.log('PATH', result[2])
        return result
    })

// const p2 = getGraph('data/test.txt')
//     .then(([vertices, distances, edges]) => {
//         const result = TSPProblem(vertices, distances)
//         console.log(result)
//         return result
//     })

// Promise.all([p1, p2]).then(([c1, c2]) => {
//     console.log(Math.floor(c1 + c2 - 370.66966425646433))
// })
