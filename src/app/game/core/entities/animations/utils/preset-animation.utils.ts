import { ZIndex } from '@omegajump-core/enums';
import { CircleAnimation } from '../circle-animation';
import { LineAnimation } from '../line-animation';
import { BeamAnimationConfig, BlinkLineAnimationConfig, ExplosionAnimationConfig } from '../models';

export class PresetAnimationUtils {
  public static createBeam(config: BeamAnimationConfig): LineAnimation {
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
      config.duration,
      config.zIndex
    );
  }

  public static createBlinkLine(config: BlinkLineAnimationConfig): LineAnimation {
    return PresetAnimationUtils.createBeam({
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

  private static readonly EXPLOSION_ANIMATION_SPEED = 100;
  private static readonly EXPLOSION_ANIMATION_COLOR = 'orange';
  private static readonly EXPLOSION_ANIMATION_OPACITY = 0.5;

  public static createExplosion(config: ExplosionAnimationConfig): CircleAnimation {
    return new CircleAnimation(
      {
        ...config.position,
        radius: 0,
        color: PresetAnimationUtils.EXPLOSION_ANIMATION_COLOR,
        opacity: PresetAnimationUtils.EXPLOSION_ANIMATION_OPACITY
      },
      {
        radius: config.radius
      },
      config.radius / PresetAnimationUtils.EXPLOSION_ANIMATION_SPEED,
      ZIndex.EXPLOSION
    );
  }
}
