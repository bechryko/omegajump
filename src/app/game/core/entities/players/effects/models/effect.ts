import { ControlObjects } from '@omegajump-core/entities/models';
import { OnTick } from '../../../entity-hooks';
import { Player } from '../../player';
import { EffectCreationConfig } from './effect-creation-config';

export class Effect implements OnTick {
  protected duration: number;
  private readonly existenceLinkedEffect?: Effect;

  constructor(
    protected readonly host: Player,
    protected readonly controlObjects: ControlObjects,
    creationConfig: EffectCreationConfig
  ) {
    this.duration = creationConfig.duration;
    this.existenceLinkedEffect = creationConfig.existenceLinkedEffect;
  }

  public extendDuration(duration: number): void {
    this.duration += duration;
  }

  public extendDurationTo(duration: number): void {
    this.duration = Math.max(this.duration, duration);
  }

  public onTick(deltaTime: number): void {
    this.duration -= deltaTime;

    if (this.duration <= 0) {
      this.host.removeEffect(this);
    }
  }

  /* eslint-disable @typescript-eslint/no-empty-function */
  /* eslint-disable @typescript-eslint/no-unused-vars */
  public draw(ctx: CanvasRenderingContext2D): void {}
  /* eslint-enable @typescript-eslint/no-unused-vars */
  /* eslint-enable @typescript-eslint/no-empty-function */

  public destroy(): void {
    if (this.existenceLinkedEffect) {
      this.host.removeEffect(this.existenceLinkedEffect);
    }
  }

  public compareTo(effect: Effect): number {
    return this.duration - effect.duration;
  }
}
