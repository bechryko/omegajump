import { OnJump } from '@omegajump-core/entities/entity-hooks';
import { GravityUtils } from '@omegajump-core/physics';
import { Effect } from './models';

export class JumpBoostEffect extends Effect implements OnJump {
  private static readonly JUMP_HEIGHT_BOOST = 0.5;

  public onJump(): void {
    const hostJumpHeight = GravityUtils.getDistanceBasedOnVerticalVelocity(this.host.velocity.vertical);
    const newJumpHeight = hostJumpHeight * (1 + JumpBoostEffect.JUMP_HEIGHT_BOOST);
    this.host.velocity.vertical = GravityUtils.getVerticalVelocityBasedOnDistance(newJumpHeight);
  }
}
