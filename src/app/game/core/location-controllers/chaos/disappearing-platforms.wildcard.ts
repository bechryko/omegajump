import { PlayerJumpOnPlatformEvent } from '@omegajump-core/control';
import { ControlObjects } from '@omegajump-core/entities/models';
import { Observable } from 'rxjs';
import { ChaosWildcard } from './models';

export class DisappearingPlatformsWildcard extends ChaosWildcard {
  private static readonly DISAPPEAR_RANGE = 5;

  private readonly jumpsOnPlatforms$: Observable<PlayerJumpOnPlatformEvent>;

  constructor(controlObjects: ControlObjects) {
    super(controlObjects);

    this.jumpsOnPlatforms$ = this.controlObjects.globalEventController.watchEvents(PlayerJumpOnPlatformEvent);

    const subscription = this.jumpsOnPlatforms$.subscribe(event => {
      this.controlObjects.platformHandler.getCurrentPlatforms().forEach(platform => {
        if (platform.distanceTo(event.platform) <= DisappearingPlatformsWildcard.DISAPPEAR_RANGE) {
          platform.destroy();
        }
      });
    });
    this.subscriptions.push(subscription);

    console.log('Disappearing platforms wildcard activated');
  }
}
