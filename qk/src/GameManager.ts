import type { Container } from "pixi.js";
import { GameObject } from "./GameObject.ts";
import { PixiRootComponent } from "./PixiRoot.ts";
import { SampleObject } from "./SampleObject.ts";

// GameManager singleton
export class GameManager {
  #entities: GameObject[] = [];
  #stage: Container;
  deltaTime: number = 0;
  constructor(stage:Container) {
    this.#stage = stage;
  }

  startGame() {
    this.addEntity(SampleObject());
  }

  addEntity(entity: GameObject) {
    this.#entities.push(entity);
    
    let pixiComponent = entity.getComponentIfExists(PixiRootComponent);
    if (pixiComponent !== null) {
      this.#stage.addChild(pixiComponent.container);
    }
  }

  update(deltaTime: number) {
    this.deltaTime = deltaTime;
    for (let entity of this.#entities) {
      entity.update();
    }
  }
}