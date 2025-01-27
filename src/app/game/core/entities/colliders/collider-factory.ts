import { Position } from '../models';
import { Platform } from '../platforms';
import { CircleCollisionBox } from './circle-collision-box';
import { EntityCollider } from './entity-collider';
import { RectangleCollisionBox } from './rectangle-collision-box';

export class ColliderFactory {
  public static createPlatformCollider(platformPosition: Position): EntityCollider {
    return new EntityCollider([
      new RectangleCollisionBox(0, 0, Platform.WIDTH - Platform.HEIGHT, Platform.HEIGHT, platformPosition),
      new CircleCollisionBox(-Platform.WIDTH / 2 + Platform.HEIGHT / 2, 0, Platform.HEIGHT / 2, platformPosition),
      new CircleCollisionBox(Platform.WIDTH / 2 - Platform.HEIGHT / 2, 0, Platform.HEIGHT / 2, platformPosition)
    ]);
  }
}
