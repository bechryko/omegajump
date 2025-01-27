import { BaseDrawingUtils, DrawingController } from '@omegajump-core/drawing';
import { RectangleCollisionBox } from '@omegajump-core/entities/colliders';
import { ControlObjects } from '@omegajump-core/entities/models';
import { Platform } from '@omegajump-core/entities/platforms';
import { CameraUtils, MetricsUtils } from '@omegajump-core/physics';

export class Debugger {
  constructor(
    private readonly controlObjects: ControlObjects,
    private readonly drawingController: DrawingController
  ) {
    globalThis.addEventListener('mousedown', event => {
      const x = MetricsUtils.convertPxToOjUnit(event.offsetX);
      const y = CameraUtils.fromDrawableViewportY(MetricsUtils.convertPxToOjUnit(event.clientY));
      const clickCollider: any = {
        collisionBoxes: [new RectangleCollisionBox(x, y, 1, 1, { x: 0, y: 0 })]
      };

      this.controlObjects.platformHandler.getCurrentPlatforms(false).forEach(platform => {
        if (platform.collider.collides(clickCollider)) {
          console.log(platform);
        }
      });

      this.drawingController.bindToCtx(BaseDrawingUtils.drawCircle, {
        x,
        y,
        radius: 0.25,
        color: 'red'
      });
    });
  }

  public highlightPlatforms(): void {
    this.controlObjects.platformHandler.getCurrentPlatforms().forEach(platform => {
      this.drawingController.bindToCtx(BaseDrawingUtils.drawRectangle, {
        x: platform.position.x,
        y: platform.position.y,
        width: Platform.WIDTH,
        height: Platform.HEIGHT,
        isStroke: true,
        color: 'red'
      });
    });
  }
}
