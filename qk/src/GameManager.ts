import type { Container, Ticker } from "pixi.js";
import { GameObject } from "./GameObject.ts";
import { PixiRootComponent } from "./components/PixiRoot.ts";
import { Player } from "./gameobjects/Player.ts";
import { logError } from "./Error.ts";
import { Vec } from "./Vector.ts";

// global singleton instance
export let gameManager:GameManager;

export function initGameManager(stage:Container) {
  if (gameManager) {
    logError("GameManager instance already exists");
  }
  gameManager = new GameManager(stage);
  return gameManager;
}

// GameManager singleton
class GameManager {
  #entities: GameObject[] = [];
  #stage: Container;
  #ticker!: Ticker;

  constructor(stage:Container) {
    this.#stage = stage;
    gameManager = this;
  }

  // initialize the game state by adding entities to the game world
  startGame() {
    this.addEntity(Player(new Vec(100, 100)));
  }

  // add an entity to the game world
  addEntity(entity: GameObject) {
    this.#entities.push(entity);
    // connect pixi root to the stage
    let pixiComponent = entity.getComponent(PixiRootComponent);
    if (pixiComponent !== null) {
      this.#stage.addChild(pixiComponent.container);
    }
  }

  update(ticker:Ticker) {
    this.#ticker = ticker;
    this.#entities.forEach(entity => entity.update());
    // remove destroyed entities from the list
    this.#entities = this.#entities.filter(entity => !entity.destroyed);
  }

  get ticker() {
    return this.#ticker;
  }
}