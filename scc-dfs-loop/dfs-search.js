const { readFileAsMatrix } = require('../utils/fs');
const { Edge } = require('../utils/graphs');

function fillInOrder(graph, vertex, visited = new Set(), finishingTimes = null, t = 0) {
  visited.add(vertex);
  const edges = graph.get(vertex).in;
  const iterator = edges.values();
  let nextEdge = iterator.next();
  while (!nextEdge.done) {
    const nextVertex = nextEdge.value.getHead();
    if (!visited.has(nextVertex)) {
      t = fillInOrder(graph, nextVertex, visited, finishingTimes, t);
    }
    nextEdge = iterator.next();
    t += 1;
    finishingTimes.set(t, vertex);
  }

  return t;
}

function DFSLoop(graph, vertex, visited = new Set(), visitedOnCurrentLoop = new Set()) {
  visited.add(vertex);
  visitedOnCurrentLoop.add(vertex);
  const edges = graph.get(vertex).out;
  const iterator = edges.values();
  let nextEdge = iterator.next();
  while (!nextEdge.done) {
    const nextVertex = nextEdge.value.getTail();
    if (!visited.has(nextVertex)) {
      DFSLoop(graph, nextVertex, visited, visitedOnCurrentLoop);
    }
    nextEdge = iterator.next();
  }
}

function findSCCs(graph, maxVertex, minVertex) {
  const finishingTimes = new Map();
  const visited = new Set();
  let t = 0;
  for (let i = maxVertex; i >= minVertex; i--) {
    if (!graph.get(i)) {
      continue;
    }
    if (!visited.has(i)) {
      t = fillInOrder(graph, i, visited, finishingTimes, t);
    }
  }
  visited.clear();
  let i = finishingTimes.size;
  const sccs = [];
  for (; i > 0; i--) {
    const vertex = finishingTimes.get(i);
    if (!visited.has(vertex)) {
      const visitedOnCurrentLoop = new Set();
      DFSLoop(graph, vertex, visited, visitedOnCurrentLoop);
      sccs.push(visitedOnCurrentLoop);
    }
  }
  return sccs;
}

function test(file) {
  readFileAsMatrix(file)
    .then((matrix) => {
      const graph = new Map();
      let maxVertex = -Infinity;
      let minVertex = Infinity;
      matrix.forEach((line) => {
        const vertexALabel = parseFloat(line[0]);
        const vertexBLabel = parseFloat(line[1]);
        const edgesA = graph.get(vertexALabel) || { out: new Set(), in: new Set() };
        const edgesB = graph.get(vertexBLabel) || { out: new Set(), in: new Set() };
        const edge = new Edge(vertexALabel, vertexBLabel, 0);
        edgesA.out.add(edge);
        edgesB.in.add(edge);
        graph.set(vertexALabel, edgesA);
        graph.set(vertexBLabel, edgesB);
        maxVertex = Math.max(maxVertex, vertexALabel, vertexBLabel);
        minVertex = Math.min(minVertex, vertexALabel, vertexBLabel);
      });
      return [graph, maxVertex, minVertex];
    })
    .then((result) => findSCCs(result[0], result[1], result[2]));
}

module.exports = {
  test,
  findSCCs,
};
