export interface OnTick {
  onTick(deltaTime: number): void;
}

export function callOnTick(entity: {}, deltaTime: number): void {
  if ('onTick' in entity && typeof entity.onTick === 'function') {
    entity.onTick(deltaTime);
  }
}
