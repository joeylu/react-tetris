import { Container, Graphics } from "pixi.js";

import { BLOCK_SIZE } from "./constants";

export default class Block extends Container {
  constructor(color, size = BLOCK_SIZE) {
    super();
    this.color = color;
    this.size = size;

    this.draw();
  }

  draw() {
    const graphics = new Graphics();
    graphics.lineStyle(1, 0, 1, 0);
    graphics.beginFill(this.color, 1);
    graphics.drawRect(0, 0, this.size, this.size);
    this.addChild(graphics);
  }

  setPosition(x, y) {
    this.position.set(x * BLOCK_SIZE, y * BLOCK_SIZE);
  }
}
