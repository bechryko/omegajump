import { PowerCellConstructor, PowerCellSpawningConfig } from '@omegajump-core/configuration';
import { ExplosionEvent, GameRandomUtils } from '@omegajump-core/control';
import { ControlObjects } from '../models';
import { Player } from '../players';
import { PowerCell } from './power-cell';

function getMimicablePowerCellConstructors(powerCellSpawningConfigs: PowerCellSpawningConfig[]): PowerCellConstructor[] {
  return powerCellSpawningConfigs
    .map(config => config.constructor)
    .filter(constructor => 'OUTLINE_COLOR' in constructor && 'PRIMARY_COLOR' in constructor);
}

export class DecoyPowerCell extends PowerCell {
  private static readonly EXPLOSION_RADIUS = 35;
  private static readonly EXPLOSION_POWER = 15;
  private static readonly BONUS_EXPLOSION_RADIUS_PER_PCC = 10;
  private static readonly BONUS_EXPLOSION_POWER_PER_PCC = 5;

  constructor(controlObjects: ControlObjects, powerCellSpawningConfigs: PowerCellSpawningConfig[]) {
    const mimicedConstructor = GameRandomUtils.choose(getMimicablePowerCellConstructors(powerCellSpawningConfigs));
    super(controlObjects, {
      outlineColor: mimicedConstructor.OUTLINE_COLOR!,
      primaryColor: mimicedConstructor.PRIMARY_COLOR!
    });
  }

  public override collect(player: Player): void {
    this.controlObjects.globalEventController.dispatchEvent(
      new ExplosionEvent(
        this.position,
        DecoyPowerCell.EXPLOSION_POWER + player.powerCellCombo.combo * DecoyPowerCell.BONUS_EXPLOSION_POWER_PER_PCC,
        DecoyPowerCell.EXPLOSION_RADIUS + player.powerCellCombo.combo * DecoyPowerCell.BONUS_EXPLOSION_RADIUS_PER_PCC
      )
    );
  }
}
