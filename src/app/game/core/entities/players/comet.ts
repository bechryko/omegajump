import { BaseDrawingUtils } from '@omegajump-core/drawing';
import { MetricsUtils } from '@omegajump-core/physics';
import { ControlObjects } from '../models';
import { Player } from './player';

export class Comet extends Player {
  private static readonly COMET_SIZE = 2.25;
  private static readonly ACCELERATION_TIME_TO_REACH_MAX_SPEED = 2;
  private static readonly COMET_VERTICAL_SPEED = 12;

  private duration!: number;
  private horizontalAcceleration!: number;

  constructor(
    private readonly playerToReplace: Player,
    controlObjects: ControlObjects,
    duration: number,
    horizontalAcceleration: number
  ) {
    super(controlObjects, 0, ...playerToReplace.extractCopyConfig());

    this.init(duration, horizontalAcceleration);
  }

  public init(duration: number, horizontalAcceleration: number): void {
    this.position.x = this.playerToReplace.position.x;
    this.position.y = this.playerToReplace.position.y;
    this.velocity.vertical = Comet.COMET_VERTICAL_SPEED;
    this.velocity.horizontal = 0;
    this.playerToReplace.disabled = true;
    this.duration = duration;
    this.horizontalAcceleration = horizontalAcceleration;

    this.disabled = false;
  }

  public override onTick(deltaTime: number): void {
    this.duration -= deltaTime;
    if (this.duration <= 0) {
      this.destroy();
      return;
    }

    this.velocity.horizontal = Math.min(
      this.horizontalMaxSpeed,
      this.velocity.horizontal + this.controller.direction * this.horizontalAcceleration * deltaTime
    );

    this.position.x += this.velocity.horizontal * deltaTime;
    this.checkSideCollision();
    this.position.y += this.velocity.vertical * deltaTime;
  }

  public override onDestroy(): void {
    this.disabled = true;
    this.playerToReplace.position.x = this.position.x;
    this.playerToReplace.position.y = this.position.y;
    this.playerToReplace.velocity.vertical = this.velocity.vertical;
    this.playerToReplace.velocity.horizontal = this.velocity.horizontal;
    this.playerToReplace.disabled = false;
  }

  public isForPlayer(player: Player): boolean {
    return this.playerToReplace === player;
  }

  public override draw(ctx: CanvasRenderingContext2D): void {
    BaseDrawingUtils.drawRectangle(ctx, {
      x: this.position.x,
      y: this.position.y,
      width: Comet.COMET_SIZE,
      height: Comet.COMET_SIZE,
      color: `${this.color}A0`
    });
  }

  protected override checkSideCollision(): void {
    super.checkSideCollision(Comet.COMET_SIZE);

    if (this.position.x === Comet.COMET_SIZE / 2 || this.position.x === MetricsUtils.GAME_WIDTH_IN_OJ_UNITS - Comet.COMET_SIZE / 2) {
      this.velocity.horizontal = 0;
    }
  }

  private get horizontalMaxSpeed(): number {
    return this.horizontalAcceleration * Comet.ACCELERATION_TIME_TO_REACH_MAX_SPEED;
  }
}
