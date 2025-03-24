export default class SpriteAnimation {
    constructor(target, spriteSheet, framerate, firstFrameIndex, lastFrameIndex) {
        this.target = target;
        this.spriteSheet = spriteSheet;
        this.framerate = framerate;
        this.firstFrameIndex = firstFrameIndex;
        this.lastFrameIndex = lastFrameIndex;
        this.currentFrame = 0;
        this.animationInterval = null;
    }

    play() {
        this.target.sprite.setTexture(this.spriteSheet);
        this.target.sprite.setFrame(this.firstFrameIndex);
        this.startAnimation();
    }

    updateSprite() {
        this.currentFrame = (this.currentFrame + 1) % (this.lastFrameIndex - this.firstFrameIndex + 1);
        this.target.sprite.setFrame(this.firstFrameIndex + this.currentFrame);
    }

    startAnimation() {
        const frameDuration = 1000 / this.framerate;
        this.animationInterval = setInterval(() => {
            this.updateSprite();
        }, frameDuration);
    }

    stop() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

}
