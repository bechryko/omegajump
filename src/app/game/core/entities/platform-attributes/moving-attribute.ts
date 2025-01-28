import { GameRandomUtils } from '@omegajump-core/control';
import { CameraUtils } from '@omegajump-core/physics';
import { PlatformAttribute } from './platform-attribute';

export class MovingAttribute extends PlatformAttribute {
  private static readonly MIN_SPEED = 3;
  private static readonly BONUS_MIN_SPEED_PER_1000_POINTS = 2;
  private static readonly MAX_SPEED = 8;
  private static readonly BONUS_MAX_SPEED_PER_1000_POINTS = 3;

  private readonly direction = GameRandomUtils.choose([-1, 1]);
  private readonly speed = GameRandomUtils.between(
    MovingAttribute.MIN_SPEED + (CameraUtils.y / 1000) * MovingAttribute.BONUS_MIN_SPEED_PER_1000_POINTS,
    MovingAttribute.MAX_SPEED + (CameraUtils.y / 1000) * MovingAttribute.BONUS_MAX_SPEED_PER_1000_POINTS
  );

  public override onTick(deltaTime: number): void {
    this.hostPlatform.position.x += this.direction * this.speed * deltaTime;

    super.onTick(deltaTime);
  }
}
