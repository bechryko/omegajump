import { GravityType } from './enums';

export class GravityUtils {
  public static readonly PASSIVE_GRAVITY = 20;

  public static getVerticalVelocityBasedOnDistance(distance: number, gravityType = GravityType.NORMAL): number {
    return Math.sqrt(2 * gravityType * distance);
  }
}
