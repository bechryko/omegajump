export class MetricsUtils {
  public static readonly GAME_WIDTH_IN_OJ_UNITS = 100;
  public static readonly GAME_HEIGHT_IN_OJ_UNITS = 60;

  private static readonly OJ_UNIT_PX_RATIO = 20;

  public static setCanvasSize(canvas: HTMLCanvasElement): void {
    canvas.width = MetricsUtils.GAME_WIDTH_IN_OJ_UNITS * MetricsUtils.OJ_UNIT_PX_RATIO;
    canvas.height = MetricsUtils.GAME_HEIGHT_IN_OJ_UNITS * MetricsUtils.OJ_UNIT_PX_RATIO;
  }

  public static convertOjUnitToPx(ojUnit: number): number {
    return ojUnit * MetricsUtils.OJ_UNIT_PX_RATIO;
  }

  public static convertPxToOjUnit(px: number): number {
    return px / MetricsUtils.OJ_UNIT_PX_RATIO;
  }
}
