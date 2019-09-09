const { readFileAsMatrix } = require('../utils/fs');
const { Edge, Vertex } = require('../utils/graphs');

function BellmanFord(vertices, edges, sVertex) {
  const distance = [];
  vertices.forEach((vertex, idx) => {
    distance[vertex.getLabel()] = Infinity;
  });
  distance[0] = Infinity;
  distance[sVertex.getLabel()] = 0;
  // console.log(sVertex)
  // console.log('INITIAL', distance.join(', '))

  for (let i = 0; i <= vertices.length; i++) {
    edges.forEach((edge) => {
      // console.log('\n-----')
      // console.log('va', edge.vertexA, 'vb', edge.vertexB, 'cost', edge.cost)
      // console.log('dva', distance[edge.vertexA], 'dvb', distance[edge.vertexB])
      if (distance[edge.vertexA] + edge.cost < distance[edge.vertexB]) {
        // console.log('set distance[edge.vertexB] to', distance[edge.vertexA] + edge.cost)
        distance[edge.vertexB] = distance[edge.vertexA] + edge.cost;
      } else {
        // console.log('no changes')
      }
    });
  }
  // console.log('results')
  // console.log(distance)
  // console.log('detecting negative cycles')
  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];
    if (distance[edge.vertexA] + edge.cost < distance[edge.vertexB]) {
      return null;
    }
  }
  return distance;
}

function getGraph(file) {
  return readFileAsMatrix(file).then((matrix) => {
    const vertices = new Map();
    const edges = [];
    matrix.forEach((line) => {
      const edge = new Edge(line[0], line[1], line[2]);
      const veretexA = vertices.get(line[0]) || new Vertex(line[0], 0);
      const veretexB = vertices.get(line[1]) || new Vertex(line[1], 0);
      vertices.set(line[0], veretexA);
      vertices.set(line[1], veretexB);
      edges.push(edge);
    });
    return [Array.from(vertices.values()), edges];
  });
}

function test(file) {
  getGraph(file)
    .then(([vertices, edges]) => {
      // console.dir(edges)
      const answer = BellmanFord(vertices, edges, vertices[0]);
      console.log(answer);
      console.log(answer ? Math.min(...answer) : 'NULL');
    });
}

module.exports = {
  test,
  BellmanFord,
};

// test('data/test.txt');
// console.log(findMinVertex(m));
