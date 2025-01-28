import { WritableSignal } from '@angular/core';

/* eslint-disable @typescript-eslint/prefer-reduce-type-parameter */

export function deepValue<T>(source: Record<keyof T, WritableSignal<T[keyof T]>>): T {
  return Object.keys(source).reduce(
    (acc, key) => ({
      ...acc,
      [key]: source[key as keyof T]()
    }),
    {} as T
  );
}
