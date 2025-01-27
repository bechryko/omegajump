import { Platform } from '../platforms';

export interface OnJump {
  onJump(platform: Platform): void;
}

export function callOnJump(entity: {}, platform: Platform): void {
  if ('onJump' in entity && typeof entity.onJump === 'function') {
    entity.onJump(platform);
  }
}
