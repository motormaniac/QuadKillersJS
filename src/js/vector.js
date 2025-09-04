//all functions produce a new Vector2D object. No function modifies any vectors involved in the operation.

class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    
    // Clone
    clone() {
        return new Vector2D(this.x, this.y);
    }

    // Addition
    add(x,y=undefined) {
        if (y===undefined) {
            return new Vector2D(this.x + x.x, this.y+x.y);
        } else {
        return new Vector2D(this.x + x, this.y + y);
        }
    }

    // Subtraction
    sub(x,y=undefined) {
        if (y == undefined) {
            return new Vector2D(this.x-x.x, this.y-x.y)
        } else {
        return new Vector2D(this.x - x, this.y - y);
        }
    }

    // Scalar multiplication
    mul(scalar) {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }

    // Scalar division
    div(scalar) {
        return new Vector2D(this.x / scalar, this.y / scalar);
    }

    // Dot product
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    // Normalize
    normalize() {
        const mag = this.magnitude();
        return mag === 0 ? new Vector2D(0, 0) : this.div(mag);
    }

    // Magnitude
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // Magnitude squared
    magSq() {
        return this.x * this.x + this.y * this.y;
    }

    // Set magnitude
    setMag(mag) {
        const currentMag = this.magnitude();
        if (currentMag === 0) return new Vector2D(0, 0);
        return this.mul(mag / currentMag);
    }
    static random() {
        return new Vector2D(Math.random(), Math.random());
    }
    static lerp(v1, v2, t) {
        return v1.mul(1 - t).add(v2.mul(t));
    }
    static map(vector, a, b, c, d) {
        return new Vector2D(
            Util.map(vector.x, a, b, c, d),
            Util.map(vector.y, a, b, c, d)
        );
    }
    // Operator overloading using Symbol
    static [Symbol.hasInstance](instance) {
        return instance instanceof Vector2D;
    }

    toString() {
        return `Vector2D(${this.x}, ${this.y})`;
    }

    // Returns the angle of the vector in radians using atan2 (works in all quadrants)
    angle() {
        return Math.atan2(this.y, this.x);
    }

    static ZERO = new Vector2D(0,0)
    static ONE = new Vector2D(1, 1);
    static UP = new Vector2D(0, -1);
    static DOWN = new Vector2D(0, 1);
    static LEFT = new Vector2D(-1, 0);
    static RIGHT = new Vector2D(1, 0);
}