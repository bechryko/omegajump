import { EventEmitter } from '@angular/core';
import { GameConfig } from '@omegajump-core/configuration';
import { DrawingController, UiDrawingUtils } from '@omegajump-core/drawing';
import { PresetAnimationFactory } from '@omegajump-core/entities/animations';
import {
  callBeforeJump,
  callOnDestroy,
  callOnPlayerJump,
  callOnPlayerMove,
  callOnPlayerTouch,
  callOnTick
} from '@omegajump-core/entities/entity-hooks';
import { ControlObjects, Entity, Position } from '@omegajump-core/entities/models';
import { Platform } from '@omegajump-core/entities/platforms';
import { MagneticEffect, Player, ShieldEffect } from '@omegajump-core/entities/players';
import { PowerCell } from '@omegajump-core/entities/power-cells';
import { LocationController } from '@omegajump-core/location-controllers';
import { CameraUtils, MetricsUtils } from '@omegajump-core/physics';
import { Animator } from './animator';
import { Debugger } from './debugger';
import { GameRandomUtils } from './game-random.utils';
import { ExplosionEvent, GlobalEventController, PlayerJumpOnPlatformEvent } from './global-events';
import { PlatformHandler } from './platform-handler';
import { PlayerHandler } from './player-handler';
import { PowerCellHandler } from './power-cell-handler';
import { TemporaryEntityHandler } from './temporary-entity-handler';

export class GameObject {
  private static readonly MIN_NEIGHBORING_PLATFORM_HORIZONTAL_DISTANCE = MetricsUtils.GAME_WIDTH_IN_OJ_UNITS * 0.35;
  private static readonly SIDE_PLATFORM_RAREFACTION_PADDING = MetricsUtils.GAME_WIDTH_IN_OJ_UNITS / 5;
  private static readonly VIRTUAL_TICK_DELTA_TIME_MS = 1;
  private static readonly PAUSE_GAME_KEY_CODE = 'Space';
  private static readonly AUTO_PAUSE_DELTA_TIME_THRESHOLD = 0.5;
  private static readonly RESTART_GAME_KEY_CODE = 'Space';
  private static readonly RESTART_GAME_WITH_SAME_SEED_KEY_CODE = 'Enter';

  private readonly controlObjects: ControlObjects;
  private readonly powerCellHandler: PowerCellHandler;
  private readonly locationController: LocationController;
  private readonly debugger: Debugger;

  public readonly restart = new EventEmitter<boolean>();

  private highestPlatformPos: Position = { x: -MetricsUtils.GAME_WIDTH_IN_OJ_UNITS, y: 0 };
  private nextPowerCellGroupPos: Position = { x: MetricsUtils.GAME_WIDTH_IN_OJ_UNITS / 2, y: MetricsUtils.GAME_HEIGHT_IN_OJ_UNITS };
  private paused = false;
  private pausedOverlayDrawn = false;

