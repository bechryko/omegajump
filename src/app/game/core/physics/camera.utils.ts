import { Signal, signal } from '@angular/core';
import { Player } from '@omegajump-core/entities/players';
import { MetricsUtils } from './metrics.utils';

export class CameraUtils {
  public static readonly MAINTAINABLE_TOP_PADDING = 15;

  private static bottomY = signal(0);

  public static resetCameraPosition(): void {
    CameraUtils.moveCameraTo(0);
  }

  public static moveCameraAccordingToPlayerHeights(players: Player[]): void {
    const highestPlayerY = players.reduce((highestY, player) => Math.max(highestY, player.position.y), 0);
    const minCameraY = highestPlayerY + CameraUtils.MAINTAINABLE_TOP_PADDING - MetricsUtils.GAME_HEIGHT_IN_OJ_UNITS;
    if (minCameraY > CameraUtils.y) {
      CameraUtils.moveCameraTo(minCameraY);
    }
  }

  public static convertToDrawableY(y: number): number {
    return MetricsUtils.GAME_HEIGHT_IN_OJ_UNITS - y;
  }

  public static convertToDrawableViewportY(y: number): number {
    return CameraUtils.convertToDrawableY(y) + CameraUtils.bottomY();
  }

  public static fromDrawableViewportY(y: number): number {
    return MetricsUtils.GAME_HEIGHT_IN_OJ_UNITS - y + CameraUtils.bottomY();
  }

  public static get ySignal(): Signal<number> {
    return CameraUtils.bottomY.asReadonly();
  }

  public static get y(): number {
    return CameraUtils.bottomY();
  }

  private static moveCameraTo(y: number): void {
    CameraUtils.bottomY.set(y);
  }
}
