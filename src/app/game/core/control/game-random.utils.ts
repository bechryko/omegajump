import seedrandom from 'seedrandom';

export class GameRandomUtils {
  private static random?: seedrandom.PRNG;

  public static registerSeed(seed: string): void {
    GameRandomUtils.random = seedrandom(seed);
  }

  public static unregisterSeed(): void {
    GameRandomUtils.random = undefined;
  }

  public static nextNumber(max: number): number {
    if (GameRandomUtils.random === undefined) {
      throw new Error('Seed is not set');
    }

    return GameRandomUtils.random() * max;
  }

  public static between(min: number, max: number): number {
    return min + GameRandomUtils.nextNumber(max - min);
  }

  public static nextInt(max: number): number {
    return Math.floor(GameRandomUtils.nextNumber(max));
  }

  public static weightedElement<T extends {}>(elements: readonly T[], weightKey: keyof T): T {
    if (elements.length === 0) {
      throw new Error('No elements');
    }

    const totalWeight = elements.reduce((acc, el) => acc + (el[weightKey] as number), 0);
    let randomValue = GameRandomUtils.nextNumber(totalWeight);

    for (const element of elements) {
      const weight = element[weightKey] as number;
      if (randomValue < weight) {
        return element;
      }
      randomValue -= weight;
    }

    return elements[elements.length - 1];
  }

  public static choose<T>(array: T[]): T {
    if (array.length === 0) {
      throw new Error('No elements');
    }

    return array[GameRandomUtils.nextInt(array.length)];
  }

  public static chance(chance: number): boolean {
    return GameRandomUtils.nextNumber(1) < chance;
  }
}
