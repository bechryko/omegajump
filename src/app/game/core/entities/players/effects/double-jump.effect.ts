import { BeforeJump, callOnPlayerJump } from '@omegajump-core/entities/entity-hooks';
import { ControlObjects } from '@omegajump-core/entities/models';
import { Platform } from '@omegajump-core/entities/platforms';
import { Player } from '../player';
import { Effect, EffectCreationConfig } from './models';

export class DoubleJumpEffect extends Effect implements BeforeJump {
  private hostVelocitySignInPreviousTick?: number;
  private platformToCopy?: Platform;
  private bonusJumps = 0;
  private readonly maxBonusJumps: number;

  constructor(host: Player, controlObjects: ControlObjects, creationConfig: EffectCreationConfig) {
    super(host, controlObjects, creationConfig);

    this.maxBonusJumps = creationConfig.tripleJump ? 2 : 1;
  }

  public beforeJump(platform: Platform): void {
    this.platformToCopy = this.controlObjects.platformHandler.copyPlatform(platform);
    this.bonusJumps = 0;
  }

  public override onTick(deltaTime: number): void {
    const hostVelocitySignInCurrentTick = Math.sign(this.host.velocity.vertical);

    if (
      this.bonusJumps < this.maxBonusJumps &&
      hostVelocitySignInCurrentTick === -1 &&
      this.hostVelocitySignInPreviousTick === 1 &&
      this.platformToCopy
    ) {
      const copy = this.controlObjects.platformHandler.copyPlatform(this.platformToCopy);
      copy.position.x = this.host.position.x;
      copy.position.y = this.host.position.y - Player.SIZE / 2 - Platform.HEIGHT / 2;
      callOnPlayerJump(copy, this.host);
      this.bonusJumps++;
    }

    this.hostVelocitySignInPreviousTick = hostVelocitySignInCurrentTick;

    super.onTick(deltaTime);
  }
}
