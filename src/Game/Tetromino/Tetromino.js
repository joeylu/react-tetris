import { Container, Point } from "pixi.js";

import { AVAILABLE_TYPES, TYPES } from "./constants";
import { BLOCK_SIZE } from "../constants";
import Block from "../Block";

export default class Tetromino {
  blocks = [];

  constructor(type) {
    this.type = type;

    this.rotation = 0;

    // set initial positon
    this.position = new Point(0, 0);

    this.container = new Container();

    for (let i = 0; i < 4; i++) {
      const block = new Block(this.type.color);
      this.blocks.push(block);
      this.container.addChild(block);
    }
    this.draw();
  }

  static createRandom(...args) {
    const type = TYPES[AVAILABLE_TYPES[Math.floor(Math.random() * 7)]];
    // const type = TYPES["L"];
    return new Tetromino(type, ...args);
  }

  setPosition(x, y) {
    this.position.set(x, y);
    this.container.position.set(x * BLOCK_SIZE, y * BLOCK_SIZE);
  }

  rotate(delta) {
    this.rotation = Math.abs(this.rotation + delta) % 4;
    this.draw();
  }

  hasBlock(x, y) {
    return this.type.shapes[this.rotation][y][x] === 1;
  }

  move(dx, dy) {
    this.setPosition(this.position.x + dx, this.position.y + dy);
  }

  remove() {
    this.container.parent.removeChild(this.container);
  }

  draw() {
    let i = 0;
    for (let x = 0; x < this.type.size; x++) {
      for (let y = 0; y < this.type.size; y++) {
        if (this.type.shapes[this.rotation][y][x] === 1) {
          this.blocks[i].x = x * BLOCK_SIZE;
          this.blocks[i].y = y * BLOCK_SIZE;
          i++;
          if (i >= 4) break;
        }
      }
    }
  }
}
