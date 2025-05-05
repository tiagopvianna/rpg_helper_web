import Phaser from "phaser";
import Position from "../Position";
import Animator from "./Animator";

export class PlayerSprite {
  private sprite: Phaser.GameObjects.Sprite;
  private id: string;
  private animator: Animator;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, id: string, position: Position) {
    this.scene = scene;
    this.id = id;
    this.sprite = scene.add.sprite(position.x, position.y, "knight").setScale(3);
    this.sprite.setOrigin(0.5, 0.5);

    this.animator = new Animator(this.sprite);
    this.animator.play("player_idle");
  }

  attack() {
    this.animator.play("player_attack");

    this.sprite.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE + "-player_attack",
      () => {
        // when done, go back to idle
        this.animator.play("player_idle");
      }
    );
  }

  moveTo(newPosition: Position) {
    const distance = Phaser.Math.Distance.Between(
      this.sprite.x,
      this.sprite.y,
      newPosition.x,
      newPosition.y
    );

    this.animator.play("player_walking")
  
    this.sprite.scene.tweens.add({
      targets: this.sprite,
      x: newPosition.x,
      y: newPosition.y,
      duration: distance * 5, // time based on distance for consistent speed
      ease: 'Linear',
      onComplete: () => {
        this.animator.play("player_idle"); // Switch back to idle once movement finishes
      }
    });
  }  

  destroy() {
    this.sprite.destroy();
  }
}
