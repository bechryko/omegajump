import { Position } from '../../models';

interface ObjectWithPosition {
  position: Position;
}

export interface BeamAnimationConfig {
  object1: ObjectWithPosition;
  object2: ObjectWithPosition;
  color: string;
  startingWidth: number;
  finalWidth?: number;
  startingOpacity: number;
  finalOpacity?: number;
  duration: number;
  zIndex: number;
}

export interface BlinkLineAnimationConfig {
  object1: ObjectWithPosition;
  object2: ObjectWithPosition;
  color: string;
  width: number;
  duration: number;
}

export interface ExplosionAnimationConfig {
  position: Position;
  radius: number;
}
