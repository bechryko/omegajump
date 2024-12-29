/* eslint-disable no-magic-numbers */

export function ms(amount: number): number {
  return amount;
}

export function sec(amount: number): number {
  return amount * ms(1000);
}

export function min(amount: number): number {
  return amount * sec(60);
}

export function hour(amount: number): number {
  return amount * min(60);
}

export function day(amount: number): number {
  return amount * hour(24);
}

export function week(amount: number): number {
  return amount * day(7);
}
