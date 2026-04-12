import { BoxColl, testCollision } from "./CollisionLibrary";
import type { ColliderComponent } from "./components/Collider";
import type { Vec } from "./Vector";

const GRID_SIZE = 10;

// encloses one collider and keeps track of other cells it is in.
class GridInstance {
  gridCells: string[] = []; // all grid cells that contain this instance
  colliderComponent: ColliderComponent;
  constructor(colliderComp: ColliderComponent) {
    this.colliderComponent = colliderComp;
  }
}

// one cell in the grid. Stores all the instances.
class GridCell {
  #coords: [number, number];
  #instances: GridInstance[] = [];
  #boundingBox: BoxColl;

  constructor(coords: [number, number]) {
    this.#coords = coords;
    this.#boundingBox = BoxColl.useCorners(
      coords[0] * GRID_SIZE,
      coords[1] * GRID_SIZE,
      (coords[0] + 1) * GRID_SIZE,
      (coords[1] + 1) * GRID_SIZE
    );
  }
  get boundingBox() {
    return this.#boundingBox;
  }
  reset() {
    this.#instances = [];
  }
  addInstance(instance: GridInstance) {
    this.#instances.push(instance);
  }
  getKey(): string {
    return `${this.#coords[0]},${this.#coords[1]}`;
  }
}

// A full grid of colliders. Used for broad phase collision detection.
export class CollisionGrid {
  // Example key: (0,0) --> "0,0"
  #cells: Map<string, GridCell> = new Map();

  /**
   * Gets the grid coordinates of the cell that contains the given position.
   * @param pos real position
   * @returns grid coordinates [x, y]
   */
  getGridCoordinates(pos: Vec): [number, number] {
    return [Math.floor(pos.x / GRID_SIZE), Math.floor(pos.y / GRID_SIZE)];
  }

  addCollider(colliderComp: ColliderComponent) {
    const boundingBox = colliderComp.collider.boundingBox;
    const [minX, minY] = this.getGridCoordinates(boundingBox.p1);
    const [maxX, maxY] = this.getGridCoordinates(boundingBox.p2);

    let gridInstance = new GridInstance(colliderComp);
    
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        const key = `${x},${y}`;
        if (!this.#cells.has(key)) {
          // slightly inefficient because it sometimes creates empty cells without colliders
          this.#cells.set(key, new GridCell([x, y]));
        }
        const cell = this.#cells.get(key)!;
        if (!testCollision(cell.boundingBox, colliderComp.collider)) {
          continue; // skip if the cell does not actually intersect the collider
        }
        gridInstance.gridCells.push(key);
        cell.addInstance(gridInstance);
      }
    }
  }

  reset() {
    this.#cells.forEach(cell => cell.reset());
  }
}
