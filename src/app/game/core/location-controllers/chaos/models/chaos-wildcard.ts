import { ControlObjects } from '@omegajump-core/entities/models';
import { Subscription } from 'rxjs';

export abstract class ChaosWildcard {
  protected readonly subscriptions: Subscription[] = [];

  constructor(protected readonly controlObjects: ControlObjects) {}

  public tick(deltaTime: number): void {}

  public deactivate(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
