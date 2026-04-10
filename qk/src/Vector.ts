//all functions produce a new Vector2D object. No function modifies any vectors involved in the operation.
//To get a reference to a Vector2D, use Observable

import { map } from "./Util";

export class Vec {
  #x: number;
  #y: number;

  get x() {
    return this.#x;
  }
  get y() {
    return this.#y;
  }
  // Use for destructuring into {x, y}  Ex: const {x, y} = vec.point;
  get point() {
    return {x: this.#x, y: this.#y};
  }
  constructor(x = 0, y = 0) {
    this.#x = x;
    this.#y = y;
  }

  static fromPolar(magnitude: number, angle: number) {
    return new Vec(
      magnitude * Math.cos(angle),
      magnitude * Math.sin(angle)
    );
  }
      
  // Create a copy of this vector
  clone() {
    return new Vec(this.#x, this.#y);
  }

  /**
   * Set the components of this vector
   * @param x new x component or if null, x component will not be changed
   * @param y new y component or if null, y component will not be changed
   * @returns new Vector2D
   */
  set(x: number | null, y: number | null) {
    return new Vec(
      x !== null ? x : this.#x,
      y !== null ? y : this.#y
    );
  }

  add(x:number | Vec) {
    if (x instanceof Vec) {
      return new Vec(this.#x + x.#x, this.#y + x.#y);
    } else {
      return new Vec(this.#x + x, this.#y + x);
    }
  }

  // Subtraction
  sub(x:number | Vec) {
    if (x instanceof Vec) {
      return new Vec(this.#x - x.#x, this.#y - x.#y);
    } else {
      return new Vec(this.#x - x, this.#y - x);
    }
  }

  // Scalar multiplication
  mul(scalar: number) {
    return new Vec(this.#x * scalar, this.#y * scalar);
  }

  // Scalar division
  div(scalar: number) {
    return new Vec(this.#x / scalar, this.#y / scalar);
  }

  equals(v: Vec) {
    return this.#x === v.#x && this.#y === v.#y;
  }

  // Dot product
  dot(v: Vec) {
    return this.#x * v.#x + this.#y * v.#y;
  }

  // cross product
  cross(v: Vec) {
    return this.#x * v.#y - this.#y * v.#x;
  }

  // Normalize
  normalize() {
    const mag = this.mag();
    return mag === 0 ? new Vec(0, 0) : this.div(mag);
  }

  // mag
  mag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  // mag squared
  magSq(): number {
    return this.x * this.x + this.y * this.y;
  }

  // Set mag
  setMag(mag: number): Vec {
    const currentMag = this.mag();
    if (currentMag === 0) return new Vec(0, 0);
    return this.mul(mag / currentMag);
  }
  perpendicular() {
    return new Vec(-this.y, this.x)
  }
  /**
   * Rotates vector clockwise by angle (in radians)
   * @param angle in radians
   * @returns new Vector2D
   */
  rotate(angle: number) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vec(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }
  static random() {
    return new Vec(Math.random(), Math.random());
  }
  static randomDirection() {
    const angle = Math.random() * 2 * Math.PI;
    return Vec.fromPolar(1, angle);
  }
  static lerp(v1: Vec, v2: Vec, t: number) {
    return v1.mul(1 - t).add(v2.mul(t));
  }
  lerp(v2: Vec, t: number) {
    return Vec.lerp(this, v2, t)
  }
  static map(vector: Vec, a: number, b: number, c: number, d: number) {
    return new Vec(
      map(vector.x, a, b, c, d),
      map(vector.y, a, b, c, d)
    );
  }
  map(a: number, b: number, c: number, d: number) {
    return Vec.map(this, a,b,c,d)
  }
  toString() {
    return `Vector2D(${this.x}, ${this.y})`;
  }

  // Returns the angle of the vector in radians using atan2 (works in all quadrants)
  angle() {
    return Math.atan2(this.y, this.x);
  }

  static ZERO = new Vec(0,0)
  static ONE = new Vec(1, 1);
  static UP = new Vec(0, -1);
  static DOWN = new Vec(0, 1);
  static LEFT = new Vec(-1, 0);
  static RIGHT = new Vec(1, 0);
}