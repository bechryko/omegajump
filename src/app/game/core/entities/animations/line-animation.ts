import { BaseDrawingUtils } from '@omegajump-core/drawing';
import { OjAnimation } from './oj-animation';

export interface LineAnimationConfig {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  lineWidth?: number;
  opacity?: number;
}

export class LineAnimation<LinkT extends {} = any> extends OjAnimation<LineAnimationConfig, LinkT> {
  public override draw(ctx: CanvasRenderingContext2D): void {
    BaseDrawingUtils.drawLine(ctx, this.currentConfig);
  }
}
