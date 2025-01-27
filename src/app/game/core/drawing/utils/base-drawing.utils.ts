import { CameraUtils, MetricsUtils } from '@omegajump-core/physics';
import {
  CircleDrawingConfig,
  ImageDrawingConfig,
  LineDrawingConfig,
  OverlayDrawingConfig,
  RectangleDrawingConfig,
  TextDrawingConfig
} from '../models';
import { ImageUtils } from './image.utils';

// eslint-disable-next-line no-magic-numbers
const FULL_CIRCLE_DEGREES = Math.PI * 2;

const $ = MetricsUtils.convertOjUnitToPx;

export class BaseDrawingUtils {
  private static readonly DEFAULT_LINE_WIDTH = MetricsUtils.convertPxToOjUnit(1);
  private static readonly DEFAULT_OPACITY = 1;
  private static readonly DEFAULT_FONT_FACE = 'Arial';
  private static readonly DEFAULT_LINE_CAP: CanvasLineCap = 'round';

  private static drawingSettingsInitialized = false;

  public static drawRectangle(ctx: CanvasRenderingContext2D, config: RectangleDrawingConfig): void {
    BaseDrawingUtils.setContextColor(ctx, config.color);
    BaseDrawingUtils.setContextLineWidth(ctx, $(config.lineWidth ?? BaseDrawingUtils.DEFAULT_LINE_WIDTH));
    BaseDrawingUtils.setContextOpacity(ctx, config.opacity ?? BaseDrawingUtils.DEFAULT_OPACITY);
    const drawingFunction = config.isStroke ? ctx.strokeRect : ctx.fillRect;
    const y = config.isFixed
      ? CameraUtils.convertToDrawableY(config.y + config.height / 2)
      : CameraUtils.convertToDrawableViewportY(config.y + config.height / 2);
    drawingFunction.bind(ctx)($(config.x - config.width / 2), $(y), $(config.width), $(config.height));
  }

  public static drawCircle(ctx: CanvasRenderingContext2D, config: CircleDrawingConfig): void {
    BaseDrawingUtils.setContextColor(ctx, config.color);
    BaseDrawingUtils.setContextLineWidth(ctx, $(config.lineWidth ?? BaseDrawingUtils.DEFAULT_LINE_WIDTH));
    BaseDrawingUtils.setContextOpacity(ctx, config.opacity ?? BaseDrawingUtils.DEFAULT_OPACITY);
    ctx.beginPath();
    const y = config.isFixed ? CameraUtils.convertToDrawableY(config.y) : CameraUtils.convertToDrawableViewportY(config.y);
    ctx.arc($(config.x), $(y), $(config.radius), 0, FULL_CIRCLE_DEGREES);
    const drawingFunction = config.isStroke ? ctx.stroke : ctx.fill;
    drawingFunction.bind(ctx)();
  }

  public static drawLine(ctx: CanvasRenderingContext2D, config: LineDrawingConfig): void {
    BaseDrawingUtils.setContextColor(ctx, config.color);
    BaseDrawingUtils.setContextLineWidth(ctx, $(config.lineWidth ?? BaseDrawingUtils.DEFAULT_LINE_WIDTH));
    BaseDrawingUtils.setContextOpacity(ctx, config.opacity ?? BaseDrawingUtils.DEFAULT_OPACITY);
    BaseDrawingUtils.setLineCap(ctx, config.lineCap ?? BaseDrawingUtils.DEFAULT_LINE_CAP);
    ctx.beginPath();
    const y1 = config.isFixed ? CameraUtils.convertToDrawableY(config.y1) : CameraUtils.convertToDrawableViewportY(config.y1);
    ctx.moveTo($(config.x1), $(y1));
    const y2 = config.isFixed ? CameraUtils.convertToDrawableY(config.y2) : CameraUtils.convertToDrawableViewportY(config.y2);
    ctx.lineTo($(config.x2), $(y2));
    ctx.stroke();
  }

  public static drawImage(ctx: CanvasRenderingContext2D, config: ImageDrawingConfig): void {
    BaseDrawingUtils.setContextOpacity(ctx, BaseDrawingUtils.DEFAULT_OPACITY);
    const image = ImageUtils.getImage(config.imageSrc);
    if ('frameToDrawIdx' in config) {
      const frameHeight = image.height / config.frameNumber;
      ctx.drawImage(
        image,
        0,
        frameHeight * config.frameToDrawIdx,
        image.width,
        frameHeight,
        $(config.x - config.width / 2),
        $(CameraUtils.convertToDrawableViewportY(config.y + config.height / 2)),
        $(config.width),
        $(config.height)
      );
    } else {
      ctx.drawImage(
        image,
        $(config.x - config.width / 2),
        $(CameraUtils.convertToDrawableViewportY(config.y + config.height / 2)),
        $(config.width),
        $(config.height)
      );
    }
  }

  public static drawText(ctx: CanvasRenderingContext2D, config: TextDrawingConfig): void {
    if (!BaseDrawingUtils.drawingSettingsInitialized) {
      BaseDrawingUtils.initializeDrawingSettings(ctx);
    }
    BaseDrawingUtils.setContextColor(ctx, config.color);
    BaseDrawingUtils.setContextOpacity(ctx, config.opacity ?? BaseDrawingUtils.DEFAULT_OPACITY);
    ctx.font = `${$(config.fontSize)}px ${config.fontFace ?? BaseDrawingUtils.DEFAULT_FONT_FACE}`;
    const drawingFunction = config.isStroke ? ctx.strokeText : ctx.fillText;
    const y = config.isFixed ? CameraUtils.convertToDrawableY(config.y) : CameraUtils.convertToDrawableViewportY(config.y);
    drawingFunction.bind(ctx)(config.text, $(config.x), $(y));
  }

  public static drawOverlay(ctx: CanvasRenderingContext2D, config: OverlayDrawingConfig): void {
    const { width, height } = ctx.canvas;
    BaseDrawingUtils.setContextColor(ctx, config.color);
    BaseDrawingUtils.setContextOpacity(ctx, config.opacity ?? BaseDrawingUtils.DEFAULT_OPACITY);
    ctx.fillRect(0, 0, width, height);
  }

  public static setContextColor(ctx: CanvasRenderingContext2D, color: string): void {
    if (ctx.fillStyle !== color) {
      ctx.fillStyle = color;
    }
    if (ctx.strokeStyle !== color) {
      ctx.strokeStyle = color;
    }
  }

  public static setContextLineWidth(ctx: CanvasRenderingContext2D, lineWidth: number): void {
    if (ctx.lineWidth !== lineWidth) {
      ctx.lineWidth = lineWidth;
    }
  }

  public static setContextOpacity(ctx: CanvasRenderingContext2D, opacity: number): void {
    if (ctx.globalAlpha !== opacity) {
      ctx.globalAlpha = opacity;
    }
  }

  public static setLineCap(ctx: CanvasRenderingContext2D, lineCap: CanvasLineCap): void {
    if (ctx.lineCap !== lineCap) {
      ctx.lineCap = lineCap;
    }
  }

  private static initializeDrawingSettings(ctx: CanvasRenderingContext2D): void {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    BaseDrawingUtils.drawingSettingsInitialized = true;
  }
}
