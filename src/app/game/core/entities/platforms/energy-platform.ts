import { ControlObjects, PlatformCreationConfig } from '../models';
import { Player } from '../players';
import { Platform } from './platform';

export enum EnergyState {
  BLUE,
  EMPTY
}

export class EnergyPlatform extends Platform {
  private static readonly BLUE_IMAGE_SRC = 'images/platforms/blue_energy.png';
  private static readonly EMPTY_IMAGE_SRC = 'images/platforms/empty_energy.png';

  private state!: EnergyState;
  private depletedThisTick = false;

  constructor(controlObjects: ControlObjects) {
    const imageSrcFactory = () => {
      switch (this.state) {
        case EnergyState.BLUE:
          return EnergyPlatform.BLUE_IMAGE_SRC;
        case EnergyState.EMPTY:
          return EnergyPlatform.EMPTY_IMAGE_SRC;
      }
    };
    super(controlObjects, imageSrcFactory);
  }

  public override create(config: PlatformCreationConfig): void {
    super.create(config);
    this.state = config.energyState ?? EnergyState.EMPTY;
  }

  public override extractCreationConfig(): PlatformCreationConfig {
    const config: PlatformCreationConfig = {
      ...super.extractCreationConfig(),
      energyState: this.state
    };
    this.state = EnergyState.EMPTY;
    return config;
  }

  public override onTick(deltaTime: number): void {
    this.depletedThisTick = false;
    super.onTick(deltaTime);
  }

  public override onPlayerJump(player: Player): void {
    if (this.state === EnergyState.BLUE) {
      player.collectEnergy();
      this.state = EnergyState.EMPTY;
      this.depletedThisTick = true;
    }

    super.onPlayerJump(player);
  }

  public isDepletedThisTick(): boolean {
    return this.depletedThisTick;
  }

  public refresh(): void {
    this.state = EnergyState.BLUE;
  }
}
