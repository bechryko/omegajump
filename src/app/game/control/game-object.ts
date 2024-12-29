import { DrawingController } from '../drawing';
import { GameConfig } from './game-config';

export class GameObject {
  constructor(
    private readonly drawingController: DrawingController,
    private readonly config: GameConfig
  ) {
    this.tick();
  }

  private tick(): void {
    const currentTime = Date.now();
    requestAnimationFrame(time => {
      const deltaTime = time - currentTime;
      if (this.main(deltaTime)) {
        this.tick();
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private main(deltaTime: number): boolean {
    return false;
  }
}
