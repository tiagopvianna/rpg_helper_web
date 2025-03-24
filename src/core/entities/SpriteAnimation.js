export default class SpriteAnimation {
    constructor(spriteSheet, framerate, firstFrameIndex, lastFrameIndex) {
        this.spriteSheet = spriteSheet;
        this.framerate = framerate;
        this.firstFrameIndex = firstFrameIndex;
        this.lastFrameIndex = lastFrameIndex;
        this.currentFrame = 0;
        this.animationInterval = null;
        this.color = 0xffffff;
    }

    setTarget(target) {
        this.target = target;
    }
    setColor(color)
    {
        this.color = color;
    }

    play() {
        this.target.sprite.setTexture(this.spriteSheet);
        this.target.sprite.setTint(this.color);
        this.target.sprite.setFrame(this.firstFrameIndex);
        this.#startAnimation();
    }
    stop() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    #updateSprite() {
        this.currentFrame = (this.currentFrame + 1) % (this.lastFrameIndex - this.firstFrameIndex + 1);
        this.target.sprite.setFrame(this.firstFrameIndex + this.currentFrame);
    }

    #startAnimation() {
        const frameDuration = 1000 / this.framerate;
        this.animationInterval = setInterval(() => {
            this.#updateSprite();
        }, frameDuration);
    }
}
