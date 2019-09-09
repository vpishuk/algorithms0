const { readGraphAsAdjancyList, MinHeap } = require('./utils');

class Edge {
  constructor(vertexA, vertexB, cost) {
    this.vertexA = parseInt(vertexA, 10);
    this.vertexB = parseInt(vertexB, 10);
    this.cost = parseInt(cost, 10);
  }

  valueOf() {
    return this.cost;
  }
}

function PrimsMinSpanningTree(graph) {
  const edgesMap = new Map();
  let startVertex = null;
  const setOfVertixes = new Set();
  const maxCost = -Infinity;
  let minCost = Infinity;

  graph.forEach((element) => {
    const va = parseInt(element[0], 10);
    const vb = parseInt(element[1], 10);
    const cost = parseInt(element[2], 10);
    setOfVertixes.add(va);
    setOfVertixes.add(vb);

    const aSet = edgesMap.get(va) || new Set();
    aSet.add(new Edge(va, vb, cost));
    edgesMap.set(va, aSet);
    const bSet = edgesMap.get(vb) || new Set();
    bSet.add(new Edge(vb, va, cost));
    edgesMap.set(vb, bSet);
    startVertex = va;
    // startVertex = startVertex ? (cost < minCost ? vb : startVertex) : vb;
    minCost = cost < minCost ? cost : minCost;
  });

  const minheap = new MinHeap();
  const explored = new Set();
  let minSpanTreeWeight = 0;
  // console.log(edgesMap)
  do {
    // console.log('-----------------------')
    const setOfEdges = edgesMap.get(startVertex);
    if (setOfEdges) {
      Array.from(setOfEdges).forEach((edge) => {
        if (!explored.has(edge.vertexB)) {
          minheap.insert(edge);
        }
      });
    }
    // console.log('state')
    // console.log(startVertex, setOfEdges, minheap)
    let minEdge;

    explored.add(startVertex);
    do {
      minEdge = minheap.extract();
      if (minEdge && !explored.has(minEdge.vertexB) && explored.has(minEdge.vertexA)) {
        break;
      }
    } while (minEdge);
    if (minEdge) {
      // console.log(startVertex, minEdge.vertexB, '-', minEdge.cost)
      startVertex = minEdge.vertexB;
      minSpanTreeWeight += minEdge.cost;
    }

    // console.log('min edge')
    // console.log(minEdge, explored.size, setOfVertixes.size)
  } while (explored.size !== setOfVertixes.size - 1);
  return minSpanTreeWeight;
}

function test(file, expected) {
  readGraphAsAdjancyList(file)
    .then((graph) => {
      // console.log('struct done');
      const answer = PrimsMinSpanningTree(graph);
      // console.log(answer);
      console.log(answer);
      // const res = listOfVertexes.map(v => answer[v]).join(',');
      // console.log('Result:', res);
      // console.log('status:', (expected.join(',') === res ? 'SUCCESS' : 'FAILED'));
    });
}

test('min-span-tree_prim.txt', [7, 37, 59, 82, 99, 115, 133, 165, 188, 197]); // -3583979
// -3612829
// test('test.txt', [7,37,59,82,99,115,133,165,188,197]);
// console.log(findMinVertex(m));

// const a = new MinHeap();
// a.insert(new Edge(5,4,1))
// // console.log(a)
// // console.log('-----------------')
// a.insert(new Edge(5,6,3))
// // console.log(a)
// // console.log('-----------------')
// a.insert(new Edge(5,7,4))
// // console.log(a)
// // console.log('-----------------')
// a.insert(new Edge(5,3,9))
// // console.log(a)
// // console.log('-----------------')
// a.insert(new Edge(5,3,7))
// // console.log(a)
// // console.log('-----------------')
// a.insert(new Edge(5,3,5))
// // console.log(a)
// // console.log('-----------------')
// // console.log('---------EXTRACT--------')
// a.extract()
// //console.log(a)
// // console.log('---------EXTRACT--------')
// a._debug = true;
// a.insert(new Edge(5,3,2))
// a._debug = false;
// console.log(a)
// console.log('-----------------')
// a.insert(new Edge(5,3,10))
// console.log(a)
// console.log('-----------------')
