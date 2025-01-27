import { GameRandomUtils } from '@omegajump-core/control';
import { PlatformAttribute } from './platform-attribute';

export class MovingAttribute extends PlatformAttribute {
  private static readonly MIN_SPEED = 3;
  private static readonly MAX_SPEED = 8;

  private readonly direction = GameRandomUtils.choose([-1, 1]);
  private readonly speed = GameRandomUtils.between(MovingAttribute.MIN_SPEED, MovingAttribute.MAX_SPEED);

  public override onTick(deltaTime: number): void {
    this.hostPlatform.position.x += this.direction * this.speed * deltaTime;

    super.onTick(deltaTime);
  }
}
