import { AnimationRepeat } from '../enums';
import { AnimationLink } from './animation-link';

export interface AnimationCreationConfig<ConfigT extends {}, LinkT extends {}> {
  duration: number;
  zIndex: number;
  link?: AnimationLink<ConfigT, LinkT>;
  repeat?: AnimationRepeat;
}
