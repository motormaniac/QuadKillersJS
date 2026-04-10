import { Graphics, GraphicsContext } from "pixi.js";
import { GameObject, Component} from "../GameObject.ts";
import { PixiRootComponent } from "./PixiRoot.ts";

export class GraphicsComponent extends Component {
  #graphics: Graphics;
  constructor(context: GraphicsContext) {
    super();
    this.#graphics = new Graphics(context);
  }
  init(gameObject: GameObject): void {
    gameObject.getComponent(PixiRootComponent).container.addChild(this.#graphics);
  }
}