let idNumber = 0;

export interface ComponentType {
  init(gameObject: GameObject): void;
  update(gameObject: GameObject): void;
}

export class GameObject {
  #id: number;
  // hashmap of component class name to component instance
  #components: Record<string, ComponentType> = {};
  #name: string;
  constructor (name:string, components: ComponentType[]) {
    this.#id = idNumber;
    idNumber++;
    this.#name = name;
    for (let component of components) {
      this.#components[component.constructor.name] = component;
    }
    // make sure all components are instantiated before initializing
    for (let component of Object.values(this.#components)) {
      component.init(this);
    }
  }

  update() {
    for (let component of Object.values(this.#components)) {
      component.update(this);
    }
  }
  /**
   * returns the first component of the specified type, or null if not found
   * Since types are erased at compile time, pass in a class constructor to check instanceof against
   */
  getComponentIfExists<T extends ComponentType>(componentClass: new (...args: any[]) => T): T {
    return this.#components[componentClass.name] as T || null;
  }

  /**
   * returns the first component of the specified type, or throws an error if not found
   * @param componentClass Class of the target component
   * @returns Component
   */
  getComponent<T extends ComponentType>(componentClass: new (...args: any[]) => T): T {
    let component = this.getComponentIfExists(componentClass);
    if (component === null) {
      throw new Error(`Component of type ${componentClass.name} not found on GameObject ${this.#name}`);
    }
    return component;
  }

  // read only
  get id() {
    return this.#id;
  }
  get name() {
    return this.#name;
  }
}