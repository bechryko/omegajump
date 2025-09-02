import { ControlObjects } from '../models';
import { GravitonEffect, Player } from '../players';
import { PowerCell } from './power-cell';

export class GravitonCatalystPowerCell extends PowerCell {
  public static readonly OUTLINE_COLOR = '#466784';
  public static readonly PRIMARY_COLOR = '#6d92b4';
  private static readonly GRAVITON_EFFECT_DURATION = 7.5;
  private static readonly GRAVITON_SHOCK_PCC_THRESHOLD = 3;

  constructor(controlObjects: ControlObjects) {
    super(controlObjects, {
      outlineColor: GravitonCatalystPowerCell.OUTLINE_COLOR,
      primaryColor: GravitonCatalystPowerCell.PRIMARY_COLOR
    });
  }

  public override collect(player: Player): void {
    player.applyEffect(GravitonEffect, {
      creationConfig: {
        duration: GravitonCatalystPowerCell.GRAVITON_EFFECT_DURATION,
        gravitonShocks: player.powerCellCombo.combo >= GravitonCatalystPowerCell.GRAVITON_SHOCK_PCC_THRESHOLD
      },
      shouldAddToExisting: true
    });
  }
}
