import { Container } from "pixi.js";
import { Component } from "../GameObject";

export class PixiRootComponent extends Component {
  #container: Container;
  constructor() {
    super();
    this.#container = new Container();
  }
  get container() {
    return this.#container;
  }
}
