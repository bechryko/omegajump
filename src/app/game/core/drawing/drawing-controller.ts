import { Drawable } from './models';
import { BaseDrawingUtils } from './utils';

export class DrawingController {
  private readonly ctx: CanvasRenderingContext2D;
  private drawingQueueMap: Record<number, Drawable[]> = {};

  constructor(
    public readonly canvas: HTMLCanvasElement,
    private readonly backgroundColor: string
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('2D rendering context not supported');
    }
    this.ctx = ctx;
  }

  public registerDrawable(drawable: Drawable): void {
    const zIndex = drawable.zIndex;
    if (!this.drawingQueueMap[zIndex]) {
      this.drawingQueueMap[zIndex] = [];
    }
    this.drawingQueueMap[zIndex].push(drawable);
  }

  public draw(): void {
    this.clearCanvas();

    Object.keys(this.drawingQueueMap)
      .map(Number)
      .sort((a, b) => a - b)
      .forEach(zIndex => {
        this.drawingQueueMap[zIndex].forEach(drawable => {
          drawable.draw(this.ctx);
        });
      });
    this.drawingQueueMap = {};
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public bindToCtx<A extends any[]>(callback: (ctx: CanvasRenderingContext2D, ...args: A) => void, ...args: A): void {
    callback(this.ctx, ...args);
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    BaseDrawingUtils.setContextColor(this.ctx, this.backgroundColor);
    BaseDrawingUtils.setContextOpacity(this.ctx, 1);
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
