import { Platform } from '../platforms';
import { Player } from '../players';

export interface OnPlayerJump {
  onPlayerJump(player: Player): void;
}

export function callOnPlayerJump(entity: {}, player: Player): Platform | void {
  if ('onPlayerJump' in entity && typeof entity.onPlayerJump === 'function') {
    return entity.onPlayerJump(player);
  }
}
