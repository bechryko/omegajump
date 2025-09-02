import { ControlObjects } from '../models';
import { Player, ShieldEffect } from '../players';
import { PowerCell } from './power-cell';

export class ShieldingPowerCell extends PowerCell {
  public static readonly OUTLINE_COLOR = '#0082ca';
  public static readonly PRIMARY_COLOR = '#00b7a8';
  private static readonly SHIELD_EFFECT_DURATION = 10;
  private static readonly BONUS_SHIELD_DURATION_PER_PCC = 2;

  constructor(controlObjects: ControlObjects) {
    super(controlObjects, {
      outlineColor: ShieldingPowerCell.OUTLINE_COLOR,
      primaryColor: ShieldingPowerCell.PRIMARY_COLOR
    });
  }

  public override collect(player: Player): void {
    const duration =
      ShieldingPowerCell.SHIELD_EFFECT_DURATION + player.powerCellCombo.combo * ShieldingPowerCell.BONUS_SHIELD_DURATION_PER_PCC;
    player.applyEffect(ShieldEffect, { creationConfig: { duration } });
  }
}
