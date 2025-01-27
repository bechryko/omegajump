import { Player } from '../players';

export interface OnPlayerMove {
  onPlayerMove(player: Player): void;
}

export function callOnPlayerMove(entity: {}, player: Player): void {
  if ('onPlayerMove' in entity && typeof entity.onPlayerMove === 'function') {
    entity.onPlayerMove(player);
  }
}
