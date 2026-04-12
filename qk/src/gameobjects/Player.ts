import { GraphicsContext } from "pixi.js";
import { Component, GameObject } from "../GameObject";
import { PixiRootComponent } from "../components/PixiRoot";
import { GraphicsComponent } from "../components/Graphics";
import { PhysicsComponent } from "../components/Physics";
import { ContextEnum, inputManager, type InputAction } from "../InputManager";
import { Vec } from "../Vector";
import { gameManager } from "../GameManager";
import { Bullet } from "./Bullet";
import { logError } from "../Error";

const graphicsContext : GraphicsContext = new GraphicsContext()
  .translate(-50, -50)
  .rect(0, 0, 100, 100)
  .fill('#0000ff');

export function Player(initPos: Vec = Vec.ZERO):GameObject {
  const SPEED = 10;

  return new GameObject("player", [
    new PixiRootComponent(),
    new GraphicsComponent(graphicsContext),
    new PhysicsComponent(initPos),
    new PlayerMovementComponent(SPEED),
  ])
}

class PlayerMovementComponent extends Component {
  // use the ! to tell typescript this will always be initialized
  #physicsComponent: PhysicsComponent | null = null;
  #upAction:InputAction | null = null;
  #downAction:InputAction | null = null;
  #leftAction:InputAction | null = null;
  #rightAction:InputAction | null = null;

  #bulletCount = 0;

  speed: number;
  constructor(speed: number) {
    super();
    this.speed = speed;
  }
  init(): void {
    // usually init is used to link dependencies
    // getComponent throws an error if the component is not found
    this.#physicsComponent = this.gameObject.getComponent(PhysicsComponent);
    if (!this.#physicsComponent) {
      logError("PlayerMovementComponent requires a PhysicsComponent to function properly");
    }

    this.#upAction = inputManager.getAction(ContextEnum.GAME, "up");
    if (!this.#upAction) { logError("Failed to initialize PlayerMovementComponent: 'up' action not found"); }
    this.#downAction = inputManager.getAction(ContextEnum.GAME, "down");
    if (!this.#downAction) { logError("Failed to initialize PlayerMovementComponent: 'down' action not found"); }
    this.#leftAction = inputManager.getAction(ContextEnum.GAME, "left");
    if (!this.#leftAction) { logError("Failed to initialize PlayerMovementComponent: 'left' action not found"); }
    this.#rightAction = inputManager.getAction(ContextEnum.GAME, "right");
    if (!this.#rightAction) { logError("Failed to initialize PlayerMovementComponent: 'right' action not found"); }
  }
  update(): void {
    let direction = new Vec();
    if (this.#upAction?.isPressed) {
      direction = direction.add(new Vec(0, -1));
    }
    if (this.#downAction?.isPressed) {
      direction = direction.add(new Vec(0, 1));
    }
    if (this.#leftAction?.isPressed) {
      direction = direction.add(new Vec(-1, 0));
    }
    if (this.#rightAction?.isPressed) {
      direction = direction.add(new Vec(1, 0));
    }
    if (this.#physicsComponent) {
      this.#physicsComponent.velocity = direction.mul(this.speed);
    }
    gameManager.addEntity(Bullet(this.#physicsComponent?.position || new Vec(), 20, Vec.randomDirection()));
    this.#bulletCount++;
  }
}