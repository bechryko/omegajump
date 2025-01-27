import { OnPlayerMove, OnTick } from '../entity-hooks';
import { Player } from '../players';
import { PlatformAttribute } from './platform-attribute';

export class TrollAttribute extends PlatformAttribute implements OnTick, OnPlayerMove {
  private static readonly ACTIVATION_RANGE = 15;
  private static readonly SPEED_ADVANTAGE_MODIFIER = 1.4;

  private horizontalSpeed = 0;

  public override onTick(deltaTime: number): void {
    if (this.horizontalSpeed) {
      this.hostPlatform.position.x += this.horizontalSpeed * deltaTime;
    }

    this.horizontalSpeed = 0;

    super.onTick(deltaTime);
  }

  public onPlayerMove(player: Player): void {
    const isPlayerComingTowardsHost = Math.sign(player.distanceToVector(this.hostPlatform).x) === player.direction;
    if (
      player.position.y > this.hostPlatform.position.y &&
      player.isFalling() &&
      player.direction &&
      isPlayerComingTowardsHost &&
      player.distanceTo(this.hostPlatform) < TrollAttribute.ACTIVATION_RANGE
    ) {
      this.horizontalSpeed = player.getCurrentHorizontalSpeed() * player.direction * TrollAttribute.SPEED_ADVANTAGE_MODIFIER;
    }
  }
}
