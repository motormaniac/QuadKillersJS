import type { Container, Ticker } from "pixi.js";
import { GameObject } from "./GameObject.ts";
import { PixiRootComponent } from "./components/PixiRoot.ts";
import { Player } from "./gameobjects/Player.ts";

// global singleton instance
export let gameManager:GameManager;

export function initGameManager(stage:Container) {
  if (gameManager) {
    throw new Error("GameManager instance already exists");
  }
  gameManager = new GameManager(stage);
  return gameManager;
}

// GameManager singleton
class GameManager {
  #entities: GameObject[] = [];
  #stage: Container;
  #deltaTime: number = 0;
  #lastTime: number = 0;
  constructor(stage:Container) {
    if (gameManager) {
      throw new Error("GameManager instance already exists");
    }
    this.#stage = stage;
    gameManager = this;
  }

  startGame() {
    this.addEntity(Player());
  }

  addEntity(entity: GameObject) {
    this.#entities.push(entity);
    // connect pixi root to the stage
    let pixiComponent = entity.getComponentIfExists(PixiRootComponent);
    if (pixiComponent !== null) {
      this.#stage.addChild(pixiComponent.container);
    }
  }

  update(ticker:Ticker) {
    this.#deltaTime = ticker.deltaTime;
    this.#lastTime = ticker.lastTime;
    this.#entities.forEach(entity => entity.update());
    // remove destroyed entities from the list
    this.#entities = this.#entities.filter(entity => !entity.destroyed);
  }

  get deltaTime() {
    return this.#deltaTime;
  }
  get lastTime() {
    return this.#lastTime;
  }
}