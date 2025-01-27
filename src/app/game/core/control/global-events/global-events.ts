import { Position } from '@omegajump-core/entities/models';
import { Platform } from '@omegajump-core/entities/platforms';
import { Player } from '@omegajump-core/entities/players';

export type GlobalEvent = PlayerJumpOnPlatformEvent | ExplosionEvent;

export class PlayerJumpOnPlatformEvent {
  constructor(
    public readonly player: Player,
    public readonly platform: Platform
  ) {}
}

export class ExplosionEvent {
  private static readonly DEFAULT_CENTER_RADIUS = 2.5;

  constructor(
    public readonly position: Position,
    public readonly power: number,
    public readonly radius: number,
    public readonly centerRadius = ExplosionEvent.DEFAULT_CENTER_RADIUS
  ) {}
}
