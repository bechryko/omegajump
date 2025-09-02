import { ZIndex } from '@omegajump-core/enums';
import { CircleAnimation } from '../circle-animation';
import { LineAnimation } from '../line-animation';
import { BeamAnimationConfig, BlinkLineAnimationConfig, ExplosionAnimationConfig } from '../models';
import { OjAnimation } from '../oj-animation';

export class PresetAnimationFactory {
  public static createBeam(config: BeamAnimationConfig): OjAnimation {
    return new LineAnimation(
      {
        x1: config.object1.position.x,
        y1: config.object1.position.y,
        x2: config.object2.position.x,
        y2: config.object2.position.y,
        color: config.color,
        lineWidth: config.startingWidth,
        opacity: config.startingOpacity
      },
      {
        lineWidth: config.finalWidth ?? config.startingWidth,
        opacity: config.finalOpacity ?? config.startingOpacity
      },
      {
        duration: config.duration,
        zIndex: config.zIndex
      }
    );
  }

  public static createBlinkLine(config: BlinkLineAnimationConfig): OjAnimation {
    return PresetAnimationFactory.createBeam({
      object1: config.object1,
      object2: config.object2,
      color: config.color,
      startingWidth: config.width,
      finalWidth: config.width,
      startingOpacity: 1,
      duration: config.duration,
      zIndex: ZIndex.BLINK_LINE
    });
  }

  private static readonly EXPLOSION_ANIMATION_SPEED = 150;
  private static readonly EXPLOSION_ANIMATION_COLOR = 'orange';
  private static readonly EXPLOSION_ANIMATION_OPACITY = 0.5;

  public static createExplosion(config: ExplosionAnimationConfig): OjAnimation {
    return new CircleAnimation(
      {
        ...config.position,
        radius: 0,
        color: config.color ?? PresetAnimationFactory.EXPLOSION_ANIMATION_COLOR,
        opacity: config.opacity ?? PresetAnimationFactory.EXPLOSION_ANIMATION_OPACITY
      },
      {
        radius: config.radius
      },
      {
        duration: config.radius / (config.animationSpeed ?? PresetAnimationFactory.EXPLOSION_ANIMATION_SPEED),
        zIndex: ZIndex.EXPLOSION
      }
    );
  }
}
