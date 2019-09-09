const fs = require('fs');
const readline = require('readline');
const path = require('path');

const LOGGER = {
  logs: [],
  log: (...rest) => {
    // LOGGER.logs.push(rest);
    // console.log(...rest);
  },
  clear: () => {
    LOGGER.logs = [];
  },
  flush: () => {
    for (let i = 0; i < LOGGER.logs.length; i++) {
      console.log(...LOGGER.logs[i]);
    }
    LOGGER.clear();
  },
};

function deepClone(graph) {
  const newGraph = [];
  for (let i = 0; i < graph.length; i++) {
    newGraph.push(graph[i].slice());
  }
  return newGraph;
}

function findVertext(val, graph) {
  for (let i = 0; i < graph.length; i++) {
    if (graph[i][0] === val) {
      return i;
    }
  }
  return -1;
}

function findMin(graph) {
  return Math.min(...graph.map((sg) => sg.length)) - 1;
}

function algo(graph) {
  return new Promise((_resolve, _reject) => {
    const newGraph = [];
    const randVertexURowIdx = Math.round(Math.random() * 1000) % graph.length;
    const randEdgeIdx = Math.round(Math.random() * 1000) % (graph[randVertexURowIdx].length - 1) + 1;
    const randVertexU = graph[randVertexURowIdx][0];
    const randVertexV = graph[randVertexURowIdx][randEdgeIdx];
    const randVerexVRowIdx = findVertext(randVertexV, graph);
    if (randVerexVRowIdx < 0) {
      console.error(new Error('vertexes not found'));
      console.log(graph);
      console.log(randVertexURowIdx, randEdgeIdx, randVertexU, randVertexV);
      process.exit(1);
    }
    LOGGER.log('input', graph);
    LOGGER.log('-----');
    LOGGER.log('vertexU:', randVertexU, 'vertexV:', randVertexV);
    LOGGER.log('merge vRow to URow');
    for (let i = 1; i < graph[randVerexVRowIdx].length; i++) {
      if (graph[randVerexVRowIdx][i] !== randVertexU) {
        graph[randVertexURowIdx].push(graph[randVerexVRowIdx][i]);
      }
    }
    LOGGER.log(graph);
    LOGGER.log('new graph');
    let j = 0;
    for (let i = 0; i < graph.length; i++) {
      if (graph[i][0] !== randVertexV) {
        newGraph[j] = [graph[i][0]];
        let h = 1;
        for (let k = 1; k < graph[i].length; k++) {
          if (graph[i][k] !== randVertexV) {
            newGraph[j][h] = graph[i][k];
          } else {
            if (graph[i][0] === randVertexU) {
              continue;
            }
            newGraph[j][h] = randVertexU;
          }
          h++;
        }
        j++;
      }
    }
    randVerexURow = null;
    randVerexVRow = null;
    LOGGER.log(newGraph);
    LOGGER.log('\n\n');
    if (newGraph.length > 2) {
      setTimeout(() => {
        algo(newGraph).then(_resolve).catch((e) => console.error(e));
      }, 2);
    } else {
      _resolve(findMin(newGraph));
    }
  });
}

function readFile(file) {
  return new Promise((_resolve) => {
    const arr = [];
    const lineReader = readline.createInterface({
      input: fs.createReadStream(file),
    });

    lineReader.on('line', (line) => {
      const row = line.replace(/\s+/gi, ' ')
        .split(' ')
        .map((i) => parseInt(i, 10))
        .filter((i) => !isNaN(i));
      arr.push(row);
    });

    lineReader.on('close', () => {
      _resolve(arr);
    });
  });
}

readFile(path.resolve(__dirname, 'krager.txt')).then(async (graph) => {
  try {
    let min = -1;
    for (let i = 0; i < 10000; i++) {
      const res = await algo(graph);
      min = res < min || min < 0 ? res : min;
      console.log(`Iteration (${i}):`, res);
      LOGGER.flush();
    }
    console.log(min);
    process.exit();
  } catch (e) {
    console.error(e);
  }
});
