const { readFileAsMatrix } = require('../utils/fs')
const { DIRECTIONS, Maze, getReverseDirection, getDirectionName } = require('./maze-interface')

const DIRECTION_ARRAY = [DIRECTIONS.top, DIRECTIONS.bottom, DIRECTIONS.right, DIRECTIONS.left]

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

test('data/test.txt').then((answer) => console.log(answer))
