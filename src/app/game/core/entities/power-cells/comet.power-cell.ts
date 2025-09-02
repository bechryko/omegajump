import { ControlObjects } from '../models';
import { Player } from '../players';
import { PowerCell } from './power-cell';

export class CometPowerCell extends PowerCell {
  public static readonly OUTLINE_COLOR = '#e1b633';
  public static readonly PRIMARY_COLOR = '#ffd55b';
  private static readonly COMET_EFFECT_DURATION = 5;
  private static readonly COMET_HORIZONTAL_ACCELERATION = 5;
  private static readonly BONUS_COMET_DURATION_PER_PCC = 1;
  private static readonly BONUS_COMET_HORIZONTAL_ACCELERATION_PER_PCC = 2;

  constructor(controlObjects: ControlObjects) {
    super(controlObjects, {
      outlineColor: CometPowerCell.OUTLINE_COLOR,
      primaryColor: CometPowerCell.PRIMARY_COLOR
    });
  }

  public override collect(player: Player): void {
    this.controlObjects.playerHandler.createCometForPlayer(
      player,
      CometPowerCell.COMET_EFFECT_DURATION + player.powerCellCombo.combo * CometPowerCell.BONUS_COMET_DURATION_PER_PCC,
      CometPowerCell.COMET_HORIZONTAL_ACCELERATION +
        player.powerCellCombo.combo * CometPowerCell.BONUS_COMET_HORIZONTAL_ACCELERATION_PER_PCC
    );
  }
}
