import { PlatformConstructor } from '@omegajump-core/configuration';
import { PlayerJumpOnPlatformEvent } from '@omegajump-core/control';
import { callOnPlayerJump } from '@omegajump-core/entities/entity-hooks';
import { ControlObjects } from '@omegajump-core/entities/models';
import { BlackHolePlatform, CloakerPlatform, EnergyPlatform, TransformerPlatform } from '@omegajump-core/entities/platforms';
import { Observable, filter } from 'rxjs';
import { ChaosWildcard } from './models';

export class ChaoticEnergizingWildcard extends ChaosWildcard {
  private static readonly PLATFORM_EFFECTS_TO_TRIGGER: PlatformConstructor[] = [BlackHolePlatform, CloakerPlatform, TransformerPlatform];

  private readonly jumpsOnFullEnergyPlatform$: Observable<PlayerJumpOnPlatformEvent>;

  constructor(controlObjects: ControlObjects) {
    super(controlObjects);

    this.jumpsOnFullEnergyPlatform$ = this.controlObjects.globalEventController
      .watchEvents(PlayerJumpOnPlatformEvent)
      .pipe(filter(event => event.platform instanceof EnergyPlatform && event.platform.isDepletedThisTick()));

    const subscription = this.jumpsOnFullEnergyPlatform$.subscribe(event => {
      ChaoticEnergizingWildcard.PLATFORM_EFFECTS_TO_TRIGGER.forEach(platformConstructor => {
        const newPlatform = controlObjects.platformHandler.spawnPlatform(
          [
            {
              constructor: platformConstructor,
              spawningWeight: 1
            }
          ],
          [],
          {
            position: { ...event.platform.position }
          }
        );
        newPlatform.disabled = true;
        callOnPlayerJump(newPlatform, event.player);
      });
    });
    this.subscriptions.push(subscription);

    console.log('Chaotic energizing wildcard activated');
  }
}
