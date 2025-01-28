import { ControlObjects } from '@omegajump-core/entities/models';
import { Subscription } from 'rxjs';

export abstract class ChaosWildcard {
  protected readonly subscriptions: Subscription[] = [];

  constructor(protected readonly controlObjects: ControlObjects) {}

  /* eslint-disable @typescript-eslint/no-unused-vars */
  /* eslint-disable @typescript-eslint/no-empty-function */
  public tick(deltaTime: number): void {}
  /* eslint-enable @typescript-eslint/no-empty-function */
  /* eslint-enable @typescript-eslint/no-unused-vars */

  public deactivate(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
