import SpriteAnimation from "./SpriteAnimation.js";

export default class Player {
    constructor(scene, id, startingPosition, isLocal = false) {
        this.scene = scene;
        this.id = id;
        this.isLocal = isLocal;
        this.isSelected = false;
        this.movementCircle = this.scene.add.graphics();
        this.moveRange = 100;
        this.movementCircle.setAlpha(0);

        this.sprite = this.scene.add.sprite(startingPosition.x, startingPosition.y, 'player_idle', 0).setInteractive(); // Set the initial frame to 0

        if (isLocal) {
            this.sprite.on("pointerdown", (pointer, localX, localY, event) => {
                event.stopPropagation();
                this.toggleSelection();
            });
        }

        this.lookDirection = { dx: 0, dy: 0 }; 
        this.currentDirection = Player.Direction.SOUTH;
        this.isWalking = false;

        this.idleAnimations = {};
        this.idleAnimations[Player.Direction.SOUTH] = new SpriteAnimation(this, 'player_idle', 8, 0, 0);
        this.idleAnimations[Player.Direction.SOUTHWEST] = new SpriteAnimation(this, 'player_idle', 8, 1, 1);
        this.idleAnimations[Player.Direction.WEST] = new SpriteAnimation(this, 'player_idle', 8, 2, 2);
        this.idleAnimations[Player.Direction.NORTHWEST] = new SpriteAnimation(this, 'player_idle', 8, 3, 3);
        this.idleAnimations[Player.Direction.NORTH] = new SpriteAnimation(this, 'player_idle', 8, 4, 4);
        this.idleAnimations[Player.Direction.NORTHEAST] = new SpriteAnimation(this, 'player_idle', 8, 5, 5);
        this.idleAnimations[Player.Direction.EAST] = new SpriteAnimation(this, 'player_idle', 8, 6, 6);
        this.idleAnimations[Player.Direction.SOUTHEAST] = new SpriteAnimation(this, 'player_idle', 8, 7, 7);
        
        
        this.walkAnimations = {};
        this.walkAnimations[Player.Direction.SOUTH] = new SpriteAnimation(this, 'player_walking', 8, 0, 5);
        this.walkAnimations[Player.Direction.SOUTHWEST] = new SpriteAnimation(this, 'player_walking', 8, 6, 11);
        this.walkAnimations[Player.Direction.WEST] = new SpriteAnimation(this, 'player_walking', 8, 12, 17);
        this.walkAnimations[Player.Direction.NORTHWEST] = new SpriteAnimation(this, 'player_walking', 8, 18, 23);
        this.walkAnimations[Player.Direction.NORTH] = new SpriteAnimation(this, 'player_walking', 8, 24, 29);
        this.walkAnimations[Player.Direction.NORTHEAST] = new SpriteAnimation(this, 'player_walking', 8, 30, 35);
        this.walkAnimations[Player.Direction.EAST] = new SpriteAnimation(this, 'player_walking', 8, 36, 41);
        this.walkAnimations[Player.Direction.SOUTHEAST] = new SpriteAnimation(this, 'player_walking', 8, 42, 47);
        
        this.currentAnimation = this.idleAnimations[this.currentDirection];
        this.currentAnimation.play();
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

        this.currentDirection = newDirection;

        if (reachedDestination) {
            if (this.isWalking) {
                this.isWalking = false;
                this.currentAnimation.stop();
                this.currentAnimation = this.idleAnimations[this.currentDirection];
                this.currentAnimation.play();
            }
        } else {
            if (!this.isWalking)
            {
                this.isWalking = true;
                this.currentAnimation.stop();
                this.currentAnimation = this.walkAnimations[this.currentDirection];
                this.currentAnimation.play();
            }
        }
        
        this.sprite.x = position.x;
        this.sprite.y = position.y;
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
