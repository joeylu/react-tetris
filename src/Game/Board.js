import { Container } from "pixi.js";

export default class Board extends Container {
  board;
  blocks = [];

  constructor(width, height, cellSize) {
    super();
    this.boardWidth = width;
    this.boardHeight = height;
    this.cellSize = cellSize;

    this.init();
  }

  init() {
    const row = new Array(this.boardWidth).fill(0);
    this.board = new Array(this.boardHeight).fill(0).map(() => row.slice(0));
  }

  fusion(tetromino) {
    for (let x = 0; x < tetromino.type.size; x++) {
      for (let y = 0; y < tetromino.type.size; y++) {
        if (tetromino.hasBlock(x, y)) {
          const block = tetromino.blocks.pop();
          const blockX = tetromino.position.x + x;
          const blockY = tetromino.position.y + y;
          this.addChild(block);
          block.setPosition(blockX, blockY);
          this.board[blockY][blockX] = block;
          if (!tetromino.blocks) break;
        }
      }
    }

    const ereasedRows = [];
    // now erease full rows
    this.board.forEach((row, rowIndex) => {
      if (row.every(block => block !== 0)) {
        // this row is full - erease
        row.forEach((block, index) => {
          this.removeChild(block);
        });
        ereasedRows.push(rowIndex);
      }
    });
    // remove ereased rows
    ereasedRows.forEach(index => {
      this.board = [
        new Array(this.boardWidth).fill(0),
        ...this.board.slice(0, index),
        ...this.board.slice(index + 1)
      ];
      // move all blocks in all previous rows one level down
      for (let i = 0; i <= index; i++) {
        this.board[i].forEach((el, x) => {
          if (el !== 0) {
            el.setPosition(x, i);
          }
        });
      }
    });
  }

  isColliding(tetromino) {
    for (let x = 0; x < tetromino.type.size; x++) {
      for (let y = 0; y < tetromino.type.size; y++) {
        if (
          tetromino.position.x + x < 0 ||
          tetromino.position.x + x >= this.boardWidth ||
          tetromino.position.y + y >= this.boardHeight ||
          (tetromino.position.y >= 0 &&
            this.board[tetromino.position.y + y][tetromino.position.x + x] !==
              0)
        ) {
          if (tetromino.hasBlock(x, y)) {
            // debugger;
            // console.log("has colition at", x, y);
            return true;
          }
        }
      }
    }
    return false;
  }
}
