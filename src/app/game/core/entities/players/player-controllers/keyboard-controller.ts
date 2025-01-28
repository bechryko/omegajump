import { ControlKeys } from './control-keys';
import { PlayerController } from './player-controller';

export class KeyboardController implements PlayerController {
  private _direction = 0;
  private isLeftPressed = false;
  private isRightPressed = false;

  private readonly onKeyDownRef = this.onKeyDown.bind(this);
  private readonly onKeyUpRef = this.onKeyUp.bind(this);

  constructor(private readonly controlKeyMap: Record<ControlKeys, string>) {}

  public register(): void {
    addEventListener('keydown', this.onKeyDownRef);
    addEventListener('keyup', this.onKeyUpRef);
  }

  public unregister(): void {
    removeEventListener('keydown', this.onKeyDownRef);
    removeEventListener('keyup', this.onKeyUpRef);
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.code === this.controlKeyMap.left) {
      this.isLeftPressed = true;
    } else if (event.code === this.controlKeyMap.right) {
      this.isRightPressed = true;
    }

    this.updateDirection();
  }

  private onKeyUp(event: KeyboardEvent): void {
    if (event.code === this.controlKeyMap.left) {
      this.isLeftPressed = false;
    } else if (event.code === this.controlKeyMap.right) {
      this.isRightPressed = false;
    }

    this.updateDirection();
  }

  private updateDirection(): void {
    this._direction = Number(this.isRightPressed) - Number(this.isLeftPressed);
  }

  public get direction(): number {
    return this._direction;
  }
}
