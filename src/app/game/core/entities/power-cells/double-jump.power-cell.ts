import { ControlObjects } from '../models';
import { DoubleJumpEffect, Player } from '../players';
import { PowerCell } from './power-cell';

export class DoubleJumpPowerCell extends PowerCell {
  public static readonly OUTLINE_COLOR = '#5e32ca';
  public static readonly PRIMARY_COLOR = '#940a59';
  private static readonly DOUBLE_JUMP_EFFECT_DURATION = 5;
  private static readonly THIRD_JUMP_PCC_THRESHOLD = 4;

  constructor(controlObjects: ControlObjects) {
    super(controlObjects, {
      outlineColor: DoubleJumpPowerCell.OUTLINE_COLOR,
      primaryColor: DoubleJumpPowerCell.PRIMARY_COLOR
    });
  }

  public override collect(player: Player): void {
    player.applyEffect(DoubleJumpEffect, {
      creationConfig: {
        duration: DoubleJumpPowerCell.DOUBLE_JUMP_EFFECT_DURATION,
        tripleJump: player.powerCellCombo.combo >= DoubleJumpPowerCell.THIRD_JUMP_PCC_THRESHOLD
      },
      unique: true
    });
  }
}
