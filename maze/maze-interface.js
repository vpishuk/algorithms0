const DIRECTIONS = {
  right: 'r',
  bottom: 'b',
  left: 'l',
  top: 't'
}

function getReverseDirection(direction) {
  switch(direction) {
    case DIRECTIONS.top: return DIRECTIONS.bottom
    case DIRECTIONS.bottom: return DIRECTIONS.top
    case DIRECTIONS.right: return DIRECTIONS.left
    case DIRECTIONS.left: return DIRECTIONS.right
  }
}

function getDirectionName(direction) {
  switch(direction) {
    case DIRECTIONS.top: return 'top'
    case DIRECTIONS.bottom: return 'bottom'
    case DIRECTIONS.right: return 'right'
    case DIRECTIONS.left: return 'left'
  }
}

class Maze {
  constructor(maze, pointer = [0, 0]) {
    this.maze = maze
    this.pointer = pointer
  }

  hasCheese() {
    const [x, y] = this.pointer
    return this.maze[x][y] === 2
  }

  go(direction) {
    let [x, y] = this.pointer
    let canMove = false
    switch(direction) {
      case DIRECTIONS.right:
        y++
        canMove = !!this.maze[x] && this.maze[x][y] > 0
        break;
      case DIRECTIONS.left:
        y--
        canMove = !!this.maze[x] && this.maze[x][y] > 0
        break;
      case DIRECTIONS.top:
        x--
        canMove = !!this.maze[x] && this.maze[x][y] > 0
        break;
      case DIRECTIONS.bottom:
        x++
        canMove = !!this.maze[x] && this.maze[x][y] > 0
        break;
    }
    if (canMove) {
      this.pointer = [x, y]
    }
    return canMove
  }
}

module.exports = {
  DIRECTIONS,
  Maze,
  getReverseDirection,
  getDirectionName
}
