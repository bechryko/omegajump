import { GameRandomUtils } from '@omegajump-core/control';
import { CircleAnimation } from '@omegajump-core/entities/animations';
import { ControlObjects, Position, TemporaryEntity } from '@omegajump-core/entities/models';
import { ZIndex } from '@omegajump-core/enums';
import { CameraUtils, GravityType, MetricsUtils } from '@omegajump-core/physics';
import { emptyFunction } from '@omegajump-utilities/technical';
import { ChaosWildcard } from './models';

export class GravityShocksWildcard extends ChaosWildcard {
  private static readonly MIN_GRAVITY_SHOCK_COOLDOWN = 3;
  private static readonly MAX_GRAVITY_SHOCK_COOLDOWN = 6;
  private static readonly GRAVITY_SHOCK_MIN_SCREEN_HEIGHT = 30;
  private static readonly GRAVITY_SHOCK_MAX_SCREEN_OVERFLOW = 10;
  private static readonly GRAVITY_SHOCK_SIDE_PADDING = 5;
  private static readonly GRAVITY_SHOCK_COLOR = '#5a758e';
  private static readonly GRAVITY_SHOCK_MAX_RADIUS = 13;
  private static readonly GRAVITY_SHOCK_CHARGE_TIME_S = 3;
  private static readonly GRAVITY_SHOCK_FINAL_OPACITY = 0.6;

  private nextGravityShock = 0;

  constructor(controlObjects: ControlObjects) {
    super(controlObjects);

    console.log('Gravity shock wildcard activated');
  }

  public override tick(deltaTime: number): void {
    this.nextGravityShock -= deltaTime;

    if (this.nextGravityShock <= 0) {
      this.spawnGravityShock();
      this.nextGravityShock = GameRandomUtils.between(
        GravityShocksWildcard.MIN_GRAVITY_SHOCK_COOLDOWN,
        GravityShocksWildcard.MAX_GRAVITY_SHOCK_COOLDOWN
      );
    }
  }

  private spawnGravityShock(): void {
    let time = 0;

    const temporaryEntity = new TemporaryEntity(
      {
        drawFn: emptyFunction,
        position: {
          x: GameRandomUtils.between(
            GravityShocksWildcard.GRAVITY_SHOCK_SIDE_PADDING,
            MetricsUtils.GAME_WIDTH_IN_OJ_UNITS - GravityShocksWildcard.GRAVITY_SHOCK_SIDE_PADDING
          ),
          y:
            CameraUtils.y +
            GravityShocksWildcard.GRAVITY_SHOCK_MIN_SCREEN_HEIGHT +
            GameRandomUtils.between(
              0,
              MetricsUtils.GAME_HEIGHT_IN_OJ_UNITS -
                GravityShocksWildcard.GRAVITY_SHOCK_MIN_SCREEN_HEIGHT +
                GravityShocksWildcard.GRAVITY_SHOCK_MAX_SCREEN_OVERFLOW
            )
        },
        onTickFn: (deltaTime, entity): void => {
          time += deltaTime;

          if (time >= GravityShocksWildcard.GRAVITY_SHOCK_CHARGE_TIME_S) {
            this.controlObjects.platformHandler.getCurrentPlatforms().forEach(platform => {
              if (platform.distanceTo(entity) < GravityShocksWildcard.GRAVITY_SHOCK_MAX_RADIUS) {
                platform.overrideGravity(GravityType.LOW);
              }
            });
            entity.destroy();
          }
        },
        zIndex: ZIndex.UNUSED,
        deletionYThreshold: -GravityShocksWildcard.GRAVITY_SHOCK_MAX_RADIUS,
        lockedInPlace: true
      },
      this.controlObjects.animator
    );
    this.controlObjects.temporaryEntityHandler.add(temporaryEntity).addAnimation(
      new CircleAnimation<Position>(
        {
          x: 0,
          y: 0,
          radius: 0,
          color: GravityShocksWildcard.GRAVITY_SHOCK_COLOR,
          opacity: 1
        },
        {
          radius: GravityShocksWildcard.GRAVITY_SHOCK_MAX_RADIUS,
          opacity: GravityShocksWildcard.GRAVITY_SHOCK_FINAL_OPACITY
        },
        GravityShocksWildcard.GRAVITY_SHOCK_CHARGE_TIME_S,
        ZIndex.CHAOS_WILDCARD_GRAVITY_SHOCK,
        {
          getLinkObject: (): Position => ({
            ...temporaryEntity.position
          }),
          map: {
            x: 'x',
            y: 'y'
          }
        }
      )
    );
  }
}
