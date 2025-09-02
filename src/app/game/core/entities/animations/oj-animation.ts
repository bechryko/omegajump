import { Drawable } from '@omegajump-core/drawing';
import { AnimationRepeat } from './enums';
import { AnimationCreationConfig } from './models';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class OjAnimation<ConfigT extends {} = any, LinkT extends {} = any> implements Drawable {
  protected readonly rawCurrentConfig: ConfigT;
  private _time = 0;
  private manuallyFinished = false;
  private direction = 1;
  public readonly zIndex: number;

  constructor(
    protected readonly startingConfig: ConfigT,
    protected readonly finalConfigChanges: Partial<Record<keyof ConfigT, number>>,
    protected readonly creationConfig: AnimationCreationConfig<ConfigT, LinkT>
  ) {
    this.rawCurrentConfig = { ...startingConfig };
    this.zIndex = creationConfig.zIndex;
  }

  public tick(deltaTime: number): void {
    this.time += deltaTime * this.direction;

    Object.keys(this.finalConfigChanges).forEach(k => {
      const key = k as keyof ConfigT;
      const startingValue = this.startingConfig[key] as number;
      const finalValue = this.finalConfigChanges[key]!;
      const difference = finalValue - startingValue;
      (this.rawCurrentConfig[key] as number) = startingValue + difference * (this.time / this.creationConfig.duration);
    });
  }

  public isFinished(): boolean {
    return (!this.creationConfig.repeat && this.time === this.creationConfig.duration) || this.manuallyFinished;
  }

  public finish(): void {
    this.manuallyFinished = true;
  }

  public abstract draw(ctx: CanvasRenderingContext2D): void;

  protected get currentConfig(): ConfigT {
    const config: ConfigT = { ...this.rawCurrentConfig };
    if (this.creationConfig.link) {
      const linkObject = this.creationConfig.link.getLinkObject(this);
      Object.keys(this.creationConfig.link.map).forEach(k => {
        const linkKey = k as keyof LinkT;
        const configKey = this.creationConfig.link!.map[linkKey] as keyof ConfigT;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        config[configKey] += linkObject[linkKey] as any;
      });
    }
    return config;
  }

  private set time(value: number) {
    const animationRepeat = this.creationConfig.repeat ?? AnimationRepeat.NONE;

    switch (animationRepeat) {
      case AnimationRepeat.NONE:
        this._time = Math.min(this.creationConfig.duration, value);
        return;
      case AnimationRepeat.REVERSE:
        if (value >= this.creationConfig.duration) {
          this.direction = -1;
          this._time = this.creationConfig.duration * 2 - value;
        } else if (value < 0) {
          this.direction = 1;
          this._time = -value;
        } else {
          this._time = value;
        }
    }
  }

  private get time(): number {
    return this._time;
  }
}
