import { OjAnimation } from '../oj-animation';

export interface AnimationLink<ConfigT extends {}, LinkT extends {}> {
  getLinkObject: (animation: OjAnimation<ConfigT, LinkT>) => LinkT;
  map: Record<keyof LinkT, keyof ConfigT>;
}
