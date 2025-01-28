import { GameRandomUtils } from '@omegajump-core/control';
import { BaseDrawingUtils } from '@omegajump-core/drawing';
import { ControlObjects } from '@omegajump-core/entities/models';
import { ZIndex } from '@omegajump-core/enums';
import { MetricsUtils } from '@omegajump-core/physics';
import { LocationController } from '../location-controller';
import { ChaoticEnergizingWildcard } from './chaotic-energizing.wildcard';
import { DisappearingPlatformsWildcard } from './disappearing-platforms.wildcard';
import { GravityShocksWildcard } from './gravity-shocks.wildcard';
import { HighlyExplosiveWildcard } from './highly-explosive.wildcard';
import { ChaosWildcard, ChaosWildcardConstructor, GlobalWildcardData } from './models';
import { TotalConfusionWildcard } from './total-confusion.wildcard';

export class ChaosLocationController extends LocationController {
  private static readonly WILDCARD_COOLDOWN = 30;
  private static readonly FIRST_WILDCARD_DELAY = 10;
  private static readonly WILDCARD_COUNTER_OFFSET_TOP = 7;
  private static readonly WILDCARD_COUNTER_FONT_SIZE = 4;
  private static readonly WILDCARD_COUNTER_COLOR = '#7f0000';
  private static readonly WILDCARDS: ChaosWildcardConstructor[] = [
    ChaoticEnergizingWildcard,
    TotalConfusionWildcard,
    DisappearingPlatformsWildcard,
    GravityShocksWildcard,
    HighlyExplosiveWildcard
  ];

  private wildcardCooldown = ChaosLocationController.FIRST_WILDCARD_DELAY;
  private activeWildcard?: ChaosWildcard;
  private readonly globalWildcardData: GlobalWildcardData = {};

  constructor(controlObjects: ControlObjects) {
    super(controlObjects, ZIndex.UI_CHAOS_WILDCARD_COOLDOWN);
  }

  public override tick(deltaTime: number): void {
    this.wildcardCooldown -= deltaTime;

    if (this.wildcardCooldown <= 0) {
      this.activeWildcard?.deactivate();
      this.wildcardCooldown = ChaosLocationController.WILDCARD_COOLDOWN;
      const wildcardConstructor = this.chooseWildcard();
      this.activeWildcard = new wildcardConstructor(this.controlObjects, this.globalWildcardData);
    }

    this.activeWildcard?.tick(deltaTime);
  }

  public override draw(ctx: CanvasRenderingContext2D): void {
    BaseDrawingUtils.drawText(ctx, {
      text: Math.ceil(this.wildcardCooldown).toString(),
      x: MetricsUtils.GAME_WIDTH_IN_OJ_UNITS / 2,
      y: MetricsUtils.GAME_HEIGHT_IN_OJ_UNITS - ChaosLocationController.WILDCARD_COUNTER_OFFSET_TOP,
      fontSize: ChaosLocationController.WILDCARD_COUNTER_FONT_SIZE,
      color: ChaosLocationController.WILDCARD_COUNTER_COLOR,
      isFixed: true
    });
  }

  private chooseWildcard(): ChaosWildcardConstructor {
    return GameRandomUtils.choose(ChaosLocationController.WILDCARDS.filter(wildcard => this.activeWildcard?.constructor !== wildcard));
  }
}
