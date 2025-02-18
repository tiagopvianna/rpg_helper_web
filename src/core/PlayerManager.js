export default class PlayerManager {
    constructor(scene, socketService) {
        this.scene = scene;
        this.socketService = socketService;
        this.players = {};
        this.localPlayer = null;
        // todo: move to Player.js
        this.movementCircle = this.scene.add.graphics();
        this.moveRange = 100;
        this.movementCircle.setAlpha(0);

        this.initializeLocalPlayer();
        this.setListeners();
    }

    initializeLocalPlayer() {
        this.localPlayer = this.scene.add.sprite(150, 100, "piece").setInteractive();
        this.localPlayer.isSelected = false;

        this.localPlayer.on("pointerdown", (pointer, localX, localY, event) => {
            event.stopPropagation();
            this.selectLocalPlayer();
        },
        );

        this.players["local"] = this.localPlayer;
    }

    addPlayer(id, x, y, texture = "piece") {
        if (!this.players[id]) {
            let player = this.scene.add.sprite(x, y, texture).setInteractive();
            player.isSelected = false;

            // player.on("pointerdown", () => {
            //     this.localPlayer = this.selectLocalPlayer();
            // });

            this.players[id] = player;
        }
    }

    removePlayer(id) {
        if (this.players[id]) {
            this.players[id].destroy();
            delete this.players[id];
        }
    }

    updatePlayer(id, x, y) {
        if (this.players[id]) {
            this.players[id].x = x;
            this.players[id].y = y;
        }
    }

    selectLocalPlayer() {
        if (!this.localPlayer.isSelected) {
            this.localPlayer.setTexture("piece_selected");
            this.localPlayer.isSelected = true;
            this.showMoveRange(this.localPlayer);
        } else {
            this.localPlayer.setTexture("piece");
            this.localPlayer.isSelected = false;
            this.hideMoveRange();
        }
    }

    showMoveRange(player) {
        this.movementCircle.clear();
        this.movementCircle.lineStyle(2, 0x0000ff, 1);
        this.movementCircle.strokeCircle(player.x, player.y, this.moveRange);
        this.movementCircle.setAlpha(1);
    }

    hideMoveRange() {
        this.movementCircle.setAlpha(0);
    }

    setListeners() {
        // TODO: fix circular dependency between PlayerManager and GameScene
        this.scene.input.on("pointerdown", (pointer) => {
            if (this.localPlayer.isSelected) {
                const distance = Phaser.Math.Distance.Between(
                    this.localPlayer.x, this.localPlayer.y, pointer.x, pointer.y
                );

                if (distance <= this.moveRange) {
                    this.localPlayer.x = pointer.x;
                    this.localPlayer.y = pointer.y;
                    this.selectLocalPlayer();
                    this.socketService.emit("playerMove", { x: pointer.x, y: pointer.y });
                }
            }
        });

        // Atualiza lista de jogadores ao entrar
        this.socketService.on("currentPlayers", (players) => {
            Object.keys(players).forEach((id) => {
                if (id !== this.socketService.socket.id) {
                    this.addPlayer(id, players[id].x, players[id].y);
                }
            });
        });

        // Novo jogador entrando
        this.socketService.on("newPlayer", (playerData) => {
            this.addPlayer(playerData.id, playerData.x, playerData.y);
        });

        // Jogador saindo
        this.socketService.on("playerLeft", (playerId) => {
            this.removePlayer(playerId);
        });

        // Atualização de posição dos jogadores
        this.socketService.on("updatePlayers", (players) => {
            Object.keys(players).forEach((id) => {
                if (id !== this.socketService.socket.id) {
                    this.updatePlayer(id, players[id].x, players[id].y);
                }
            });
        });
    }
}
