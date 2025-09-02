import { Effect } from './models';

export class EnergySpeedEffect extends Effect {
  public static readonly SPEED_BONUS = 0.75;
  private static readonly ENERGY_DRAIN_INTERVAL = 2;
  private static readonly ENERGY_DRAIN_AMOUNT = 1;

  private timeUntilEnergyDrain = 0;

  public override onTick(deltaTime: number): void {
    super.onTick(deltaTime);
    this.timeUntilEnergyDrain -= deltaTime;

    if (this.timeUntilEnergyDrain <= 0) {
      if (this.host.energy < EnergySpeedEffect.ENERGY_DRAIN_AMOUNT) {
        this.host.removeEffect(this);
        return;
      }

      this.host.energy -= EnergySpeedEffect.ENERGY_DRAIN_AMOUNT;
      this.timeUntilEnergyDrain += EnergySpeedEffect.ENERGY_DRAIN_INTERVAL;
    }
  }
}
