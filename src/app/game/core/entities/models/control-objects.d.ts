import { Animator, GlobalEventController, PlatformHandler, PlayerHandler, TemporaryEntityHandler } from '@omegajump-core/control';

export interface ControlObjects {
  platformHandler: PlatformHandler;
  playerHandler: PlayerHandler;
  temporaryEntityHandler: TemporaryEntityHandler;
  animator: Animator;
  globalEventController: GlobalEventController;
}
