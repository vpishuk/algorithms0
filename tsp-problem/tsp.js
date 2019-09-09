const { readFileAsMatrix } = require('../utils/fs');

function getKey(path) {
  return path.join('');
}

function getCombinations(allVertexes, start, size, path, paths) {
  paths = paths || [];
  if (size <= 0) {
    paths.push(path);
    return;
  }
  for (let i = start; i < allVertexes.length; i++) {
    const subpath = path ? path.slice() : [];
    subpath.push(allVertexes[i]);
    getCombinations(allVertexes, i + 1, size - 1, subpath, paths);
  }
}

function TSPProblem(vertices, distances) {
  let currState = new Map();
  let prevState = new Map();
  const startVertex = vertices[0];
  prevState.set(getKey([startVertex]), [0, 0]);
  for (let i = 1; i < vertices.length; i++) {
    const key = getKey([vertices[i]]);
    prevState.set(key, [Infinity]);
    const val = [Infinity];
    val[vertices[i]] = distances[startVertex][vertices[i]];
    prevState.set(`0${key}`, val);
  }
  let paths = [];
  for (let m = 2; m <= vertices.length; m++) {
    currState = new Map();
    paths = [];
    getCombinations(vertices, 0, m, [], paths);
    // for each set from sets
    for (let p = 0; p < paths.length; p++) {
      if (paths[p][0] !== startVertex) {
        continue;
      }
      const path = paths[p];
      const pathKey = getKey(path);
      for (let j = 0; j < path.length; j++) {
        const jElem = path[j];
        if (jElem === startVertex) {
          continue;
        }
        let minDist = Infinity;
        path[j] = null;
        const pathWithoutJKey = getKey(path);
        path[j] = jElem;
        for (let k = 0; k < path.length; k++) {
          const kElem = path[k];
          if (kElem === jElem) {
            continue;
          }
          const Ckj = distances[jElem][kElem];
          const newDistance = prevState.get(pathWithoutJKey)[kElem] + Ckj;
          if (newDistance < minDist) {
            minDist = newDistance;
          }
        }
        const values = currState.get(pathKey) || [];
        values[jElem] = minDist;
        currState.set(pathKey, values);
      }
    }
    prevState = currState;
  }
  const key = getKey(vertices);
  const values = currState.get(key);
  let minCost = Infinity;

  for (let j = 1; j < vertices.length; j++) {
    const Cij = distances[startVertex][vertices[j]];
    if (values[vertices[j]] + Cij < minCost) {
      minCost = values[vertices[j]] + Cij;
    }
  }
  return minCost;
}

function getGraph(file) {
  return readFileAsMatrix(file).then((matrix) => {
    const vertices = [];
    // const edges = []
    const distances = [];
    for (let i = 0; i < matrix.length; i++) {
      vertices.push(i);
      const [x, y] = matrix[i];
      for (let k = 0; k < vertices.length; k++) {
        if (k === i) continue;
        const [z, w] = matrix[k];
        const distance = Math.sqrt(((x - z) ** 2) + ((y - w) ** 2));
        distances[i] = distances[i] || [];
        distances[i][k] = distance;
        distances[k] = distances[k] || [];
        distances[k][i] = distance;
      }
    }
    return [vertices, distances];
  });
}

module.exports = {
  TSPProblem,
  getGraph,
};
