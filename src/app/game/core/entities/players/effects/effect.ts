import { OnTick } from '../../entity-hooks';
import { Player } from '../player';

export class Effect implements OnTick {
  constructor(
    protected readonly host: Player,
    protected duration: number
  ) {}

  public onTick(deltaTime: number): void {
    this.duration -= deltaTime;

    if (this.duration <= 0) {
      this.host.removeEffect(this);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public destroy(): void {}
}
