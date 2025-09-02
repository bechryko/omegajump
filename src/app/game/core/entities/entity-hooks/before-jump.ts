import { Platform } from '../platforms';

export interface BeforeJump {
  beforeJump(platform: Platform): void;
}

export function callBeforeJump(entity: {}, platform: Platform): void {
  if ('beforeJump' in entity && typeof entity.beforeJump === 'function') {
    entity.beforeJump(platform);
  }
}
