import { BaseDrawingUtils } from '@omegajump-core/drawing';
import { AnimationLink } from './models';
import { OjAnimation } from './oj-animation';

export interface ImageAnimationConfig {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  frames: number;
  totalDuration: number;
  zIndex: number;
  invisible?: boolean;
}

export class ImageAnimation<LinkT extends {}> extends OjAnimation<ImageAnimationConfig, LinkT> {
  private timeElapsed = 0;
  private readonly frameDuration: number;

  constructor(config: ImageAnimationConfig, link: AnimationLink<ImageAnimationConfig, LinkT>) {
    super(config, {}, Infinity, config.zIndex, link);

    this.frameDuration = config.totalDuration / config.frames;
  }

  public override tick(deltaTime: number): void {
    this.timeElapsed = (this.timeElapsed + deltaTime) % this.startingConfig.totalDuration;
  }

  public override draw(ctx: CanvasRenderingContext2D): void {
    if (this.currentConfig.invisible) {
      return;
    }

    BaseDrawingUtils.drawImage(ctx, {
      imageSrc: this.startingConfig.src,
      frameNumber: this.startingConfig.frames,
      frameToDrawIdx: this.currentFrameIdx,
      x: this.currentConfig.x,
      y: this.currentConfig.y,
      width: this.currentConfig.width,
      height: this.currentConfig.height
    });
  }

  private get currentFrameIdx(): number {
    return Math.floor(this.timeElapsed / this.frameDuration);
  }
}
