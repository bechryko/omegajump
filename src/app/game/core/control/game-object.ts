import { GameConfig } from '@omegajump-core/configuration';
import { DrawingController, UiDrawingUtils } from '@omegajump-core/drawing';
import { PresetAnimationUtils } from '@omegajump-core/entities/animations';
import { callOnDestroy, callOnPlayerJump, callOnPlayerMove, callOnTick } from '@omegajump-core/entities/entity-hooks';
import { ControlObjects, Entity, Position } from '@omegajump-core/entities/models';
import { Platform } from '@omegajump-core/entities/platforms';
import { Player } from '@omegajump-core/entities/players';
import { LocationController } from '@omegajump-core/location-controllers';
import { CameraUtils, MetricsUtils } from '@omegajump-core/physics';
import { Animator } from './animator';
import { Debugger } from './debugger';
import { GameRandomUtils } from './game-random.utils';
import { ExplosionEvent, GlobalEventController, PlayerJumpOnPlatformEvent } from './global-events';
import { PlatformHandler } from './platform-handler';
import { PlayerHandler } from './player-handler';
import { TemporaryEntityHandler } from './temporary-entity-handler';

export class GameObject {
  private static readonly MIN_NEIGHBORING_PLATFORM_HORIZONTAL_DISTANCE = MetricsUtils.GAME_WIDTH_IN_OJ_UNITS * 0.35;
  private static readonly SIDE_PLATFORM_RAREFACTION_PADDING = MetricsUtils.GAME_WIDTH_IN_OJ_UNITS / 5;
  private static readonly VIRTUAL_TICK_DELTA_TIME_MS = 1;
  private static readonly PAUSE_GAME_KEY_CODE = 'Space';
  private static readonly AUTO_PAUSE_DELTA_TIME_THRESHOLD = 0.5;

  private readonly controlObjects: ControlObjects;
  private readonly locationController: LocationController;
  private readonly debugger: Debugger;

  private highestPlatformPos: Position = { x: -MetricsUtils.GAME_WIDTH_IN_OJ_UNITS, y: 0 };
  private paused = false;
  private pausedOverlayDrawn = false;

  constructor(
    private readonly drawingController: DrawingController,
    private readonly config: GameConfig
  ) {
    GameRandomUtils.registerSeed(this.config.seed ?? String(Math.random()));
    CameraUtils.resetCameraPosition();
    this.controlObjects = this.createControlObjects();
    this.locationController = new this.config.locationController(this.controlObjects);
    this.debugger = new Debugger(this.controlObjects, drawingController);

    MetricsUtils.setCanvasSize(this.drawingController.canvas);

    this.listenToEvents();
    this.tick(Date.now());
  }

  private tick(previousTime: number): void {
    const currentTime = Date.now();
    requestAnimationFrame(() => {
      const deltaTime = currentTime - previousTime;
      if (this.main(deltaTime / 1000)) {
        this.tick(currentTime);
      } else {
        this.onGameEnd();
      }
    });
  }

  private main(deltaTime: number): boolean {
    if (!this.paused && deltaTime > GameObject.AUTO_PAUSE_DELTA_TIME_THRESHOLD) {
      this.togglePause();
    }

    if (this.paused) {
      if (!this.pausedOverlayDrawn) {
        this.drawingController.bindToCtx(UiDrawingUtils.drawPausedOverlay);
        this.pausedOverlayDrawn = true;
      }
      return true;
    }

    this.virtualTick(deltaTime, virtualDeltaTime => {
      // ticking phase
      this.currentEntities.forEach(entity => callOnTick(entity, virtualDeltaTime));
      this.locationController.tick(virtualDeltaTime);
      this.controlObjects.animator.tick(virtualDeltaTime);

      // player-caused entity hooks phase
      this.controlObjects.playerHandler.forEachAlivePlayer(player => {
        if (player.direction) {
          this.currentEntities.forEach(entity => {
            if (entity !== player) {
              callOnPlayerMove(entity, player);
            }
          });
        }
      });

      this.currentEntities.forEach(entity => {
        this.controlObjects.playerHandler.forEachAlivePlayer(player => {
          if (
            entity !== player &&
            player.isFalling() &&
            entity.collider.collides(player.collider) &&
            player.position.y - Player.SIZE / 2 > entity.position.y
          ) {
            const newPlatform = callOnPlayerJump(entity, player);
            if (entity instanceof Platform) {
              this.controlObjects.globalEventController.dispatchEvent(new PlayerJumpOnPlatformEvent(player, newPlatform ?? entity));
            }
          }
        });
      });
    });

    // drawing phase
    this.currentEntities.forEach(entity => {
      this.drawingController.registerDrawable(entity);
    });
    this.drawingController.registerDrawable(this.locationController);
    this.controlObjects.animator.registerAnimationsForDrawing(this.drawingController);
    this.drawingController.draw();
    // this.debugger.highlightPlatforms();

    // cleanup phase
    this.deleteEntities();
    this.controlObjects.temporaryEntityHandler.deleteDisabledEntities();
    CameraUtils.moveCameraAccordingToPlayerHeights(this.controlObjects.playerHandler.currentPlayers);

    // platform spawning phase
    this.spawnPlatforms();

    return !this.isGameOver();
  }

