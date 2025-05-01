import Phaser from "phaser";

export default class Animator {
  private sprite: Phaser.GameObjects.Sprite;
  private currentAnimation: string | null = null;

  constructor(sprite: Phaser.GameObjects.Sprite) {
    this.sprite = sprite;
  }

  play(animationKey: string) {
    if (this.currentAnimation !== animationKey) {
      this.sprite.anims.play(animationKey, true);
      this.currentAnimation = animationKey;
    }
  }

  stop() {
    this.sprite.anims.stop();
    this.currentAnimation = null;
  }
}