  constructor(
    private readonly drawingController: DrawingController,
    private readonly config: GameConfig
  ) {
    GameRandomUtils.registerSeed(this.config.seed);
    CameraUtils.resetCameraPosition();
    this.controlObjects = this.createControlObjects();
    this.powerCellHandler = new PowerCellHandler(this.controlObjects);
    this.locationController = new this.config.locationController(this.controlObjects);
    this.debugger = new Debugger(this.controlObjects, drawingController, () => this.allowDebugging());

    MetricsUtils.setCanvasSize(this.drawingController.canvas);
    this.controlObjects.playerHandler.createPlayers(this.config);

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
          if (player.isFalling() && entity.collider.collides(player.collider) && player.position.y - Player.SIZE / 2 > entity.position.y) {
            const isEntityPlatform = entity instanceof Platform;
            if (isEntityPlatform) {
              callBeforeJump(player, entity);
            }
            const newPlatform = callOnPlayerJump(entity, player);
            if (isEntityPlatform) {
              this.controlObjects.globalEventController.dispatchEvent(new PlayerJumpOnPlatformEvent(player, newPlatform ?? entity));
            }
          }
        });
      });

      this.currentEntities.forEach(entity => {
        this.controlObjects.playerHandler.forEachAlivePlayer(player => {
          if (entity.collider.collides(player.collider)) {
            callOnPlayerTouch(entity, player);

            if (entity instanceof Platform && player.hasEffect(MagneticEffect) && player.isFalling()) {
              callOnPlayerJump(entity, player);
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

    // entity spawning phase
    this.spawnPlatforms();
    if (!this.config.disablePowerCells) {
      this.spawnPowerCells();
    }

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

  private spawnPowerCells(): void {
    while (
      this.nextPowerCellGroupPos.y <
      CameraUtils.y + MetricsUtils.GAME_HEIGHT_IN_OJ_UNITS + PowerCellHandler.POWER_CELL_GROUP_MAX_RADIUS
    ) {
      this.powerCellHandler.spawnPowerCellGroup(this.config.powerCellSpawning, this.nextPowerCellGroupPos);

      this.nextPowerCellGroupPos = {
        y:
          this.nextPowerCellGroupPos.y +
          GameRandomUtils.between(
            PowerCellHandler.POWER_CELL_GROUP_MIN_VERTICAL_DISTANCE,
            PowerCellHandler.POWER_CELL_GROUP_MAX_VERTICAL_DISTANCE
          ),
        x: GameRandomUtils.between(0, MetricsUtils.GAME_WIDTH_IN_OJ_UNITS)
      };
    }
  }

  private listenToEvents(): void {
    this.controlObjects.globalEventController.watchEvents(ExplosionEvent).subscribe(event => {
      this.currentEntities
        .map(entity => [entity, entity.distanceTo(event)] as const)
        .filter(([, distance]) => distance <= event.radius)
        .forEach(([entity, distance]) => {
          if (entity instanceof PowerCell) {
            entity.destroy();
            return;
          }
          if (entity instanceof Player) {
            const shieldEffect = entity.getAppliedEffect(ShieldEffect);
            if (shieldEffect) {
              entity.removeEffect(shieldEffect);
              return;
            }
          }

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
        PresetAnimationFactory.createExplosion({
          position: event.position,
          radius: event.radius
        })
      );
    });

    const onKeyDown = (event: KeyboardEvent): void => {
      if (!this.isGameOver()) {
        if (event.code === GameObject.PAUSE_GAME_KEY_CODE) {
          this.togglePause();
        }
        return;
      }

      if (event.code === GameObject.RESTART_GAME_KEY_CODE || event.code === GameObject.RESTART_GAME_WITH_SAME_SEED_KEY_CODE) {
        this.restart.emit(event.code === GameObject.RESTART_GAME_WITH_SAME_SEED_KEY_CODE);
        document.removeEventListener('keydown', onKeyDown);
      }
    };

    document.addEventListener('keydown', onKeyDown);
  }

  private isGameOver(): boolean {
    return !this.controlObjects.playerHandler.isPlayerAlive();
  }

  private onGameEnd(): void {
    this.drawingController.bindToCtx(UiDrawingUtils.drawGameOverOverlay);

    this.currentEntities.forEach(entity => callOnDestroy(entity));

    GameRandomUtils.unregisterSeed();
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

  private allowDebugging(): boolean {
    return !this.isGameOver();
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
      ...this.powerCellHandler.getCurrentPowerCells(),
      ...this.controlObjects.temporaryEntityHandler.entities
    ];
  }

  private createControlObjects(): ControlObjects {
    const unstableControlObjects: Partial<ControlObjects> = {};
    const animator = new Animator();
    unstableControlObjects.animator = animator;
    const temporaryEntityHandler = new TemporaryEntityHandler();
    unstableControlObjects.temporaryEntityHandler = temporaryEntityHandler;
    const globalEventController = new GlobalEventController();
    unstableControlObjects.globalEventController = globalEventController;
    const playerHandler = new PlayerHandler(unstableControlObjects as ControlObjects);
    unstableControlObjects.playerHandler = playerHandler;
    const platformHandler = new PlatformHandler(unstableControlObjects as ControlObjects);
    unstableControlObjects.platformHandler = platformHandler;
    return unstableControlObjects as ControlObjects;
  }
}
