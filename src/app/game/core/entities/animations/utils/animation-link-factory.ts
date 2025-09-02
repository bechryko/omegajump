import { Position } from '@omegajump-core/entities/models';
import { AnimationLink, ObjectWithPosition } from '../models';

export class AnimationLinkFactory {
  public static createPositionLink<ConfigT extends Position>(object: ObjectWithPosition): AnimationLink<ConfigT, Position> {
    return {
      getLinkObject: () => ({ ...object.position }),
      map: {
        x: 'x',
        y: 'y'
      }
    };
  }
}
