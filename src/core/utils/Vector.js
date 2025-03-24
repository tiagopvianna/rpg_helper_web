import Player from "../entities/Player.js"; // Add this import

export default class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    getDirectionEnum()
    {
        const angle = Math.atan2(this.x, this.y) * (180 / Math.PI);

        let direction;
        if (angle >= -22.5 && angle < 22.5) {
            direction = Player.Direction.SOUTH;
        } else if (angle >= 22.5 && angle < 67.5) {
            direction = Player.Direction.SOUTHEAST;
        } else if (angle >= 67.5 && angle < 112.5) {
            direction = Player.Direction.EAST;
        } else if (angle >= 112.5 && angle < 157.5) {
            direction = Player.Direction.NORTHEAST;
        } else if (angle >= 157.5 || angle < -157.5) {
            direction = Player.Direction.NORTH;
        } else if (angle >= -157.5 && angle < -112.5) {
            direction = Player.Direction.NORTHWEST;
        } else if (angle >= -112.5 && angle < -67.5) {
            direction = Player.Direction.WEST;
        } else if (angle >= -67.5 && angle < -22.5) {
            direction = Player.Direction.SOUTHWEST;
        }

        return direction
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    static GetDifference(vector1, vector2) {
        return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);        
    }
}