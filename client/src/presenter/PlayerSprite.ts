import Phaser from "phaser";
import Position from "../Position";

export class PlayerSprite {
  private sprite: Phaser.GameObjects.Sprite;
  id: string;

  constructor(scene: Phaser.Scene, id: string, position: Position) {
    this.id = id;
    this.sprite = scene.add.sprite(position.x, position.y, "piece");
    this.sprite.setOrigin(0.5, 0.5);
  }

  moveTo(position: Position) {
    this.sprite.setPosition(position.x, position.y);
  }

  destroy() {
    this.sprite.destroy();
  }
}
