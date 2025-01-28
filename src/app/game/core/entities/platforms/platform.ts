import { PlatformAttributeConstructor } from '@omegajump-core/configuration';
import { BaseDrawingUtils, ImageDrawingConfig } from '@omegajump-core/drawing';
import { GravityType, MetricsUtils } from '@omegajump-core/physics';
import { ZIndex } from '../../enums';
import { ColliderFactory } from '../colliders';
import { callOnDestroy, callOnPlayerJump, callOnPlayerMove, callOnTick, OnPlayerJump, OnPlayerMove } from '../entity-hooks';
import { ControlObjects, Entity, PlatformCreationConfig } from '../models';
import { GravitationalAttribute, InvisibleAttribute, PlatformAttribute } from '../platform-attributes';
import { Player } from '../players';

export abstract class Platform extends Entity implements OnPlayerJump, OnPlayerMove {
  public static readonly WIDTH = 4;
  public static readonly HEIGHT = Platform.WIDTH / 5;
  private static readonly DELETION_Y_THRESHOLD = -Player.SIZE;
  private static readonly DEFAULT_JUMP_HEIGHT = 10;

  protected attributes!: PlatformAttribute[];
  private customGravityType!: GravityType;

  constructor(
    protected readonly controlObjects: ControlObjects,
    private readonly imageSrc: string | (() => string),
    private readonly rawJumpHeight = Platform.DEFAULT_JUMP_HEIGHT
  ) {
    const position = { x: 0, y: 0 };
    super(
      controlObjects.animator,
      position,
      ColliderFactory.createPlatformCollider(position),
      ZIndex.PLATFORM,
      Platform.DELETION_Y_THRESHOLD
    );
  }

  public create(config: PlatformCreationConfig): void {
    this.position.x = config.position.x;
    this.position.y = config.position.y;
    this.velocity.horizontal = config.velocity?.horizontal ?? 0;
    this.velocity.vertical = config.velocity?.vertical ?? 0;
    this.customGravityType = config.customGravityType ?? GravityType.FLOATING;

    this.attributes = [];
    config.attributes?.forEach(attribute => {
      if (attribute instanceof PlatformAttribute) {
        attribute.bindNewHost(this);
        this.attributes.push(attribute);
      } else {
        this.addAttribute(attribute);
      }
    });

    this.disabled = false;
  }

  public extractCreationConfig(): PlatformCreationConfig {
    const config: PlatformCreationConfig = {
      position: { ...this.position },
      velocity: { ...this.velocity },
      attributes: [...this.attributes],
      customGravityType: this.customGravityType
    };
    this.attributes = [];
    return config;
  }

  public addAttribute(attributeConstructor: PlatformAttributeConstructor): void {
    if (!this.hasAttribute(attributeConstructor)) {
      const newAttribute = new attributeConstructor(this, this.controlObjects);
      this.attributes.push(newAttribute);
    }
  }

  public overrideGravity(gravityType: GravityType): void {
    this.customGravityType = gravityType;
  }

  public override onTick(deltaTime: number): void {
    super.onTick(deltaTime);

    this.attributes.forEach(attribute => callOnTick(attribute, deltaTime));

    if (this.position.x < -Platform.WIDTH / 2) {
      this.position.x += MetricsUtils.GAME_WIDTH_IN_OJ_UNITS + Platform.WIDTH;
    } else if (this.position.x > MetricsUtils.GAME_WIDTH_IN_OJ_UNITS + Platform.WIDTH / 2) {
      this.position.x -= MetricsUtils.GAME_WIDTH_IN_OJ_UNITS + Platform.WIDTH;
    }
  }

  public onPlayerJump(player: Player): Platform | void {
    player.jump(this.jumpHeight);

    this.attributes.forEach(attribute => callOnPlayerJump(attribute, player));
  }

  public onPlayerMove(player: Player): void {
    this.attributes.forEach(attribute => callOnPlayerMove(attribute, player));
  }

  public override onDestroy(): void {
    this.attributes.forEach(attribute => callOnDestroy(attribute));
    this.attributes = [];
  }

  public override draw(ctx: CanvasRenderingContext2D): void {
    if (this.hasAttribute(InvisibleAttribute)) {
      return;
    }

    const imageSrc = typeof this.imageSrc === 'function' ? this.imageSrc() : this.imageSrc;
    const drawConfig: ImageDrawingConfig = {
      ...this.position,
      imageSrc,
      width: Platform.WIDTH,
      height: Platform.HEIGHT
    };
    BaseDrawingUtils.drawImage(ctx, drawConfig);
  }

  public get jumpHeight(): number {
    return this.rawJumpHeight;
  }

  public hasAttribute(attributeConstructor: PlatformAttributeConstructor): boolean {
    return this.attributes.some(attribute => attribute instanceof attributeConstructor);
  }

  protected override getGravityType(): GravityType {
    return this.hasAttribute(GravitationalAttribute) ? GravityType.NORMAL : this.customGravityType;
  }
}
