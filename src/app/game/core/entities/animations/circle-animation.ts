import { BaseDrawingUtils } from '@omegajump-core/drawing';
import { OjAnimation } from './oj-animation';

export interface CircleAnimationConfig {
  x: number;
  y: number;
  radius: number;
  color: string;
  lineWidth?: number;
  isStroke?: boolean;
  opacity?: number;
}

export class CircleAnimation<LinkT extends {} = any> extends OjAnimation<CircleAnimationConfig, LinkT> {
  public override draw(ctx: CanvasRenderingContext2D): void {
    BaseDrawingUtils.drawCircle(ctx, this.currentConfig);
  }
}
