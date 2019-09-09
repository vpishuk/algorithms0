const path = require('path');
const { readFileAsMatrix } = require('../utils/fs');
const { MinHeap } = require('../utils/heap');
const UnionFind = require('../utils/union-find');

class Vertex {
  constructor(id) {
    this.id = id;
  }

  getLabel() {
    return this.id;
  }

  valueOf() {
    return this.id;
  }
}

class Edge {
  constructor(vertexA, vertexB, cost) {
    this.vertexA = vertexA;
    this.vertexB = vertexB;
    this.cost = cost;
  }

  valueOf() {
    return this.cost;
  }
}

function kClustering(graph, clusters) {
  const { setOfEdges, setOfVertexes } = graph;
  const minHeap = new MinHeap(setOfEdges);
  const unionFind = new UnionFind(setOfVertexes);
  // console.log('amount of clusters', unionFind.amountOfClusters())
  while (unionFind.amountOfClusters() > clusters && minHeap.size() > 0) {
    try {
      const minEdge = minHeap.extract();
      // console.log('cost', minEdge.cost, 'vertexA', minEdge.vertexA, 'vertexB', minEdge.vertexB)
      unionFind.union(minEdge.vertexA, minEdge.vertexB);
      if (minHeap.size() <= 0) {
        return [0, unionFind];
      }
    } catch (e) {
      console.error(e);
      return [0, null];
    }
  }
  if (minHeap.size() <= 0) {
    return [0, unionFind];
  }
  // console.log('---------------')
  // console.log('leaders', unionFind.clusterLeaders, '\n')
  while (minHeap.size() > 0) {
    const edge = minHeap.extract();
    const parentA = unionFind.find(edge.vertexA);
    const parentB = unionFind.find(edge.vertexB);
    // console.log('edge', edge)
    // console.log('vertextA has parent', parentA)
    // console.log('vertextB has parent', parentB)
    if (parentA !== parentB) {
      // console.log('Hurray!')
      return [edge.cost, unionFind];
    }

    if (minHeap.size() <= 0) {
      return [0, unionFind];
    }
  }
  return [0, unionFind];
}

function test(file, clusters) {
  readFileAsMatrix(path.resolve(__dirname, file))
    .then((graph) => {
      const setOfVertexes = new Set();
      const visited = new Set();
      const setOfEdges = new Set();

      graph.forEach((element) => {
        const vaId = parseInt(element[0], 10);
        const vbId = parseInt(element[1], 10);
        const cost = parseInt(element[2], 10);
        const va = new Vertex(vaId);
        const vb = new Vertex(vbId);
        const vbVaEdge = new Edge(vb, va, cost);

        setOfEdges.add(vbVaEdge);
        if (!visited.has(vaId)) setOfVertexes.add(va);
        if (!visited.has(vbId)) setOfVertexes.add(vb);
        visited.add(vaId);
        visited.add(vbId);
      });

      return { setOfEdges, setOfVertexes };
    })
    .then((data) => {
      const answer = kClustering(data, clusters);
      console.log(answer);
    });
}

module.exports = {
  kClustering,
  Edge,
  test,
};

// test('data/k-clustering.txt', 4); // 106
