import Vector from "./utils/Vector.js";

export default class InputManager {
    constructor(scene, playerManager) {
        this.scene = scene;
        this.playerManager = playerManager;

        this.setListeners();
    }

    setListeners() {
        this.scene.input.on("pointerdown", (pointer) => {
            var mousePos = new Vector(pointer.x, pointer.y);
            if (this.playerManager.localPlayer.isSelected) {
                let actionTaken = false;
                Object.values(this.playerManager.players).forEach(player => {
                    if (!player.isLocal && player.collider.containsPointAbsolute(mousePos)) {
                        this.playerManager.attackPlayer(player, player.id);
                        actionTaken = true;
                        return;
                    }
                });

                if (actionTaken) return;

                var spriteVector = new Vector(this.playerManager.localPlayer.sprite.x, this.playerManager.localPlayer.sprite.y);
                const distance = Vector.GetDifference(spriteVector, mousePos).magnitude();

                if (distance <= this.playerManager.localPlayer.moveRange) {
                    this.playerManager.localPlayer.toggleSelection();
                    this.playerManager.socketService.emit("playerMove", mousePos);
                }
            }
            else if (this.playerManager.localPlayer.collider.containsPointAbsolute(mousePos))
            {
                // event.stopPropagation();
                this.playerManager.localPlayer.toggleSelection();
            }
        });
    }
}
