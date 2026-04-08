import { Container } from "pixi.js";
import { GameObject, type ComponentType} from "./GameObject.ts";

export class PixiRootComponent implements ComponentType {
  #container: Container;
  constructor() {
    this.#container = new Container();
  }
  init(_gameObject: GameObject): void {}
  update(_gameObject: GameObject): void {}
  get container() {
    return this.#container;
  }
}