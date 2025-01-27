import { Position } from '../models';

export class CircleCollisionBox {
  constructor(
    private readonly baseX: number,
    private readonly baseY: number,
    public readonly radius: number,
    private readonly linkedPosition: Position
  ) {}

  public get x(): number {
    return this.baseX + this.linkedPosition.x;
  }

  public get y(): number {
    return this.baseY + this.linkedPosition.y;
  }
}
