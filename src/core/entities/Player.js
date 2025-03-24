import SpriteAnimation from "./SpriteAnimation.js";
import Animator from "./Animator.js";
import Vector from "../utils/Vector.js";
import Collider from "./Collider.js";

export default class Player {
    constructor(scene, id, startingPosition, isLocal = false) {
        this.scene = scene;
        this.id = id;
        this.isLocal = isLocal;
        this.isSelected = false;
        this.movementCircle = this.scene.add.graphics();
        this.moveRange = 100;
        this.movementCircle.setAlpha(0);
        this.collider = new Collider(this, new Vector(37,28), 21, 33);

        this.sprite = this.scene.add.sprite(startingPosition.x, startingPosition.y, 'player_idle', 0).setInteractive(); // Set the initial frame to 0

        if (isLocal) {
            this.sprite.on("pointerdown", (pointer, localX, localY, event) => {
                if (this.collider.containsPoint(new Vector(localX, localY)))
                {
                    event.stopPropagation();
                    this.toggleSelection();
                }
            });
        }

        this.lookDirection = { dx: 0, dy: 0 }; 
        this.currentDirection = Player.Direction.SOUTH;
        this.isWalking = false;

        const animations = {};
        animations['idle_south'] = new SpriteAnimation('player_idle', 8, 0);
        animations['idle_southwest'] = new SpriteAnimation('player_idle', 8, 1);
        animations['idle_west'] = new SpriteAnimation('player_idle', 8, 2);
        animations['idle_northwest'] = new SpriteAnimation('player_idle', 8, 3);
        animations['idle_north'] = new SpriteAnimation('player_idle', 8, 4);
        animations['idle_northeast'] = new SpriteAnimation('player_idle', 8, 5);
        animations['idle_east'] = new SpriteAnimation('player_idle', 8, 6);
        animations['idle_southeast'] = new SpriteAnimation('player_idle', 8, 7);

        animations['walk_south'] = new SpriteAnimation('player_walking', 8, 0, 6);
        animations['walk_southwest'] = new SpriteAnimation('player_walking', 8, 6, 6);
        animations['walk_west'] = new SpriteAnimation('player_walking', 8, 12, 6);
        animations['walk_northwest'] = new SpriteAnimation('player_walking', 8, 18, 6);
        animations['walk_north'] = new SpriteAnimation('player_walking', 8, 24, 6);
        animations['walk_northeast'] = new SpriteAnimation('player_walking', 8, 30, 6);
        animations['walk_east'] = new SpriteAnimation('player_walking', 8, 36, 6);
        animations['walk_southeast'] = new SpriteAnimation('player_walking', 8, 42, 6);

        this.animator = new Animator(this, animations, isLocal ? 0xffffff : 0xff0000);
    }

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
        var distanceVector = Vector.GetDifference(position, new Vector(this.sprite.x, this.sprite.y));
        
        this.currentDirection = distanceVector.getDirectionEnum();

        let animationName = ''

        if (reachedDestination) {
            this.isWalking = false;
            animationName = 'idle_';
        } else {
            this.isWalking = true;
            animationName = 'walk_';
        }

        let directionKey = Object.keys(Player.Direction).find(key => Player.Direction[key] === this.currentDirection);
        animationName += directionKey.toLowerCase();
        
        this.animator.play(animationName);
        this.sprite.x = position.x;
        this.sprite.y = position.y;
    }


    applyDamageEffect() {
        console.log(`⚔️ Player ${this.id} was hit!`);

        // Change sprite texture to indicate damage
        // this.sprite.setTexture(this.isLocal ? "piece_selected" : "enemy_damaged");

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
            // this.sprite.setTexture(this.isLocal ? "piece" : "enemy");
        }, 500);
    }

    destroy() {
        this.sprite.destroy();
    }
}
