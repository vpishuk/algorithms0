const { readFileAsMatrix } = require('../utils/fs')
const { DIRECTIONS, Maze, getReverseDirection, getDirectionName } = require('./maze-interface')

const DIRECTION_ARRAY = [DIRECTIONS.top, DIRECTIONS.bottom, DIRECTIONS.left, DIRECTIONS.right]

function isCycle(path, direction) {
  const subpath = path.slice(0)
  while (subpath.length > 0) {
    const map = new Map()
    map.set(DIRECTIONS.bottom, 0)
    map.set(DIRECTIONS.top, 0)
    map.set(DIRECTIONS.left, 0)
    map.set(DIRECTIONS.right, 0)
    map.set(direction, 1)
    path.forEach(e => map.set(e, (map.get(e) || 0) + 1))
    if (
      map.get(DIRECTIONS.right) > 0
      && map.get(DIRECTIONS.left) > 0
      && map.get(DIRECTIONS.top) > 0
      && map.get(DIRECTIONS.bottom) > 0
      && map.get(DIRECTIONS.right) === map.get(DIRECTIONS.left)
      && map.get(DIRECTIONS.bottom) === map.get(DIRECTIONS.top)
    ) {
      return true
    }
    subpath.shift()
  }
  return false
}

function mazeDFSSolver(maze, path = []) {
  if (maze.hasCheese()) {
    return true
  }
  console.log('---------------')
  console.log('path', path.join(' '))
  const reverseA = getReverseDirection(path[path.length - 1])
  for (let i = 0; i < DIRECTION_ARRAY.length; i++) {
    const a = DIRECTION_ARRAY[i]
    if (a === reverseA) {
      continue
    }
    console.log('checking direction', a)
    if (isCycle(path, a)) {
      console.log('cyclic path... can not use direction', path)
      return false
    }

    if (maze.go(a)) {
      path.push(a)
      console.log('trying to solve for direction', a)
      if (mazeDFSSolver(maze, path)) {
        return true
      } else {
        console.log('can not find solution for direction', a)
        path.pop()
        const backDirection = getReverseDirection(a)
        console.log('go back in direction', backDirection)
        maze.go(backDirection)
      }
    } else {
      console.log('can not go in direction', a)
    }
  }
  return false
}

function getMaze(file) {
  return readFileAsMatrix(file).then((matrix) => {
    console.log(matrix)
    return new Maze(matrix);
  })
}

function test(file) {
  return getMaze(file)
    .then((maze) => {
      const path = []
      mazeDFSSolver(maze, path);
      return path.join(' ')
    });
}

module.exports = {
  test,
  mazeDFSSolver
}

test('data/cyclic.txt').then((answer) => console.log(answer))
