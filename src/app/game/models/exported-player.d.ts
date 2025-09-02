import { WritableSignal } from '@angular/core';

export interface ExportedPlayer {
  color: WritableSignal<string>;
  energy: WritableSignal<number>;
  powerCellCombo: WritableSignal<number>;
  powerCellComboExpiration: WritableSignal<number>;
}
