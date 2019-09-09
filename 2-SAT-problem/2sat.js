const { readFileAsMatrix } = require('../utils/fs');
const { Edge } = require('../utils/graphs');
const { findSCCs } = require('../scc-dfs-loop/dfs-search');

function twoSATProblemSolver(graph, max, min) {
  const sccs = findSCCs(graph, max, min);
  for (let i = 0; i < sccs.length; i++) {
    const iterator = sccs[i].values();
    let next = iterator.next();
    while (!next.done) {
      if (sccs[i].has(next.value) && sccs[i].has(next.value * (-1))) {
        return false;
      }
      next = iterator.next();
    }
  }
  return true;
}

function getGraph(file) {
  return readFileAsMatrix(file).then((matrix) => {
    const graph = new Map();
    let maxVertex = -Infinity;
    let minVertex = Infinity;
    matrix.forEach((line) => {
      const vertexALabel = parseFloat(line[0]);
      const vertexBLabel = parseFloat(line[1]);
      const vertexNotALabel = vertexALabel * (-1);
      const vertexNotBLabel = vertexBLabel * (-1);

      const edgesA = graph.get(vertexALabel) || { out: new Set(), in: new Set() };
      graph.set(vertexALabel, edgesA);
      const edgesB = graph.get(vertexBLabel) || { out: new Set(), in: new Set() };
      graph.set(vertexBLabel, edgesB);
      const edgesNotA = graph.get(vertexNotALabel) || { out: new Set(), in: new Set() };
      graph.set(vertexNotALabel, edgesNotA);
      const edgesNotB = graph.get(vertexNotBLabel) || { out: new Set(), in: new Set() };
      graph.set(vertexNotBLabel, edgesNotB);

      edgesNotA.out.add(new Edge(vertexNotALabel, vertexBLabel, 0));
      edgesB.in.add(new Edge(vertexNotALabel, vertexBLabel, 0));

      edgesNotB.out.add(new Edge(vertexNotBLabel, vertexALabel, 0));
      edgesA.in.add(new Edge(vertexNotBLabel, vertexALabel, 0));

      graph.set(vertexALabel, edgesA);
      graph.set(vertexBLabel, edgesB);
      graph.set(vertexNotALabel, edgesNotA);
      graph.set(vertexNotBLabel, edgesNotB);
      maxVertex = Math.max(maxVertex, vertexALabel, vertexBLabel, vertexNotALabel, vertexNotBLabel);
      minVertex = Math.min(minVertex, vertexALabel, vertexBLabel, vertexNotALabel, vertexNotBLabel);
    });
    return [graph, maxVertex, minVertex];
  });
}

function test(file) {
  return getGraph(file)
    .then((result) => {
      const answer = twoSATProblemSolver(result[0], result[1], result[2]);
      return answer ? 1 : 0;
    });
}

module.exports = {
  test,
  twoSATProblemSolver,
};
