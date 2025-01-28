import { ExplosionEvent, PlayerJumpOnPlatformEvent } from '@omegajump-core/control';
import { ControlObjects } from '@omegajump-core/entities/models';
import { Observable } from 'rxjs';
import { ChaosWildcard, GlobalWildcardData } from './models';

export class HighlyExplosiveWildcard extends ChaosWildcard {
  private static readonly JUMPS_FOR_EXPLOSION = 10;
  private static readonly EXPLOSION_POWER = 20;
  private static readonly EXPLOSION_RADIUS = 20;

  private readonly jumpsOnPlatforms$: Observable<PlayerJumpOnPlatformEvent>;

  constructor(
    controlObjects: ControlObjects,
    private readonly globalData: GlobalWildcardData
  ) {
    super(controlObjects);

    if (!globalData.highlyExplosive) {
      globalData.highlyExplosive = {
        platformJumpCount: 0
      };
    }

    this.jumpsOnPlatforms$ = this.controlObjects.globalEventController.watchEvents(PlayerJumpOnPlatformEvent);

    const subscription = this.jumpsOnPlatforms$.subscribe(event => {
      this.globalData.highlyExplosive!.platformJumpCount++;

      if (this.globalData.highlyExplosive!.platformJumpCount >= HighlyExplosiveWildcard.JUMPS_FOR_EXPLOSION) {
        controlObjects.globalEventController.dispatchEvent(
          new ExplosionEvent(event.platform.position, HighlyExplosiveWildcard.EXPLOSION_POWER, HighlyExplosiveWildcard.EXPLOSION_RADIUS)
        );
        this.globalData.highlyExplosive!.platformJumpCount = 0;
      }
    });
    this.subscriptions.push(subscription);

    console.log('Highly explosive wildcard activated');
  }
}
