import { Drawable } from '@omegajump-core/drawing';
import { AnimationLink } from './models';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class OjAnimation<ConfigT extends {} = any, LinkT extends {} = any> implements Drawable {
  protected readonly rawCurrentConfig: ConfigT;
  private _time = 0;
  private manuallyFinished = false;

  constructor(
    protected readonly startingConfig: ConfigT,
    protected readonly finalConfigChanges: Partial<Record<keyof ConfigT, number>>,
    protected readonly duration: number,
    public readonly zIndex: number,
    private readonly link?: AnimationLink<ConfigT, LinkT>
  ) {
    this.rawCurrentConfig = { ...startingConfig };
  }

  public tick(deltaTime: number): void {
    this.time += deltaTime;

    Object.keys(this.finalConfigChanges).forEach(k => {
      const key = k as keyof ConfigT;
      const startingValue = this.startingConfig[key] as number;
      const finalValue = this.finalConfigChanges[key]!;
      const difference = finalValue - startingValue;
      (this.rawCurrentConfig[key] as number) = startingValue + difference * (this.time / this.duration);
    });
  }

  public isFinished(): boolean {
    return this.time === this.duration || this.manuallyFinished;
  }

  public finish(): void {
    this.manuallyFinished = true;
  }

  public abstract draw(ctx: CanvasRenderingContext2D): void;

  protected get currentConfig(): ConfigT {
    const config: ConfigT = { ...this.rawCurrentConfig };
    if (this.link) {
      const linkObject = this.link.getLinkObject(this);
      Object.keys(this.link.map).forEach(k => {
        const linkKey = k as keyof LinkT;
        const configKey = this.link!.map[linkKey] as keyof ConfigT;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        config[configKey] += linkObject[linkKey] as any;
      });
    }
    return config;
  }

  private set time(value: number) {
    this._time = Math.min(value, this.duration);
  }

  private get time(): number {
    return this._time;
  }
}
