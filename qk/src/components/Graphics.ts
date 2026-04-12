import { Graphics, GraphicsContext } from "pixi.js";
import { Component } from "../GameObject.ts";
import { PixiRootComponent } from "./PixiRoot.ts";
import { logError } from "../Error.ts";

export class GraphicsComponent extends Component {
  #graphics: Graphics;
  /**
   * 
   * @param context Make sure the graphics is created relative to the LOCAL coordinates of this gameobject's position.
   */
  constructor(context: GraphicsContext) {
    super();
    this.#graphics = new Graphics(context);
  }
  init(): void {
    const root = this.gameObject.getComponent(PixiRootComponent);
    if (!root) {
      logError("GraphicsComponent requires a PixiRootComponent to function properly");
      return;
    }
    root.container.addChild(this.#graphics);
  }
}