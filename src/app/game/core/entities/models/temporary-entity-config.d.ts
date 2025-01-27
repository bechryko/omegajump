import { GravityType } from '@omegajump-core/physics';
import { EntityCollider } from '../colliders';
import { Position } from './position';
import { TemporaryEntity } from './temporary-entity';

export interface TemporaryEntityConfig {
  drawFn: (ctx: CanvasRenderingContext2D, entity: TemporaryEntity) => void;
  position: Position;
  collider?: EntityCollider;
  zIndex: number;
  getGravityTypeFn?: (entity: TemporaryEntity) => GravityType;
  onTickFn?: (deltaTime: number, entity: TemporaryEntity) => void;
  deletionYThreshold: number;
  lockedInPlace?: boolean;
}
