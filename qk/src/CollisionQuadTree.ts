import { BoxColl, testCollision, type Collider } from "./CollisionLibrary";
import type { ColliderComponent } from "./components/Collider";
import { logError } from "./Error";
import { Vec } from "./Vector";

const TREE_DEPTH_LIMIT = 5;
const MAX_OBJECTS = 4;

// Functions as the node of the quad tree.
class QuadTree {
  #isLeaf: boolean = true;
  #depth: number;
  #objects: ColliderComponent[] = [];
  #children: QuadTree[] = [];
  #topLeft: Vec;
  #size: number; // quad tree is a square
  #boundingBox: Collider;
  constructor(topLeft: Vec, size: number, depth: number) {
    this.#topLeft = topLeft;
    this.#size = size;
    this.#depth = depth;
    this.#boundingBox = BoxColl.useCornerAndSize(this.#topLeft.x, this.#topLeft.y, this.#size, this.#size);
  }

  static createRoot(topLeft: Vec, size: number, depth: number): QuadTree {
    let root = new QuadTree(topLeft, size, depth);
    return root;
  }

  /**
   * Creates 4 children and moves objects to the children with insert.
   */
  #subdivide() {
    this.#isLeaf = false;
    // create 4 leaf children
    const halfSize = this.#size / 2;
    this.#children.push(new QuadTree(this.#topLeft, halfSize, this.#depth + 1));
    this.#children.push(new QuadTree(this.#topLeft.add(new Vec(halfSize, 0)), halfSize, this.#depth + 1));
    this.#children.push(new QuadTree(this.#topLeft.add(new Vec(0, halfSize)), halfSize, this.#depth + 1));
    this.#children.push(new QuadTree(this.#topLeft.add(new Vec(halfSize, halfSize)), halfSize, this.#depth + 1));
    // move objects to children
    this.#objects.forEach((obj) => {
      this.#insert(obj);
    });
    this.#objects = [];
  }

  /**
   * Public facing method. Assumes that the current node this is called on is the root. If out of bounds, does not insert.
   * @param colliderComp 
   * @returns true if inserted, false if out of bounds
   */
  insert(colliderComp: ColliderComponent): boolean {
    if (!testCollision(this.#boundingBox, colliderComp.collider.boundingBox)) {
      return false;
    }
    this.#insert(colliderComp);
    return true;
  }

  /**
   * Uses broad-phase bounding boxes during insertion
   * Insert one object into the tree. The algorithm starts at the root and traverses down the tree.
   * If leaf, it checks if there are more than MAX_OBJECTS. If so, it subdivides.
   * If not leaf, tries to insert the child into one of the branches. Colliders that overlap multiple branches are stored in the biggest node that contains it.
   * @param colliderComp 
   */
  #insert(colliderComp: ColliderComponent): void {
    if (this.#isLeaf) {
      this.#objects.push(colliderComp);
      if (this.#objects.length > MAX_OBJECTS && this.#depth < TREE_DEPTH_LIMIT) {
        this.#subdivide();
      }
    } else {
      let overlapChild: QuadTree | null = null;
      for (const child of this.#children) {
        if (testCollision(child.#boundingBox, colliderComp.collider.boundingBox)) {
          if (overlapChild) {
            // if more than one child overlaps, insert into current node
            this.#objects.push(colliderComp);
            return;
          }
          overlapChild = child;
        }
      }
      if (overlapChild !== null) {
        overlapChild.#insert(colliderComp);
      } else {
        // colliders that don't overlap are forgotten / not put in tree
        logError("Collider does not overlap with any children");
      }
    }
  }

  /**
   * Recursive function for checking collisions between all objects.
   * The algorithm starts at the root and traverses down the tree. At each node, it checks for collisions between its own objects and the previous objects.
   * @param previous All previous colliders from the root to the current node.
   */
  checkCollision(previous: ColliderComponent[]): void {
    for (let i = 0; i < this.#objects.length; i++) {
      // Check collision with objects in the same node
      for (let j = i + 1; j < this.#objects.length; j++) {
        if (testCollision(this.#objects[i].collider, this.#objects[j].collider)) {
          this.#objects[i].triggerCollide(this.#objects[j]);
          this.#objects[j].triggerCollide(this.#objects[i]);
        }
      }
      // Check collision with objects in previous nodes
      previous.forEach((prev) => {
        if (testCollision(this.#objects[i].collider, prev.collider)) {
          this.#objects[i].triggerCollide(prev);
          prev.triggerCollide(this.#objects[i]);
        }
      });
    }
    // continue searching the rest of the tree
    if (!this.#isLeaf) {
      this.#children.forEach((child) => {
        child.checkCollision(previous.concat(this.#objects));
      });
    }
  }
}