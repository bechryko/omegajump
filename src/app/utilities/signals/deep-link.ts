import { linkedSignal, Signal, WritableSignal } from '@angular/core';

/* eslint-disable @typescript-eslint/prefer-reduce-type-parameter */

export function deepLink<T extends {}>(source: Signal<T>): Record<keyof T, WritableSignal<T[keyof T]>> {
  return Object.keys(source()).reduce(
    (acc, key) => ({
      ...acc,
      [key]: linkedSignal(() => source()[key as keyof T])
    }),
    {} as Record<keyof T, WritableSignal<T[keyof T]>>
  );
}
