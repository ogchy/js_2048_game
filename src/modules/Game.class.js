'use strict';

class Game {
  constructor() {
    this.board = this.fillBoard();
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const nonZero = this.board[row].filter((cell) => cell !== 0);

      for (let i = 0; i < nonZero.length - 1; i++) {
        if (nonZero[i] === nonZero[i + 1]) {
          nonZero[i] *= 2;
          this.score += nonZero[i];
          nonZero.splice(i + 1, 1);
          moved = true;
        }
      }

      while (nonZero.length < 4) {
        nonZero.push(0);
      }

      if (!moved && this.board[row].toString() !== nonZero.toString()) {
        moved = true;
      }

      this.board[row] = nonZero;
    }

    if (moved) {
      this.addRandomTile(this.board);
    }
    this.updateStatus();
  }

  moveRight() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const nonZero = this.board[row].filter((cell) => cell !== 0);

      for (let i = nonZero.length - 1; i > 0; i--) {
        if (nonZero[i] === nonZero[i - 1]) {
          nonZero[i] *= 2;
          this.score += nonZero[i];
          nonZero.splice(i - 1, 1);
          moved = true;
          i--;
        }
      }

      while (nonZero.length < 4) {
        nonZero.unshift(0);
      }

      if (!moved && this.board[row].toString() !== nonZero.toString()) {
        moved = true;
      }
      this.board[row] = nonZero;
    }

    if (moved) {
      this.addRandomTile(this.board);
    }
    this.updateStatus();
  }

  moveUp() {
    let moved = false;

    for (let col = 0; col < 4; col++) {
      const nonZero = [];

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== 0) {
          nonZero.push(this.board[row][col]);
        }
      }

      for (let i = 0; i < nonZero.length - 1; i++) {
        if (nonZero[i] === nonZero[i + 1]) {
          nonZero[i] *= 2;
          this.score += nonZero[i];
          nonZero.splice(i + 1, 1);
          moved = true;
        }
      }

      while (nonZero.length < 4) {
        nonZero.push(0);
      }

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== nonZero[row]) {
          moved = true;
          this.board[row][col] = nonZero[row];
        }
      }
    }

    if (moved) {
      this.addRandomTile(this.board);
    }
    this.updateStatus();
  }

  moveDown() {
    let moved = false;

    for (let col = 0; col < 4; col++) {
      const nonZero = [];

      for (let row = 3; row >= 0; row--) {
        if (this.board[row][col] !== 0) {
          nonZero.push(this.board[row][col]);
        }
      }

      for (let i = 0; i < nonZero.length - 1; i++) {
        if (nonZero[i] === nonZero[i + 1]) {
          nonZero[i] *= 2;
          this.score += nonZero[i];
          nonZero.splice(i + 1, 1);
          moved = true;
        }
      }

      while (nonZero.length < 4) {
        nonZero.push(0);
      }

      for (let row = 0; row < 4; row++) {
        const newValue = nonZero[3 - row];

        if (this.board[row][col] !== newValue) {
          moved = true;
          this.board[row][col] = newValue;
        }
      }
    }

    if (moved) {
      this.addRandomTile(this.board);
    }
    this.updateStatus();

    return moved;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      return 'win';
    }

    let hasEmpty = false;
    let hasValidMove = false;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.board[row][col];

        if (current === 0) {
          hasEmpty = true;
        }

        if (col < 3 && current === this.board[row][col + 1]) {
          hasValidMove = true;
        }

        if (row < 3 && current === this.board[row + 1][col]) {
          hasValidMove = true;
        }
      }
    }

    if (hasEmpty) {
      return 'playing';
    }

    return hasValidMove ? 'playing' : 'lose';
  }

  updateStatus() {
    this.status = this.getStatus();

    if (this.status === 'win') {
      document.getElementById('.message-win').classList.remove('.hidden');
    } else if (this.status === 'lose') {
      document.getElementById('.message-lose').classList.remove('.hidden');
    }
  }

  start() {
    this.board = this.fillBoard();
    this.score = 0;
    this.addRandomTile(this.board);
    this.addRandomTile(this.board);
  }

  restart() {
    this.board = this.fillBoard();
    this.score = 0;
    this.addRandomTile(this.board);
    this.addRandomTile(this.board);
  }

  fillBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  getRandomTileValue() {
    return Math.random() < 0.9 ? 2 : 4;
  }

  getEmptyCell(initialState) {
    const emptyCell = [];

    for (let row = 0; row < initialState.length; row++) {
      for (let col = 0; col < initialState[row].length; col++) {
        if (initialState[row][col] === 0) {
          emptyCell.push({ row, col });
        }
      }
    }

    return emptyCell;
  }

  addRandomTile(board) {
    const emptyCell = this.getEmptyCell(board);

    if (emptyCell.length > 0) {
      const randomCell =
        emptyCell[Math.floor(Math.random() * emptyCell.length)];

      board[randomCell.row][randomCell.col] = this.getRandomTileValue();
    }
  }
}

module.exports = Game;
