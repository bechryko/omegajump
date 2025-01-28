export interface OnDestroy {
  onDestroy(): void;
}

export function callOnDestroy(entity: {}): void {
  if ('onDestroy' in entity && typeof entity.onDestroy === 'function') {
    entity.onDestroy();
  }
}
