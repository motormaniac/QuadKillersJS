import { Graphics, GraphicsContext } from "pixi.js";
import { GameObject, type ComponentType } from "./GameObject";
import { PixiRootComponent } from "./PixiRoot";


export function SampleObject():GameObject {
  return new GameObject("default", [
    new PixiRootComponent(),
    new SampleVisualComponent(),
    new SampleMovementComponent(2)
  ])
}

const graphicsContext : GraphicsContext = new GraphicsContext()
  .rect(0, 0, 100, 100)
  .fill('#0000ff');

class SampleVisualComponent implements ComponentType {
  init(gameObject: GameObject): void {
    let pixiComponent = gameObject.getComponent(PixiRootComponent);
    let graphics = new Graphics(graphicsContext);
    pixiComponent.container.addChild(graphics);
  }
  update(_gameObject: GameObject): void {}
}

class SampleMovementComponent implements ComponentType {
  // use the ! to tell typescript this will always be initialized
  #pixiComponent!: PixiRootComponent;
  speed: number;
  constructor(speed: number) {
    this.speed = speed;
  }
  init(gameObject: GameObject): void {
    // usually init is used to link dependencies
    // getComponent throws an error if the component is not found
    this.#pixiComponent = gameObject.getComponent(PixiRootComponent);
  }
  update(_gameObject: GameObject): void {
    this.#pixiComponent.container.x += this.speed;
  }
}