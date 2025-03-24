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
    }

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

    moveTo(x, y) {
        const dx = x - this.sprite.x;
        const dy = y - this.sprite.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        if (angle >= -22.5 && angle < 22.5) {
            this.sprite.setFrame(6); // East
        } else if (angle >= 22.5 && angle < 67.5) {
            this.sprite.setFrame(7); // Southeast
        } else if (angle >= 67.5 && angle < 112.5) {
            this.sprite.setFrame(0); // South
        } else if (angle >= 112.5 && angle < 157.5) {
            this.sprite.setFrame(1); // Southwest
        } else if (angle >= 157.5 || angle < -157.5) {
            this.sprite.setFrame(2); // West
        } else if (angle >= -157.5 && angle < -112.5) {
            this.sprite.setFrame(3); // Northwest
        } else if (angle >= -112.5 && angle < -67.5) {
            this.sprite.setFrame(4); // North
        } else if (angle >= -67.5 && angle < -22.5) {
            this.sprite.setFrame(5); // Northeast
        }

        this.sprite.x = x;
        this.sprite.y = y;
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
