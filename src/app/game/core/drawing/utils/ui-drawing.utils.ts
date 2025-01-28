import { MetricsUtils } from '@omegajump-core/physics';
import { BaseDrawingUtils } from './base-drawing.utils';

export class UiDrawingUtils {
  private static readonly PAUSED_OVERLAY_COLOR = '#000000';
  private static readonly PAUSED_OVERLAY_OPACITY = 0.5;
  private static readonly PAUSED_ICON_SIZE = MetricsUtils.GAME_HEIGHT_IN_OJ_UNITS / 4;
  private static readonly PAUSED_ICON_COLOR = '#bbbbbb';

  public static drawPausedOverlay(ctx: CanvasRenderingContext2D): void {
    BaseDrawingUtils.drawOverlay(ctx, {
      color: UiDrawingUtils.PAUSED_OVERLAY_COLOR,
      opacity: UiDrawingUtils.PAUSED_OVERLAY_OPACITY
    });

    for (const direction of [-1, 1]) {
      BaseDrawingUtils.drawRectangle(ctx, {
        x: MetricsUtils.GAME_WIDTH_IN_OJ_UNITS / 2 + (UiDrawingUtils.PAUSED_ICON_SIZE / 3) * direction,
        y: MetricsUtils.GAME_HEIGHT_IN_OJ_UNITS / 2,
        width: UiDrawingUtils.PAUSED_ICON_SIZE / 3,
        height: UiDrawingUtils.PAUSED_ICON_SIZE,
        color: UiDrawingUtils.PAUSED_ICON_COLOR,
        isFixed: true
      });
    }
  }
}
