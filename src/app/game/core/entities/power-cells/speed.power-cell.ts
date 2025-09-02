import { ControlObjects } from '../models';
import { EnergySpeedEffect, JumpBoostEffect, Player } from '../players';
import { PowerCell } from './power-cell';

export class SpeedPowerCell extends PowerCell {
  public static readonly OUTLINE_COLOR = '#c1f4fc';
  public static readonly PRIMARY_COLOR = '#00feff';
  private static readonly SPEED_EFFECT_DURATION = 5;
  private static readonly JUMP_BOOST_EFFECT_PCC_THRESHOLD = 3;
  private static readonly JUMP_BOOST_EFFECT_DURATION = 5;

  constructor(controlObjects: ControlObjects) {
    super(controlObjects, {
      outlineColor: SpeedPowerCell.OUTLINE_COLOR,
      primaryColor: SpeedPowerCell.PRIMARY_COLOR
    });
  }

  public override collect(player: Player): void {
    if (player.powerCellCombo.combo >= SpeedPowerCell.JUMP_BOOST_EFFECT_PCC_THRESHOLD) {
      const jumpBoostEffect = player.applyEffect(JumpBoostEffect, {
        creationConfig: { duration: SpeedPowerCell.JUMP_BOOST_EFFECT_DURATION },
        shouldAddToExisting: true
      });
      player.applyEffect(EnergySpeedEffect, {
        creationConfig: { duration: SpeedPowerCell.SPEED_EFFECT_DURATION, existenceLinkedEffect: jumpBoostEffect },
        shouldAddToExisting: true
      });
    } else {
      player.applyEffect(EnergySpeedEffect, {
        creationConfig: { duration: SpeedPowerCell.SPEED_EFFECT_DURATION },
        shouldAddToExisting: true
      });
    }
  }
}
