const { readFileAsMatrix } = require('../utils/fs');
const { Vertex } = require('../utils/graphs');
const { kClustering, Edge } = require('../k-klustering/k-klustering')

function factorial(n) {
    if (n <= 1) {
        return 1
    }
    if (n <= 2) {
        return 2
    }
    return n * factorial(n - 1)
}

function calcCombinations(n, k) {
    return factorial(n) / (factorial(n - k) * factorial(k))
}

function generateSets(m, arr) {
    // const totalAmountOfSets = calcCombinations(arr.length - 1, m)
    // const allSets = [];
    // for (let k = 0; k < arr.length; k++) {
    //     const set = [arr[0]].concat(generateSets(m - 1, ))
    //     for (let i = 0; i < m; i++) {
    //         set.add(originalSet[i])
    //     } 
    // }
    // set.add(startVertex)
}

function getKey(path) {
    return path.map(v => v ? v.getLabel() : '').join('')
}

function getCombinations(allVertexes, start, size, path, paths) {
    paths = paths || []
    if (size <= 0) {
        paths.push(path)
        return
    }
    for (let i = start; i < allVertexes.length; i++) {
        const subpath = path ? path.slice() : []
        subpath.push(allVertexes[i])
        getCombinations(allVertexes, i + 1, size - 1, subpath, paths)
    }
    return paths;
}

function TSPProblem(vertices, distances, r) {
    const A = new Map()
    const startVertex = vertices[0]
    A.set(getKey([startVertex]), [0, 0])
    for (i = 1; i < vertices.length; i++) {
        const key = getKey([vertices[i]])
        A.set(key, [Infinity, Infinity])
    }
    // console.log(A)
    const spaces = (new Array(5)).fill(' ').join('')
    const dashes = "-----------------------------"
    for (let m = 2; m <= vertices.length; m++) {
        console.log(dashes)
        console.log("SIZE of SET", m)
        // console.log("-----")
        const paths = getCombinations(vertices, 0, m)
        // for each set from sets
        for (let p = 0; p < paths.length; p++) {
            // console.log(spaces.repeat(2) + "-----")
            // console.log(spaces.repeat(2) + "SET", getKey(paths[p]))
            if (paths[p].indexOf(startVertex) < 0) {
                // console.log(spaces.repeat(2) + "SKIPPED...")
                continue
            }
            const path = paths[p]
            const pathKey = getKey(path)
            // for each element j from set
            for (let j = 0; j < path.length; j++) {
                const jElem = path[j]
                const jl = jElem.getLabel()
                // console.log(spaces.repeat(3) + "-----")
                // console.log(spaces.repeat(3) + "jElem", jElem.getLabel())
                // console.log(spaces.repeat(3))
                if (jl === startVertex.getLabel()) {
                    // console.log(spaces.repeat(3) + "SKIPPED")
                    continue
                }
                let minDist = Infinity
                path[j] = null
                const pathWithoutJKey = getKey(path);
                // console.log(spaces.repeat(3) + "pathWithoutJKey", pathWithoutJKey)
                // console.log(spaces.repeat(3) + "pathWithoutJKey value", A.get(pathWithoutJKey))
                path[j] = jElem
                // count minDistance
                for (let k = 0; k < path.length; k++) {
                    const kElem = path[k]
                    const kl = kElem.getLabel()
                    if (kl === jl) {
                        continue
                    }
                    const Ckj = distances.get(`${kl}_${jl}`)
                    // console.log(spaces.repeat(4), `A[S - ${j}, ${k}]`, A.get(pathWithoutJKey)[kl])
                    const newDistance = A.get(pathWithoutJKey)[kl] + Ckj
                    if (newDistance < minDist) {
                        minDist = newDistance
                    }
                }
                // console.log(spaces.repeat(3) + `A[S,${jl}]`, minDist)
                const values = A.get(pathKey) || []
                values[jl] = minDist
                A.set(pathKey, values)
            }
            // console.log(spaces.repeat(2) + "-----")
        }
    }
    const key = getKey(vertices)
    const values = A.get(key)
    let minCost = Infinity
    // console.log("-----")
    // console.log(A)
    // console.log("-----")
    // console.log(distances)
    // console.log("-----")
    // console.log(values)
    
    for (let j = 1; j < values.length; j++) {
        const Cij = distances.get(`${startVertex.getLabel()}_${j}`)
        if (values[j] + Cij < minCost) {
            minCost = values[j] + Cij
        }
    }
    return minCost
}

function getGraph(file) {
    return readFileAsMatrix(file).then((matrix) => {
        const vertices = []
        //const edges = []
        const distances = new Map()
        matrix.forEach((line, idx) => {
            const vertex = new Vertex(idx, 0)
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

const p1 = getGraph('data/tsp.txt')
    .then(([vertices, distances]) => {
        //const paths = getCombinations(vertices, 0, 5);
        //console.log(paths)
        console.log(distances)
        const result = TSPProblem(vertices, distances)
        console.log(result)
        return result
    })