export default class Player {
    constructor(scene, id, x, y, texture, isLocal = false) {
        this.scene = scene;
        this.id = id;
        this.isLocal = isLocal;
        this.isSelected = false;
        this.movementCircle = this.scene.add.graphics();
        this.moveRange = 100;
        this.movementCircle.setAlpha(0);

        this.sprite = this.scene.add.sprite(x, y, 'player_idle', 0).setInteractive(); // Set the initial frame to 0

        if (isLocal) {
            this.sprite.on("pointerdown", (pointer, localX, localY, event) => {
                event.stopPropagation();
                this.toggleSelection();
            });
        }

        this.lookDirection = { dx: 0, dy: 0 }; // Initialize look direction
        this.currentDirection = null; // Initialize current direction
        this.isWalking = false; // Initialize isWalking
        this.currentAnimationLength = 1; // Initialize current animation length
        this.animationInterval = null; // Initialize animation interval
        this.currentFrame = 0; // Initialize current frame
    }

    // Enum for directions
    static Direction = {
        SOUTH: 0,
        SOUTHWEST: 1,
        WEST: 2,
        NORTHWEST: 3,
        NORTH: 4,
        NORTHEAST: 5,
        EAST: 6,
        SOUTHEAST: 7
    };

    toggleSelection() {
        if (!this.isSelected) {
            // this.sprite.setTexture("piece_selected");
            this.isSelected = true;
            this.showMoveRange();
        } else {
            // this.sprite.setTexture("piece");
            this.isSelected = false;
            this.hideMoveRange();
        }
    }

    showMoveRange() {
        this.movementCircle.clear();
        this.movementCircle.lineStyle(2, 0x0000ff, 1);
        this.movementCircle.strokeCircle(this.sprite.x, this.sprite.y, this.moveRange);
        this.movementCircle.setAlpha(1);
    }

    hideMoveRange() {
        this.movementCircle.setAlpha(0);
    }

    moveTo(position, reachedDestination) {
        const dx = position.x - this.sprite.x;
        const dy = position.y - this.sprite.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        let newDirection;
        if (angle >= -22.5 && angle < 22.5) {
            newDirection = Player.Direction.EAST;
        } else if (angle >= 22.5 && angle < 67.5) {
            newDirection = Player.Direction.SOUTHEAST;
        } else if (angle >= 67.5 && angle < 112.5) {
            newDirection = Player.Direction.SOUTH;
        } else if (angle >= 112.5 && angle < 157.5) {
            newDirection = Player.Direction.SOUTHWEST;
        } else if (angle >= 157.5 || angle < -157.5) {
            newDirection = Player.Direction.WEST;
        } else if (angle >= -157.5 && angle < -112.5) {
            newDirection = Player.Direction.NORTHWEST;
        } else if (angle >= -112.5 && angle < -67.5) {
            newDirection = Player.Direction.NORTH;
        } else if (angle >= -67.5 && angle < -22.5) {
            newDirection = Player.Direction.NORTHEAST;
        }

        if (reachedDestination) {
            this.currentAnimationLength = 1;
            this.isWalking = false;
            this.sprite.setTexture('player_idle');
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        } else {
            this.currentAnimationLength = 6;
            this.isWalking = true;
            this.sprite.setTexture('player_walking');
            if (!this.animationInterval) {
                this.animationInterval = setInterval(() => this.updateSprite(), 200); // Set the interval to 200 milliseconds for the animation speed
            }
        }

        if (newDirection !== this.currentDirection) {
            this.currentDirection = newDirection;
            this.currentFrame = 0; // Reset to the first frame of the new direction
            this.sprite.setFrame(newDirection * this.currentAnimationLength);
        }

        this.sprite.x = position.x;
        this.sprite.y = position.y;
    }

    updateSprite() {
        if (this.isWalking) {
            this.currentFrame = (this.currentFrame + 1) % this.currentAnimationLength;
            this.sprite.setFrame(this.currentDirection * this.currentAnimationLength + this.currentFrame);
        }
    }

    applyDamageEffect() {
        console.log(`⚔️ Player ${this.id} was hit!`);

        // Change sprite texture to indicate damage
        this.sprite.setTexture(this.isLocal ? "piece_selected" : "enemy_damaged");

        // Floating damage text
        let damageText = this.scene.add.text(this.sprite.x, this.sprite.y - 50, "-1", {
            fontSize: "32px",
            fill: "#ff0000",
            fontWeight: "bold"
        }).setOrigin(0.5);

        // Animate text moving up and fading out
        this.scene.tweens.add({
            targets: damageText,
            y: this.sprite.y - 80,
            alpha: 0,
            duration: 500,
            onComplete: () => damageText.destroy()
        });

        // Restore original texture after 0.5 seconds
        setTimeout(() => {
            this.sprite.setTexture(this.isLocal ? "piece" : "enemy");
        }, 500);
    }

    destroy() {
        this.sprite.destroy();
    }
}
