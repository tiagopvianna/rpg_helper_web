
import { Direction } from "./Direction";

export default class Vector {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    getDirectionEnum(): Direction {

        const angle = Math.atan2(this.x, this.y) * (180 / Math.PI);

        let direction: Direction;
        if (angle >= -22.5 && angle < 22.5) {
            direction = Direction.SOUTH;
        } else if (angle >= 22.5 && angle < 67.5) {
            direction = Direction.SOUTHEAST;
        } else if (angle >= 67.5 && angle < 112.5) {
            direction = Direction.EAST;
        } else if (angle >= 112.5 && angle < 157.5) {
            direction = Direction.NORTHEAST;
        } else if (angle >= 157.5 || angle < -157.5) {
            direction = Direction.NORTH;
        } else if (angle >= -157.5 && angle < -112.5) {
            direction = Direction.NORTHWEST;
        } else if (angle >= -112.5 && angle < -67.5) {
            direction = Direction.WEST;
        } else if (angle >= -67.5 && angle < -22.5) {
            direction = Direction.SOUTHWEST;
        } else {
            // default case to prevent returning undefined
            direction = Direction.SOUTH;
        }

        return direction
    }

    magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize(): Vector {
        const magnitude = this.magnitude();
        if (magnitude === 0) {
            return new Vector(0, 0); // Return a zero vector if the magnitude is zero
        }
        return new Vector(this.x / magnitude, this.y / magnitude);
    }

    static GetDifference(vector1: Vector, vector2: Vector): Vector {
        return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
    }
}