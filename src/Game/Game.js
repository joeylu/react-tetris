import * as PIXI from "pixi.js";

import Board from "./Board";
import Tetromino from "./Tetromino";
import { BOARD_WIDTH, BOARD_HEIGHT, BLOCK_SIZE } from "./constants";
import Block from "./Block";

export default class Game {
  app;
  currentTetromino;
  nextTetromino;
  timer = 0;
  delay = 400;

  constructor(container) {
    this.container = container;
    this.app = new PIXI.Application(
      BOARD_WIDTH * BLOCK_SIZE,
      BOARD_HEIGHT * BLOCK_SIZE,
      { antialias: true }
    );

    this.container.appendChild(this.app.view);

    this.board = new Board(BOARD_WIDTH, BOARD_HEIGHT, BLOCK_SIZE);

    this.app.stage.addChild(this.board);
    this.newTetromino();

    this.interval = setInterval(() => {
      this.drop();
    }, this.delay);

    this.initKeyListeners();
  }

  initKeyListeners() {
    const leftKey = this.keyboard(37);
    const upKey = this.keyboard(38);
    const rightKey = this.keyboard(39);
    const downKey = this.keyboard(40);
    const spaceKey = this.keyboard(32);
    this.keys = {
      leftKey,
      upKey,
      rightKey,
      downKey,
      spaceKey
    };
    leftKey.press = () => {
      this.moveTetromino(-1);
    };
    rightKey.press = () => {
      this.moveTetromino(1);
    };
    upKey.press = () => {
      this.rotateTetromino(1);
    };
    downKey.press = () => {
      this.rotateTetromino(-1);
    };
    spaceKey.press = () => this.hardDrop();
  }

  moveTetromino(x) {
    this.currentTetromino.move(x, 0);
    if (this.board.isColliding(this.currentTetromino)) {
      // move to position from before collition
      this.currentTetromino.move(-x, 0);
    }
  }

  rotateTetromino(delta) {
    this.currentTetromino.rotate(delta);
    if (this.board.isColliding(this.currentTetromino)) {
      // move to position from before collition
      this.currentTetromino.rotate(-delta);
    }
  }

  newTetromino() {
    this.currentTetromino = Tetromino.createRandom();
    this.currentTetromino.setPosition(
      Math.floor((BOARD_WIDTH - this.currentTetromino.type.size) / 2),
      0
    );
    if (this.board.isColliding(this.currentTetromino)) {
      const style = new PIXI.TextStyle({
        fontFamily: "Arial",
        fontSize: 36,
        fontStyle: "italic",
        fontWeight: "bold",
        fill: "#ffffff",
        stroke: "#4a1850",
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: "#000000",
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: BOARD_WIDTH / 2
      });
      const gameOverText = new PIXI.Text("GAME OVER", style);
      gameOverText.position.set(2 * BLOCK_SIZE, 3 * BLOCK_SIZE);
      this.app.stage.addChild(gameOverText);
      clearInterval(this.interval);
      // clear keyboard listeners
      this.removeKeyboardListener(this.keys.leftKey);
      this.removeKeyboardListener(this.keys.rightKey);
      this.removeKeyboardListener(this.keys.spaceKey);
      this.removeKeyboardListener(this.keys.upKey);
      this.removeKeyboardListener(this.keys.downKey);
      return;
    }
    this.board.addChild(this.currentTetromino.container);
  }

  drop() {
    this.currentTetromino.move(0, 1);
    // check if collide with board
    if (this.board.isColliding(this.currentTetromino)) {
      // move to position from before collition
      this.currentTetromino.move(0, -1);
      // merge tetromino with board
      this.board.fusion(this.currentTetromino);
      // remove tetromino
      this.currentTetromino.remove();
      // initiate new tetromino
      this.newTetromino();
      return false;
    }
    return true;
  }

  hardDrop() {
    console.log("hard drop!!!");
    // do drop untill collition
    while (this.drop());
  }

  // https://github.com/kittykatattack/learningPixi/blob/master/examples/12_keyboardMovement.html
  keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
      if (event.keyCode === key.code) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
      }
      event.preventDefault();
    };
    //The `upHandler`
    key.upHandler = event => {
      if (event.keyCode === key.code) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
      }
      event.preventDefault();
    };
    //Attach event listeners
    window.addEventListener("keydown", key.downHandler, false);
    window.addEventListener("keyup", key.upHandler, false);
    return key;
  }

  removeKeyboardListener(key) {
    window.removeEventListener("keydown", key.downHandler);
    window.removeEventListener("keydown", key.upHandler);
  }
}
