let idNumber = 0;

export abstract class Component {
  init(_gameObject: GameObject): void {}
  update(_gameObject: GameObject): void {}
}

export class GameObject {
  #id: number;
  // hashmap of component class name to component instance
  #components: Record<string, Component> = {};
  #name: string;
  #destroyEvents: Function[] = [];
  #destroyed: boolean = false;
  constructor (name:string, components: Component[]) {
    this.#id = idNumber;
    idNumber++;
    this.#name = name;
    components.forEach(component => this.#components[component.constructor.name] = component);
    // make sure all components are instantiated before initializing
    Object.values(this.#components).forEach(component => component.init(this));
  }

  update() {
    Object.values(this.#components).forEach(component => component.update(this));
  }
  /**
   * returns the first component of the specified type, or null if not found
   * Since types are erased at compile time, pass in a class constructor to check instanceof against
   */
  getComponentIfExists<T extends Component>(componentClass: new (...args: any[]) => T): T {
    return this.#components[componentClass.name] as T || null;
  }

  /**
   * returns the first component of the specified type, or throws an error if not found
   * @param componentClass Class of the target component
   * @returns Component
   */
  getComponent<T extends Component>(componentClass: new (...args: any[]) => T): T {
    let component = this.getComponentIfExists(componentClass);
    if (component === null) {
      throw new Error(`Component of type ${componentClass.name} not found on GameObject ${this.#name}`);
    }
    return component;
  }

  destroy() {
    this.#destroyEvents.forEach(event => event());
    this.#components = {}; // redundant
    this.#destroyed = true;
  }

  onDestroy(callback: Function) {
    this.#destroyEvents.push(callback);
  }

  // read only
  get id() {
    return this.#id;
  }
  get name() {
    return this.#name;
  }
  get destroyed() {
    return this.#destroyed;
  }
}