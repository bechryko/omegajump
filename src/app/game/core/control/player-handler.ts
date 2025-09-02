import { GameConfig } from '@omegajump-core/configuration';
import { ControlObjects } from '@omegajump-core/entities/models';
import { Comet, KeyboardController, Player } from '@omegajump-core/entities/players';
import { MetricsUtils } from '@omegajump-core/physics';

export class PlayerHandler {
  private readonly list: Player[] = [];

  constructor(private readonly controlObjects: ControlObjects) {
    // Do not use the controlObjects property in the constructor due to it can be incomplete.
  }

  public forEachAlivePlayer(callback: (player: Player) => void): void {
    this.currentPlayers.forEach(callback);
  }

  public isPlayerAlive(): boolean {
    return this.currentPlayers.length > 0;
  }

  public get currentPlayers(): Player[] {
    return this.list.filter(player => !player.disabled);
  }

  public createCometForPlayer(player: Player, duration: number, horizontalAcceleration: number): void {
    const existingComet = this.list.filter(p => p instanceof Comet).find(comet => comet.isForPlayer(player));
    if (existingComet) {
      existingComet.init(duration, horizontalAcceleration);
    } else {
      this.list.push(new Comet(player, this.controlObjects, duration, horizontalAcceleration));
    }
  }

  public createPlayers(gameConfig: GameConfig): void {
    const players = gameConfig.playerConfigs.map(
      config =>
        new Player(this.controlObjects, MetricsUtils.GAME_WIDTH_IN_OJ_UNITS / 2, config.color, new KeyboardController(config.controls))
    );
    this.list.push(...players);
  }
}
