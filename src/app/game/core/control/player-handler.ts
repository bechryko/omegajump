import { GameConfig } from '@omegajump-core/configuration';
import { KeyboardController, Player } from '@omegajump-core/entities/players';
import { MetricsUtils } from '@omegajump-core/physics';
import { Animator } from './animator';

export class PlayerHandler {
  private readonly list: Player[] = [];

  constructor(
    gameConfig: GameConfig,
    private readonly animator: Animator
  ) {
    this.createPlayers(gameConfig);
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

  private createPlayers(gameConfig: GameConfig): void {
    const players = gameConfig.playerConfigs.map(
      config => new Player(this.animator, MetricsUtils.GAME_WIDTH_IN_OJ_UNITS / 2, config.color, new KeyboardController(config.controls))
    );
    this.list.push(...players);
  }
}
