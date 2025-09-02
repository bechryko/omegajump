import { ControlObjects } from '../models';
import { MagneticEffect, Player } from '../players';
import { PowerCell } from './power-cell';

export class MagnetPowerCell extends PowerCell {
  public static readonly OUTLINE_COLOR = '#c80f0a';
  public static readonly PRIMARY_COLOR = '#ff9696';
  private static readonly GRAVITON_EFFECT_DURATION = 3;
  private static readonly BONUS_GRAVITON_DURATION_PER_PCC = 0.75;

  constructor(controlObjects: ControlObjects) {
    super(controlObjects, {
      outlineColor: MagnetPowerCell.OUTLINE_COLOR,
      primaryColor: MagnetPowerCell.PRIMARY_COLOR
    });
  }

  public override collect(player: Player): void {
    const duration =
      MagnetPowerCell.GRAVITON_EFFECT_DURATION + player.powerCellCombo.combo * MagnetPowerCell.BONUS_GRAVITON_DURATION_PER_PCC;
    player.applyEffect(MagneticEffect, { creationConfig: { duration }, shouldAddToExisting: true });
  }
}
