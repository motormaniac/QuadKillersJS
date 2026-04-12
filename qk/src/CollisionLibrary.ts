/**
 * All colliders are immutable (transformations return new objects)
 */

import { Vec } from "./Vector";

// Stores the types of different colliders
export let ColliderEnum = {
  BOX:0,
  CIRCLE:1,
  LINE:2,
}
export type ColliderEnumType = typeof ColliderEnum[keyof typeof ColliderEnum]

export interface Collider {
  /** Gets the type of the collider */
  get type(): ColliderEnumType;
  /** Returns a new Collider that is translated by this amount */
  translate(delta: Vec): Collider;
  /**
   * The boundingBox is a box collider that encloses this collider. 
   * It is used for broad-phase collision detection. If two colliders' bounding boxes do not collide, then the colliders themselves cannot collide.
   * Note that the bounding box is not necessarily the smallest box that can enclose the collider, but it should be a reasonably tight fit to avoid too many false positives in broad-phase collision detection.
   * */
  get boundingBox(): BoxColl;
}

/**
 * Automatically detects the type of the colliders and applies the appropriate collision detection function.
 * @param a First Collider
 * @param b Second Collider
 * @returns True if the colliders collide, false otherwise
 */
export function testCollision(a: Collider, b: Collider): boolean {
  const aType:ColliderEnumType = a.type;
  const bType:ColliderEnumType = b.type;

  let coll: boolean = false;
  switch (aType) {
    case ColliderEnum.BOX:
      switch (bType) {
        case ColliderEnum.BOX: coll = BoxBoxColl(a as BoxColl, b as BoxColl); break;
        case ColliderEnum.LINE: coll = BoxLineColl(a as BoxColl, b as LineColl); break;
        case ColliderEnum.CIRCLE: coll = BoxCircleColl(a as BoxColl, b as CircleColl); break;
      }
      break;
    case ColliderEnum.LINE:
      switch (bType) {
        case ColliderEnum.BOX: coll = LineBoxColl(a as LineColl, b as BoxColl); break;
        case ColliderEnum.LINE: coll = LineLineColl(a as LineColl, b as LineColl); break;
        case ColliderEnum.CIRCLE: coll = LineCircleColl(a as LineColl, b as CircleColl); break;
      }
      break;
    case ColliderEnum.CIRCLE:
      switch (bType) {
        case ColliderEnum.BOX: coll = CircleBoxColl(a as CircleColl, b as BoxColl); break;
        case ColliderEnum.LINE: coll = CircleLineColl(a as CircleColl, b as LineColl); break;
        case ColliderEnum.CIRCLE: coll = CircleCircleColl(a as CircleColl, b as CircleColl); break;
      }
      break;
  }
  return coll;
}

