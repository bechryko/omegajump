import { CircleDrawingConfig, ImageDrawingConfig, LineDrawingConfig, RectangleDrawingConfig } from '../models';
import { ImageUtils } from './image.utils';

// eslint-disable-next-line no-magic-numbers
const FULL_CIRCLE_DEGREES = Math.PI * 2;

export class BaseDrawingUtils {
  private static readonly DEFAULT_DRAWING_COLOR = 'black';
  private static readonly DEFAULT_LINE_WIDTH = 1;

  public static drawRectangle(ctx: CanvasRenderingContext2D, rectangleConfig: RectangleDrawingConfig): void {
    this.setContextColor(ctx, rectangleConfig.color ?? this.DEFAULT_DRAWING_COLOR);
    const drawingFunction = rectangleConfig.isStroke ? ctx.strokeRect : ctx.fillRect;
    drawingFunction(rectangleConfig.x, rectangleConfig.y, rectangleConfig.width, rectangleConfig.height);
  }

  public static drawCircle(ctx: CanvasRenderingContext2D, circleConfig: CircleDrawingConfig): void {
    this.setContextColor(ctx, circleConfig.color ?? this.DEFAULT_DRAWING_COLOR);
    ctx.beginPath();
    ctx.arc(circleConfig.x, circleConfig.y, circleConfig.radius, 0, FULL_CIRCLE_DEGREES);
    const drawingFunction = circleConfig.isStroke ? ctx.stroke : ctx.fill;
    drawingFunction();
  }

  public static drawLine(ctx: CanvasRenderingContext2D, lineConfig: LineDrawingConfig): void {
    this.setContextColor(ctx, lineConfig.color ?? this.DEFAULT_DRAWING_COLOR);
    this.setContextLineWidth(ctx, lineConfig.lineWidth ?? this.DEFAULT_LINE_WIDTH);
    ctx.beginPath();
    ctx.moveTo(lineConfig.x1, lineConfig.y1);
    ctx.lineTo(lineConfig.x2, lineConfig.y2);
    ctx.stroke();
  }

  public static drawImage(ctx: CanvasRenderingContext2D, imageConfig: ImageDrawingConfig): void {
    const image = ImageUtils.getImage(imageConfig.imageSrc);
    ctx.drawImage(image, imageConfig.x, imageConfig.y, imageConfig.width, imageConfig.height);
  }

  private static setContextColor(ctx: CanvasRenderingContext2D, color: string): void {
    if (ctx.fillStyle !== color) {
      ctx.fillStyle = color;
    }
    if (ctx.strokeStyle !== color) {
      ctx.strokeStyle = color;
    }
  }

  private static setContextLineWidth(ctx: CanvasRenderingContext2D, lineWidth: number): void {
    if (ctx.lineWidth !== lineWidth) {
      ctx.lineWidth = lineWidth;
    }
  }
}
