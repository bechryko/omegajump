import { PowerCellSpawningConfig } from '@omegajump-core/configuration';
import { ControlObjects, Position, PowerCellCreationConfig } from '@omegajump-core/entities/models';
import { PowerCell } from '@omegajump-core/entities/power-cells';
import { MetricsUtils } from '@omegajump-core/physics';
import { GameRandomUtils } from './game-random.utils';

export class PowerCellHandler {
  public static readonly POWER_CELL_GROUP_MIN_VERTICAL_DISTANCE = MetricsUtils.GAME_HEIGHT_IN_OJ_UNITS / 4;
  public static readonly POWER_CELL_GROUP_MAX_VERTICAL_DISTANCE = MetricsUtils.GAME_HEIGHT_IN_OJ_UNITS;
  public static readonly POWER_CELL_GROUP_MAX_RADIUS = 30;
  private static readonly MIN_POWER_CELLS_PER_GROUP = 1;
  private static readonly MAX_POWER_CELLS_PER_GROUP = 5;
  private static readonly MAX_POWER_CELL_FLUCTUATION = 0.15;

  private readonly possiblePowerCellPerGroupSpan = PowerCellHandler.MAX_POWER_CELLS_PER_GROUP - PowerCellHandler.MIN_POWER_CELLS_PER_GROUP;
  private readonly possiblePowerCellGroupVerticalDistanceSpan =
    PowerCellHandler.POWER_CELL_GROUP_MAX_VERTICAL_DISTANCE - PowerCellHandler.POWER_CELL_GROUP_MIN_VERTICAL_DISTANCE;

  private readonly powerCellPoolMap: Record<string, PowerCell[]> = {};
  private latestPowerCellGroupY = MetricsUtils.GAME_HEIGHT_IN_OJ_UNITS - this.possiblePowerCellGroupVerticalDistanceSpan / 2;

  constructor(private readonly controlObjects: ControlObjects) {}

  public spawnPowerCellGroup(spawningConfigs: PowerCellSpawningConfig[], groupPosition: Position): void {
    const distanceSinceLastGroup = groupPosition.y - this.latestPowerCellGroupY;
    const powerCellsInGroupMean =
      (distanceSinceLastGroup / this.possiblePowerCellGroupVerticalDistanceSpan) * this.possiblePowerCellPerGroupSpan +
      PowerCellHandler.MIN_POWER_CELLS_PER_GROUP;
    const powerCellsInGroup = Math.round(
      powerCellsInGroupMean +
        GameRandomUtils.between(-PowerCellHandler.MAX_POWER_CELL_FLUCTUATION, PowerCellHandler.MAX_POWER_CELL_FLUCTUATION)
    );

    for (let i = 0; i < powerCellsInGroup; i++) {
      const position = GameRandomUtils.randomPointInCircle(groupPosition.x, groupPosition.y, PowerCellHandler.POWER_CELL_GROUP_MAX_RADIUS);
      if (position.x < -PowerCell.SIZE / 2) {
        position.x += MetricsUtils.GAME_WIDTH_IN_OJ_UNITS;
      } else if (position.x > MetricsUtils.GAME_WIDTH_IN_OJ_UNITS + PowerCell.SIZE / 2) {
        position.x -= MetricsUtils.GAME_WIDTH_IN_OJ_UNITS;
      }

      this.spawnPowerCell(spawningConfigs, { position });
    }

    this.latestPowerCellGroupY = groupPosition.y;
  }

  public getCurrentPowerCells(excludeDisabled = true): PowerCell[] {
    let powerCells = Object.values(this.powerCellPoolMap).flat();
    if (excludeDisabled) {
      powerCells = powerCells.filter(powerCell => !powerCell.disabled);
    }
    return powerCells;
  }

  private spawnPowerCell(spawningConfigs: PowerCellSpawningConfig[], creationConfig: PowerCellCreationConfig): void {
    const spawningPowerCellConfig = GameRandomUtils.weightedElement(spawningConfigs, 'spawningWeight');

    const pool = this.powerCellPoolMap[spawningPowerCellConfig.constructor.name] ?? [];
    if (pool.length === 0) {
      this.powerCellPoolMap[spawningPowerCellConfig.constructor.name] = pool;
    }
    const availablePoolItemIndex = pool.findIndex(powerCell => powerCell.disabled);
    if (availablePoolItemIndex === -1) {
      const newPowerCell = new spawningPowerCellConfig.constructor(this.controlObjects, spawningConfigs);
      newPowerCell.create(creationConfig);
      pool.push(newPowerCell);
      return;
    }
    pool[availablePoolItemIndex].create(creationConfig);
  }
}
