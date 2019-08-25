const { readFileAsMatrix } = require('../utils/fs');

function getKey(path) {
    return path.join('')
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
    let currState = new Map()
    let prevState = new Map()
    const startVertex = vertices[0]
    prevState.set(getKey([startVertex]), [0, 0])
    for (i = 1; i < vertices.length; i++) {
        const key = getKey([vertices[i]])
        prevState.set(key, [Infinity])
        const val = [Infinity]
        val[vertices[i]] = distances[startVertex][vertices[i]]
        prevState.set('0' + key, val)
    }
    let paths = []
    // console.log(A)
    // const spaces = (new Array(5)).fill(' ').join('')
    // const dashes = "-----------------------------"
    for (let m = 2; m <= vertices.length; m++) {
        currState = new Map()
        // console.log(dashes)
        // console.log("SIZE of SET", m)
        // console.log("-----")
        paths = getCombinations(vertices, 0, m)
        // for each set from sets
        for (let p = 0; p < paths.length; p++) {
            if (paths[p][0] !== startVertex) {
                continue
            }
            const path = paths[p]
            const pathKey = getKey(path)
            // for each element j from set
            for (let j = 0; j < path.length; j++) {
                const jElem = path[j]
                // console.log(spaces.repeat(3) + "-----")
                // console.log(spaces.repeat(3) + "jElem", jElem)
                // console.log(spaces.repeat(3))
                if (jElem === startVertex) {
                    // console.log(spaces.repeat(3) + "SKIPPED")
                    continue
                }
                let minDist = Infinity
                path[j] = null
                const pathWithoutJKey = getKey(path);
                // console.log( "pathWithoutJKey", pathWithoutJKey)
                // console.log( "pathWithoutJKey", prevState)
                // console.log(spaces.repeat(3) + "pathWithoutJKey value", A.get(pathWithoutJKey))
                path[j] = jElem
                // count minDistance
                for (let k = 0; k < path.length; k++) {
                    const kElem = path[k]
                    if (kElem === jElem) {
                        continue
                    }
                    const Ckj = distances[jElem][kElem]
                    // console.log(spaces.repeat(4), `A[S - ${j}, ${k}]`, A.get(pathWithoutJKey)[kElem])
                    const newDistance = prevState.get(pathWithoutJKey)[kElem] + Ckj
                    if (newDistance < minDist) {
                        minDist = newDistance
                    }
                }
                // console.log(spaces.repeat(3) + `A[S,${jl}]`, minDist)
                const values = currState.get(pathKey) || []
                values[jElem] = minDist
                currState.set(pathKey, values)
            }
            
            //console.log(A)
            // console.log(spaces.repeat(2) + "-----")
        }
        prevState = currState
    }
    const key = getKey(vertices)
    const values = currState.get(key)
    let minCost = Infinity
    // console.log(A)
    // console.log("-----")
    // console.log(A)
    // console.log("-----")
    // console.log(distances)
    // console.log("-----")
    // console.log(key.length, values.length)
    // console.log(key)
    // console.log(values)
    
    for (let j = 1; j < vertices.length; j++) {
        const Cij = distances[startVertex][vertices[j]]
        if (values[vertices[j]] + Cij < minCost) {
            minCost = values[vertices[j]] + Cij
        }
    }
    return minCost
}

function getGraph(file) {
    return readFileAsMatrix(file).then((matrix) => {
        const vertices = []
        //const edges = []
        const distances = []
        for (let i = 0; i < matrix.length; i++) {
            vertices.push(i)
            const [x,y] = matrix[i]
            for (let k = 0; k < vertices.length; k++) {
                if (k === i) continue;
                const [z,w] = matrix[k]
                const distance = Math.sqrt(Math.pow(x - z, 2) + Math.pow(y - w, 2))
                distances[i] = distances[i] || []
                distances[i][k] = distance
                distances[k] = distances[k] || []
                distances[k][i] = distance
            }
        }
        return [vertices, distances]
    })
}

module.exports = {
    TSPProblem
}

const p1 = getGraph('data/test4.txt')
    .then(([vertices, distances]) => {
        //const paths = getCombinations(vertices, 0, 5);
        //console.log(paths)
        const t1= (new Date()).getTime()
        const result = TSPProblem(vertices, distances)
        console.log(result)
        const t2 = (new Date()).getTime()
        console.log('time', t2 - t1)
        //console.log(distances[10][11])
        //console.log('11-ddd', distances[12])
        return result
    })
