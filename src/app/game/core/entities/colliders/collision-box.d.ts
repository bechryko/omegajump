import { CircleCollisionBox } from './circle-collision-box';
import { RectangleCollisionBox } from './rectangle-collision-box';

export type CollisionBox = RectangleCollisionBox | CircleCollisionBox;