/** Collider representing a box orthoganal to the global coordinate plane */
export class BoxColl implements Collider {
  get type() {
    return ColliderEnum.BOX;
  }
  // Top left corner
  #p1: Vec;
  // Bottom right corner
  #p2: Vec;
  // Top left corner
  get p1() { return this.#p1; }
  // Top right corner
  get p2() { return this.#p2; }
  get center() { return new Vec(0.5 * (this.p1.x + this.p2.x), 0.5 * (this.p1.y + this.p2.y)); }
  get size() { return new Vec(this.p2.x - this.p1.x, this.p2.y - this.p1.y); }
  /**
   * No matter where the corners are placed, the constructor will rearrange them so that p1 is the top left corner and p2 is the bottom right corner.
   * @param p1 top left corner
   * @param p2 bottom right corner
   */
  constructor(p1: Vec, p2: Vec) {
    // Ensure p1 is the "top-left" point and p2 is the "bottom-right" point
    this.#p1 = new Vec(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y));
    this.#p2 = new Vec(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y));
  }

  /** Specify two opposite corners of the box */
  static useCorners(leftX: number, topY: number, rightX: number, bottomY: number) {
    return new BoxColl(new Vec(leftX, topY), new Vec(rightX, bottomY));
  }

  /** Create a box collider using the top left corner and dimensions */
  static useCornerAndSize(leftX: number, topY: number, width: number, height: number) {
    return new BoxColl(new Vec(leftX, topY), new Vec(leftX + width, topY + height));
  }

  /** Create a box collider using the center and dimensions */
  static useCenter(centerX: number, centerY: number, width: number, height: number) {
    return new BoxColl(
      new Vec(centerX - (0.5 * width), centerY - (0.5 * height)),
      new Vec(centerX + (0.5 * width), centerY + (0.5 * height))
    );
  }

  translate(delta: Vec) {
    return new BoxColl(
      this.p1.add(delta),
      this.p2.add(delta)
    );
  }
  get boundingBox() {
    return this;
  }
}

/** Collider representing a line segment */
export class LineColl implements Collider {
  get type() {
    return ColliderEnum.LINE;
  }
  #p1: Vec;
  #p2: Vec;
  constructor(p1: Vec, p2: Vec) {
      // Ensure p1 is the "leftmost" point
    if (p2.x < p1.x || (p2.x === p1.x && p2.y < p1.y)) {
      [p1, p2] = [p2, p1];
    }
    this.#p1 = p1;
    this.#p2 = p2;
  }

  get p1() { return this.#p1; }
  get p2() { return this.#p2; }
  get boundingBox() {
    return BoxColl.useCorners(
      Math.min(this.p1.x, this.p2.x),
      Math.min(this.p1.y, this.p2.y),
      Math.max(this.p1.x, this.p2.x),
      Math.max(this.p1.y, this.p2.y)
    );
  }

  translate(deltaPos: Vec) {
    return new LineColl(
      this.p1.add(deltaPos),
      this.p2.add(deltaPos)
    );
  }
}

/** Collider representing a circle */
export class CircleColl implements Collider {
  get type() {
    return ColliderEnum.CIRCLE;
  }
  #center: Vec;
  #radius: number;
  constructor(center: Vec, radius: number) {
    this.#center = center;
    this.#radius = radius;
  }

  get center() { return this.#center; }
  get radius() { return this.#radius; }
  get boundingBox() {
    return BoxColl.useCenter(
      this.center.x,
      this.center.y,
      2 * this.radius,
      2 * this.radius
    );
  }

  translate(deltaPos: Vec) {
    return new CircleColl(
      this.#center.add(deltaPos),
      this.#radius
    );
  }
}

// =====================
// Collision detection functions
// =====================

function BoxBoxColl(b1: BoxColl, b2: BoxColl) {
  // Utilizes the convention that x1 < x2 and y1 < y2
  return !(
    b1.p1.x > b2.p2.x ||
    b1.p2.x < b2.p1.x ||
    b1.p1.y > b2.p2.y ||
    b1.p2.y < b2.p1.y
  );
}

function CircleCircleColl(c1: CircleColl, c2: CircleColl) {
  return c2.center.sub(c1.center).magSq() < (c1.radius + c2.radius) * (c1.radius + c2.radius);
}

function LineLineColl(l1: LineColl, l2: LineColl) {
  if (!BoxBoxColl(l1.boundingBox, l2.boundingBox)) return false;

  if (
    l1.p1.equals(l2.p1) ||
    l1.p1.equals(l2.p2) ||
    l1.p2.equals(l2.p1) ||
    l1.p2.equals(l2.p2)) {
      return true; // Lines are identical
  }
  
  let v1 = l1.p2.sub(l1.p1); // v1 vector
  let v2 = l2.p2.sub(l2.p1); // v2 vector
  let v3 = l1.p1.sub(l2.p1); // difference between starting points

  // denominators are equal: v1 x v2 = v1 * v2.perpendicular() = v2 * v1.perpendicular()
  let denom = v1.cross(v2);
  if (denom === 0) return false; // Lines are parallel

  let s1 = (v3.dot(v2.perpendicular())) / denom;
  let s2 = (v3.dot(v1.perpendicular())) / denom;
  return s1 >= 0 && s1 <= 1 && s2 >= 0 && s2 <= 1;
}

function BoxLineColl(b: BoxColl, l: LineColl) {
  // First do a general bounding box collision detection
  if (!BoxBoxColl(b, l.boundingBox)) return false;

  // Visualization of linear interpolation
  const t1 = (b.p1.x - l.p1.x) / (l.p2.x - l.p1.x);
  const t2 = (b.p2.x - l.p1.x) / (l.p2.x - l.p1.x);
  const y1 = (1 - t1) * l.p1.y + l.p2.y * t1;
  const y2 = (1 - t2) * l.p1.y + l.p2.y * t2;

  // If y1 and y2 are on opposite sides of the box, the line collides
  return !((y1 < b.p1.y && y2 < b.p1.y) || (y1 > b.p2.y && y2 > b.p2.y));
}

function LineBoxColl(l: LineColl, b: BoxColl) {
  return BoxLineColl(b, l);
}

function BoxCircleColl(b: BoxColl, c: CircleColl) {
  // Overall bounding box check
  if (!BoxBoxColl(b, c.boundingBox)) return false;

  // Distance from the center of the box to the center of the circle
  let x = Math.abs(c.center.x - b.center.x) - b.size.x * 0.5;
  if (x < 0) x = 0;
  let y = Math.abs(c.center.y - b.center.y) - b.size.y * 0.5;
  if (y < 0) y = 0;

  // Use distance squared to avoid square root
  return x * x + y * y < c.radius * c.radius;
}

function CircleBoxColl(c: CircleColl, b: BoxColl) {
  return BoxCircleColl(b, c);
}

function LineCircleColl(l: LineColl, c: CircleColl) {
  // Bounding box check
  if (!BoxLineColl(c.boundingBox, l)) return false;

  // Strategy developed by Matthew Emmanuel: https://www.desmos.com/geometry/luvh5tpbii
  const AB = l.p2.sub(l.p1); // Vector representing line
  const AC = c.center.sub(l.p1); // Vector between p1 and circle center
  const ABmag = AB.mag();
  const dot = AB.dot(AC) / ABmag; // Parallel projection

  if (dot >= ABmag) {
    return l.p2.sub(c.center).magSq() < c.radius * c.radius;
  } else if (dot <= 0) {
    return l.p1.sub(c.center).magSq() < c.radius * c.radius;
  }
  return AC.magSq() - dot * dot < c.radius * c.radius; // Pythagorean theorem
}

function CircleLineColl(c: CircleColl, l: LineColl) {
  return LineCircleColl(l, c);
}