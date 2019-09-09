const { readFile } = require('./utils');

let TOTAL_AMOUNT = 0;

class Job {
  constructor(weight, length) {
    this.weight = weight;
    this.length = length;
  }

  valueOf() {
    return this.weight / this.length;
  }
}

function findMinCompletionTime(listOfJobs) {
  const sortedList = listOfJobs.sort((l, r) => {
    const lWml = l.weight / l.length;
    const rWml = r.weight / r.length;
    if (lWml > rWml) {
      return -1;
    } if (lWml < rWml) {
      return 1;
    }
    return r.weight > l.weight ? 1 : r.weight < l.weight ? -1 : 0;
  });
  // console.log(sortedList)
  let prevCompletionTime = 0;
  let total = 0;
  sortedList.forEach((i) => {
    const completionTime = (prevCompletionTime + i.length);
    total += completionTime * i.weight;
    prevCompletionTime = completionTime;
  });
  return total;
}

function test(file, expected) {
  let isFirstLine = true;
  const jobs = [];
  readFile(file, (line) => {
    if (isFirstLine) {
      TOTAL_AMOUNT = parseInt(line, 10);
      isFirstLine = false;
      return;
    }
    const arr = line.split(' ').map((i) => parseInt(i, 10));
    jobs.push(new Job(arr[0], arr[1]));
  })
    .then((graph) => {
      console.log('struct done');
      const answer = findMinCompletionTime(jobs);
      // console.log(answer);
      console.log(answer);
      // const res = listOfVertexes.map(v => answer[v]).join(',');
      // console.log('Result:', res);
      // console.log('status:', (expected.join(',') === res ? 'SUCCESS' : 'FAILED'));
    });
}

test('jobs.txt', [7, 37, 59, 82, 99, 115, 133, 165, 188, 197]);
// 1. 69119377652
// 2. 67311454237

// test('test.txt', [7,37,59,82,99,115,133,165,188,197]);
// console.log(findMinVertex(m));
