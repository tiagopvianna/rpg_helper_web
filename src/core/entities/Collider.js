export default class Collider {
    constructor(attachedObject, startCoordinates, width, height) {
        this.x = startCoordinates.x;
        this.y = startCoordinates.y;
        this.width = width;
        this.height = height;
        this.attachedObject = attachedObject;
    }

    // Method to check if this collider intersects with another collider
    intersects(other) {
        return !(this.x + this.width < other.x ||
                 this.x > other.x + other.width ||
                 this.y + this.height < other.y ||
                 this.y > other.y + other.height);
    }

    // Method to check if a point is inside the collider
    containsPoint(point) {
        const absoluteX = this.x + this.attachedObject.sprite.x;
        const absoluteY = this.y + this.attachedObject.sprite.y;
        return point.x >= this.x &&
               point.x <= this.x + this.width &&
               point.y >= this.y &&
               point.y <= this.y + this.height;
    }
}
