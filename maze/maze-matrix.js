const { readFileAsMatrix } = require('../utils/fs')
const { DIRECTIONS, Maze, getReverseDirection, getDirectionName } = require('./maze-interface')

const DIRECTION_ARRAY = [DIRECTIONS.right, DIRECTIONS.bottom, DIRECTIONS.left, DIRECTIONS.top]

function mazeSolver(maze) {
  const path = []
  const pointer = {x: 0, y: 0}
  const steps = []
  // console.log('---------------')
  // console.log('path', path.join(' '))
  path[0] = [1]
  while (!maze.hasCheese()) {
    for (let i = 0; i < DIRECTION_ARRAY.length; i++) {
      const a = DIRECTION_ARRAY[i]
      let {x, y} = pointer
      switch (a) {
        case DIRECTIONS.bottom:
          y++
          break
        case DIRECTIONS.top:
          y--
          break
        case DIRECTIONS.left:
          x--
          break
        case DIRECTIONS.right:
          x++
          break
      }
      // skip already visited node
      if (y < 0) {
        y = 0
        path.unshift([])
      }

      if (y > path.length - 1) {
        path.push([])
      }

      if (x < 0) {
        x = 0
        path[y].unshift(null)
      }

      if (x > path[y].length - 1) {
        path[y].push(null)
      }
      if (path[y][x] == 0 || path[y][x] == 1) continue

      // console.log('checking direction', a)
      if (maze.go(a)) {
        pointer.x = x
        pointer.y = y
        path[y][x] = 1
        steps.push(a)
        // console.log('trying to solve for direction', a)
      } else {
        path[y][x] = 0
        // console.log('can not go in direction', a)
      }
    }
  }
  return [path, steps]
}

function test() {
  const matrix = []
  const n = 3
  const m = 3
  for (let i = 0; i < n; i++) {
    matrix[i] = (new Array(m)).fill(1)
  }
  matrix[n - 1][m - 1] = 2
  console.log('maze formed')
  const maze = new Maze(matrix);
  const [path,steps] = mazeSolver(maze)
  console.log(path, steps)
}

module.exports = {
  test,
  mazeSolver
}

test()
