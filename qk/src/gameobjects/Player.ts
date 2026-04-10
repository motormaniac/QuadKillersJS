import { GraphicsContext } from "pixi.js";
import { Component, GameObject } from "../GameObject";
import { PixiRootComponent } from "../components/PixiRoot";
import { GraphicsComponent } from "../components/Graphics";
import { PhysicsComponent } from "../components/Physics";
import { ContextEnum, inputManager, type InputAction } from "../InputManager";
import { Vec } from "../Vector";
import { gameManager } from "../GameManager";
import { Bullet } from "./Bullet";

const graphicsContext : GraphicsContext = new GraphicsContext()
  .rect(0, 0, 100, 100)
  .fill('#0000ff');

export function Player():GameObject {
  const SPEED = 10;

  return new GameObject("player", [
    new PixiRootComponent(),
    new GraphicsComponent(graphicsContext),
    new PhysicsComponent(),
    new PlayerMovementComponent(SPEED),
  ])
}

class PlayerMovementComponent extends Component {
  // use the ! to tell typescript this will always be initialized
  #physicsComponent!: PhysicsComponent;
  #upAction!:InputAction;
  #downAction!:InputAction;
  #leftAction!:InputAction;
  #rightAction!:InputAction;
  speed: number;
  constructor(speed: number) {
    super();
    this.speed = speed;
  }
  init(gameObject: GameObject): void {
    // usually init is used to link dependencies
    // getComponent throws an error if the component is not found
    this.#physicsComponent = gameObject.getComponent(PhysicsComponent);

    this.#upAction = inputManager.getAction(ContextEnum.GAME, "up");
    this.#downAction = inputManager.getAction(ContextEnum.GAME, "down");
    this.#leftAction = inputManager.getAction(ContextEnum.GAME, "left");
    this.#rightAction = inputManager.getAction(ContextEnum.GAME, "right");
  }
  update(_gameObject: GameObject): void {
    let direction = new Vec();
    if (this.#upAction.isPressed) {
      direction = direction.add(new Vec(0, -1));
    }
    if (this.#downAction.isPressed) {
      direction = direction.add(new Vec(0, 1));
    }
    if (this.#leftAction.isPressed) {
      direction = direction.add(new Vec(-1, 0));
    }
    if (this.#rightAction.isPressed) {
      direction = direction.add(new Vec(1, 0));
    }
    this.#physicsComponent.velocity = direction.mul(this.speed);

    gameManager.addEntity(Bullet(this.#physicsComponent.position, 20, Vec.randomDirection()));
  }
}