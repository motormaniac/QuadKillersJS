import { GraphicsContext } from "pixi.js";
import { GameObject } from "../GameObject";
import { GraphicsComponent } from "../components/Graphics";
import { PhysicsComponent } from "../components/Physics";
import { PixiRootComponent } from "../components/PixiRoot";
import { Vec } from "../Vector";

const graphicsContext: GraphicsContext = new GraphicsContext()
  .circle(0, 0, 10)
  .fill('#ff0000');

export function Bullet(position: Vec, speed: number, direction: Vec): GameObject {
    return new GameObject("bullet", [
        new PixiRootComponent(),
        new GraphicsComponent(graphicsContext),
        new PhysicsComponent(position, direction.mul(speed), Vec.ZERO),
    ])
}