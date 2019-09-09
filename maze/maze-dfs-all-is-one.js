const { readFileAsMatrix } = require('../utils/fs');
const {
  DIRECTIONS, Maze, getReverseDirection, getDirectionName,
} = require('./maze-interface');

const DIRECTION_ARRAY = [DIRECTIONS.top, DIRECTIONS.bottom, DIRECTIONS.left, DIRECTIONS.right];

function getRandomDirection() {
  const rand = Math.floor(Math.random() * 100);
  if (rand <= 25) {
    return DIRECTION_ARRAY[0];
  }
  if (rand <= 50) {
    return DIRECTION_ARRAY[1];
  }
  if (rand <= 75) {
    return DIRECTION_ARRAY[2];
  }
  return DIRECTION_ARRAY[3];
}

function hasCycle(path) {
  const subpath = path.slice(0);
  while (subpath.length > 0) {
    const map = new Map();
    map.set(DIRECTIONS.bottom, 0);
    map.set(DIRECTIONS.top, 0);
    map.set(DIRECTIONS.left, 0);
    map.set(DIRECTIONS.right, 0);
    path.forEach((e) => map.set(e, (map.get(e) || 0) + 1));
    if (
      map.get(DIRECTIONS.right) > 0
      && map.get(DIRECTIONS.left) > 0
      && map.get(DIRECTIONS.top) > 0
      && map.get(DIRECTIONS.bottom) > 0
      && map.get(DIRECTIONS.right) === map.get(DIRECTIONS.left)
      && map.get(DIRECTIONS.bottom) === map.get(DIRECTIONS.top)
    ) {
      return true;
    }
    subpath.shift();
  }
  return false;
}

function mazeSolver(maze, maxLength) {
  const path = [];
  // console.log('---------------')
  // console.log('path', path.join(' '))
  while (!maze.hasCheese()) {
    if (path.length >= maxLength) {
      return false;
    }
    if (hasCycle(path)) {
      const backDirection = getReverseDirection(path.pop());
      maze.go(backDirection);
      continue;
    }
    const a = getRandomDirection();
    // console.log('checking direction', a)
    if (maze.go(a)) {
      path.push(a);
      // console.log('trying to solve for direction', a)
    } else {
      // console.log('can not go in direction', a)
    }
  }
  return path;
}

function test() {
  const matrix = [];
  const n = 3;
  const m = 3;
  for (let i = 0; i < n; i++) {
    matrix[i] = (new Array(m)).fill(1);
  }
  matrix[n - 1][m - 1] = 2;
  console.log('maze formed');
  const limit = Math.pow(n * m, 0);
  const pathLength = n * m;
  let min = Infinity;
  for (let i = 0; i < limit; i++) {
    const maze = new Maze(matrix);
    const path = mazeSolver(maze, Infinity);
    if (path && min > path.length) {
      min = path.length;
    }
  }

  console.log(min);
}

module.exports = {
  test,
  mazeSolver,
};

test();
