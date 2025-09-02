import { Player } from '../players';

export interface OnPlayerTouch {
  onPlayerTouch(player: Player): void;
}

export function callOnPlayerTouch(entity: {}, player: Player): void {
  if ('onPlayerTouch' in entity && typeof entity.onPlayerTouch === 'function') {
    entity.onPlayerTouch(player);
  }
}
