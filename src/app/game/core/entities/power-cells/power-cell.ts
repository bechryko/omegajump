import { BaseDrawingUtils } from '@omegajump-core/drawing';
import { ZIndex } from '@omegajump-core/enums';
import { GravityType } from '@omegajump-core/physics';
import { ColliderFactory } from '../colliders';
import { OnPlayerTouch } from '../entity-hooks';
import { ControlObjects, Entity, PowerCellCreationConfig } from '../models';
import { Comet, Player } from '../players';

export interface PowerCellDrawingConfig {
  outlineColor: string;
  primaryColor: string;
}

export abstract class PowerCell extends Entity implements OnPlayerTouch {
  public static readonly SIZE = 2;
  private static readonly INNER_SIZE = 1.5;
  private static readonly DELETION_Y_THRESHOLD = -PowerCell.SIZE / 2;
  public static readonly POWER_CELL_COMBO_DURATION = 3;

  constructor(
    controlObjects: ControlObjects,
    private readonly drawingConfig: PowerCellDrawingConfig
  ) {
    const position = { x: 0, y: 0 };
    super(controlObjects, position, ColliderFactory.createPowerCellCollider(position), ZIndex.POWER_CELL, PowerCell.DELETION_Y_THRESHOLD);
  }

  public create(config: PowerCellCreationConfig): void {
    this.position.x = config.position.x;
    this.position.y = config.position.y;

    this.disabled = false;
  }

  public onPlayerTouch(player: Player): void {
    if (!(player instanceof Comet)) {
      this.collect(player);
      player.powerCellCombo.combo++;
      player.powerCellCombo.expiration = PowerCell.POWER_CELL_COMBO_DURATION;
    }
    this.destroy();
  }

  public override draw(ctx: CanvasRenderingContext2D): void {
    BaseDrawingUtils.drawCircle(ctx, {
      ...this.position,
      radius: PowerCell.SIZE / 2,
      color: this.drawingConfig.outlineColor
    });
    BaseDrawingUtils.drawCircle(ctx, {
      ...this.position,
      radius: PowerCell.INNER_SIZE / 2,
      color: this.drawingConfig.primaryColor
    });
  }

  public abstract collect(player: Player): void;

  protected override getGravityType(): GravityType {
    return GravityType.FLOATING;
  }
}
