import { GameRandomUtils } from '@omegajump-core/control';
import { ControlObjects } from '@omegajump-core/entities/models';
import { ConfusionEffect, Player } from '@omegajump-core/entities/players';
import { ChaosWildcard } from './models';

export class TotalConfusionWildcard extends ChaosWildcard {
  private readonly MIN_CONFUSION_DURATION_S = 1;
  private readonly MAX_CONFUSION_DURATION_S = 3;
  private readonly MIN_TIME_BETWEEN_CONFUSIONS_S = 1;
  private readonly MAX_TIME_BETWEEN_CONFUSIONS_S = 3;

  private readonly effectTimers: Record<string, number> = {};

  constructor(controlObjects: ControlObjects) {
    super(controlObjects);

    this.controlObjects.playerHandler.forEachAlivePlayer(player => {
      this.effectTimers[player.color] = 0;
    });

    console.log('Total confusion wildcard activated');
  }

  public override tick(deltaTime: number): void {
    this.controlObjects.playerHandler.forEachAlivePlayer(player => {
      this.effectTimers[player.color] -= deltaTime;

      if (this.effectTimers[player.color] <= 0) {
        const confusionDuration = this.applyConfusion(player);
        const timeAfterConfusion = GameRandomUtils.between(this.MIN_TIME_BETWEEN_CONFUSIONS_S, this.MAX_TIME_BETWEEN_CONFUSIONS_S);
        this.effectTimers[player.color] = confusionDuration + timeAfterConfusion;
      }
    });
  }

  private applyConfusion(player: Player): number {
    const duration = GameRandomUtils.between(this.MIN_CONFUSION_DURATION_S, this.MAX_CONFUSION_DURATION_S);
    player.applyEffect(ConfusionEffect, duration);
    return duration;
  }
}
