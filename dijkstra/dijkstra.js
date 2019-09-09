const { readFile } = require('../utils/fs');
const { MinHeap } = require('../utils/heap');
const { Edge, Vertex } = require('../utils/graphs');

class HeapElem {
  constructor(vertex, cost) {
    this.vertex = parseInt(vertex, 10);
    this.cost = parseInt(cost, 10);
  }

  valueOf() {
    return this.cost;
  }
}


function DijkstraShortestPath(graph, sVertexLabel) {
  const visited = new Set();
  const heap = new MinHeap();
  const scores = new Map();
  const sVertex = graph.get(sVertexLabel);
  sVertex.setWeight(0);
  heap.insert(new HeapElem(sVertexLabel, 0));
  do {
    // console.log('-------')
    // console.log('ITERATION')
    // console.log(heap)
    // console.log('SCORES')
    // console.log(scores)
    const heapElem = heap.extract();
    if (visited.has(heapElem.vertex)) {
      continue;
    }
    // console.log('heap elem')
    // console.log(heapElem)
    const vertex = graph.get(heapElem.vertex);
    visited.add(heapElem.vertex);
    const dijkstraScore = vertex.getWeight();
    // console.log('vertex', vertex)
    const edges = vertex.getEdges();
    for (let i = 0; i < edges.length; i++) {
      const adjacentVertex = graph.get(edges[i].vertexB);
      const weight = edges[i].cost;
      if (!visited.has(adjacentVertex)) {
        const oldScore = adjacentVertex.getWeight();
        const newScore = weight + dijkstraScore;
        const currScore = newScore < oldScore ? newScore : oldScore;
        // console.log('before set', adjacentVertex, oldScore, newScore, currScore)
        adjacentVertex.setWeight(currScore);
        heap.insert(new HeapElem(adjacentVertex.getLabel(), currScore));
      }
    }
    // console.log('calculated score', vertex.getLabel(), dijkstraScore)
    scores.set(vertex.getLabel(), dijkstraScore);
  } while (heap.size() > 0);

  // console.log('--------')
  // console.log('OUT')
  // console.log(scores)
  // console.log('--------')
  return scores;
}

function getGraph(file) {
  const graph = new Map();
  return readFile(file, (line) => {
    let vertex;
    line
      .replace(/\s+/gi, ' ')
      .trim()
      .split(' ')
      .forEach((i, idx) => {
        if (idx === 0) {
          const label = parseInt(i, 10);
          if (graph.has(label)) {
            vertex = graph.get(label);
          } else {
            vertex = new Vertex(label);
          }
        } else {
          const arr = i.split(',').map((k) => parseInt(k, 10));
          const veretexB = parseInt(arr[0], 10);
          vertex.addEdge(new Edge(vertex.label, veretexB, arr[1]));
          if (!graph.has(veretexB)) {
            graph.set(veretexB, new Vertex(veretexB));
          }
        }
      });
    graph.set(vertex.getLabel(), vertex);
  }).then(() => graph);
}

function test(file, listOfVertexes, expected) {
  getGraph(file)
    .then((graph) => {
      const answer = DijkstraShortestPath(graph, 1);
      const res = listOfVertexes.map((v) => answer.get(v) || 1000000);
      console.log(res.join(','));
    });
}

module.exports = {
  test,
  DijkstraShortestPath,
};
// console.log(findMinVertex(m));
