let idNumber = 0;

export abstract class Component {
  #gameObject!: GameObject;
  get gameObject() {
    return this.#gameObject;
  }
  setGameObject(gameObject: GameObject) {
    this.#gameObject = gameObject;
  }
  /**
   * Init is called after all components are instantiated. Usually, this is used for linking references of components.
   */
  init(): void {}
  /** 
   * Update is called every frame.
   */
  update(): void {}
}

export class GameObject {
  // unique id integer
  #id: number;
  // hashmap of component class name to component instance
  #components: Record<string, Component> = {};
  #name: string;
  // list of functions to call when this object is destroyed
  #destroyEvents: (() => void)[] = [];
  // if true, this object is destroyed after this frame
  #destroyed: boolean = false;
  constructor (name:string, components: Component[]) {
    this.#id = idNumber;
    idNumber++;
    this.#name = name;
    for (const component of components) {
      component.setGameObject(this);
      this.#components[component.constructor.name] = component;
    }
    // make sure all components are instantiated before initializing
    Object.values(this.#components).forEach(component => component.init());
  }

  update() {
    Object.values(this.#components).forEach(component => component.update());
  }
  /**
   * returns the first component of the specified type, or null if not found
   * Since types are erased at compile time, pass in a class constructor to check instanceof against
   */
  getComponent<T extends Component>(componentClass: new (...args: any[]) => T): T | null {
    return this.#components[componentClass.name] as T || null;
  }

  // Mark this object for delete by the end of this frame.
  destroy() {
    this.#destroyEvents.forEach(event => event());
    this.#components = {}; // redundant
    this.#destroyed = true;
  }

  // attach an event listerner for when this object is destroyed.
  onDestroy(callback: () => void) {
    this.#destroyEvents.push(callback);
  }

  // read only
  get id() {
    return this.#id;
  }
  get name() {
    return this.#name;
  }
  // whether this object is destroyed
  get destroyed() {
    return this.#destroyed;
  }
}