import { Drawable } from './models';

export class DrawingController {
  private readonly ctx: CanvasRenderingContext2D;
  private drawingQueueMap: Record<number, Drawable[]> = {};

  constructor(private readonly canvas: HTMLCanvasElement) {
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
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    Object.keys(this.drawingQueueMap)
      .map(Number)
      .sort((a, b) => a - b)
      .forEach(zIndex => {
        this.drawingQueueMap[zIndex].forEach(drawingFunction => {
          drawingFunction.draw(this.ctx);
        });
      });
    this.drawingQueueMap = {};
  }
}