  private spawnPlatforms(): void {
    while (this.highestPlatformPos.y < CameraUtils.y + MetricsUtils.GAME_HEIGHT_IN_OJ_UNITS) {
      const xCoord = this.getPlatformXCoord();
      const newPosition: Position = {
        x:
          xCoord < GameObject.SIDE_PLATFORM_RAREFACTION_PADDING ||
          xCoord > MetricsUtils.GAME_WIDTH_IN_OJ_UNITS - GameObject.SIDE_PLATFORM_RAREFACTION_PADDING
            ? this.getPlatformXCoord()
            : xCoord,
        y:
          this.highestPlatformPos.y +
          GameRandomUtils.between(
            this.config.averagePlatformDensity - this.config.platformDistanceFluctuation,
            this.config.averagePlatformDensity + this.config.platformDistanceFluctuation
          )
      };

      this.controlObjects.platformHandler.spawnPlatform(this.config.platformSpawning, this.config.attributeSpawning, {
        position: newPosition
      });

      this.highestPlatformPos = { ...newPosition };
    }
  }

  private getPlatformXCoord(): number {
    const availableSpaceOnLeft = Math.max(
      0,
      this.highestPlatformPos.x - GameObject.MIN_NEIGHBORING_PLATFORM_HORIZONTAL_DISTANCE - Platform.WIDTH / 2
    );
    const availableSpaceOnRight = Math.max(
      0,
      MetricsUtils.GAME_WIDTH_IN_OJ_UNITS -
        this.highestPlatformPos.x -
        GameObject.MIN_NEIGHBORING_PLATFORM_HORIZONTAL_DISTANCE -
        Platform.WIDTH / 2
    );
    const availableX = GameRandomUtils.between(Platform.WIDTH / 2, availableSpaceOnLeft + availableSpaceOnRight);
    const x = availableX < availableSpaceOnLeft ? availableX : GameObject.MIN_NEIGHBORING_PLATFORM_HORIZONTAL_DISTANCE * 2 + availableX;
    return x;
  }

  private listenToEvents(): void {
    this.controlObjects.globalEventController.watchEvents(ExplosionEvent).subscribe(event => {
      this.currentEntities
        .map(entity => [entity, entity.distanceTo(event)] as const)
        .filter(([, distance]) => distance <= event.radius)
        .forEach(([entity, distance]) => {
          const appliedPower =
            distance < event.centerRadius
              ? event.power
              : event.power * Math.sqrt(1 - (distance - event.centerRadius) / (event.radius - event.centerRadius));
          const distanceVector = entity.distanceToVector(event);
          const appliedHorizontalPower = appliedPower * (-distanceVector.x / distance);
          const appliedVerticalPower = appliedPower * (-distanceVector.y / distance);
          entity.velocity.horizontal += appliedHorizontalPower;
          entity.velocity.vertical += appliedVerticalPower;
        });
      this.controlObjects.animator.addAnimation(
        PresetAnimationUtils.createExplosion({
          position: event.position,
          radius: event.radius
        })
      );
    });

    document.addEventListener('keydown', event => {
      if (event.code === GameObject.PAUSE_GAME_KEY_CODE) {
        this.togglePause();
      }
    });
  }

  private isGameOver(): boolean {
    return !this.controlObjects.playerHandler.isPlayerAlive();
  }

  private onGameEnd(): void {
    this.currentEntities.forEach(entity => callOnDestroy(entity));

    GameRandomUtils.unregisterSeed();

    console.log('game over');
  }

  private deleteEntities(): void {
    this.currentEntities.forEach(entity => {
      if (entity.position.y < CameraUtils.y + entity.deletionYThreshold) {
        entity.destroy();
      }
    });
  }

  private togglePause(): void {
    this.paused = !this.paused;
    if (this.paused) {
      this.pausedOverlayDrawn = false;
    }
  }

  private virtualTick(deltaTime: number, callback: (deltaTime: number) => void): void {
    const virtualTickDeltaTime = GameObject.VIRTUAL_TICK_DELTA_TIME_MS / 1000;
    const virtualTickNumber = Math.floor(deltaTime / virtualTickDeltaTime);

    for (let i = 0; i < virtualTickNumber; i++) {
      callback(virtualTickDeltaTime);
    }
  }

  private get currentEntities(): Entity[] {
    return [
      ...this.controlObjects.platformHandler.getCurrentPlatforms(),
      ...this.controlObjects.playerHandler.currentPlayers,
      ...this.controlObjects.temporaryEntityHandler.entities
    ];
  }

  private createControlObjects(): ControlObjects {
    const animator = new Animator();
    const temporaryEntityHandler = new TemporaryEntityHandler();
    const globalEventController = new GlobalEventController();
    const playerHandler = new PlayerHandler(this.config, animator);
    const controlObjectsWithoutPlatformHandler = {
      playerHandler,
      temporaryEntityHandler,
      animator,
      globalEventController
    };
    const platformHandler = new PlatformHandler(controlObjectsWithoutPlatformHandler);
    const controlObjects = {
      ...controlObjectsWithoutPlatformHandler,
      platformHandler
    };
    return controlObjects;
  }
}
