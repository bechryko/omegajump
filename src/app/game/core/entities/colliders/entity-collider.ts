import { CircleCollisionBox } from './circle-collision-box';
import { CollisionBox } from './collision-box';
import { RectangleCollisionBox } from './rectangle-collision-box';

export class EntityCollider {
  constructor(private readonly collisionBoxes: CollisionBox[]) {}

  public collides(other: EntityCollider): boolean {
    return this.collisionBoxes.some(box => other.collisionBoxes.some(otherBox => this.boxCollides(box, otherBox)));
  }

  private boxCollides(box: CollisionBox, otherBox: CollisionBox): boolean {
    if (box instanceof CircleCollisionBox && otherBox instanceof CircleCollisionBox) {
      return this.circleWithCircleCollides(box, otherBox);
    }

    if (box instanceof RectangleCollisionBox && otherBox instanceof RectangleCollisionBox) {
      return this.rectangleWithRectangleCollides(box, otherBox);
    }

    if (box instanceof CircleCollisionBox && otherBox instanceof RectangleCollisionBox) {
      return this.circleWithRectangleCollides(box, otherBox);
    }

    if (box instanceof RectangleCollisionBox && otherBox instanceof CircleCollisionBox) {
      return this.circleWithRectangleCollides(otherBox, box);
    }

    throw new Error('Unknown collision box type');
  }

  private circleWithCircleCollides(circle: CircleCollisionBox, otherCircle: CircleCollisionBox): boolean {
    const dx = circle.x - otherCircle.x;
    const dy = circle.y - otherCircle.y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);

    return distance <= circle.radius + otherCircle.radius;
  }

  private rectangleWithRectangleCollides(rectangle: RectangleCollisionBox, otherRectangle: RectangleCollisionBox): boolean {
    return (
      rectangle.x < otherRectangle.x + otherRectangle.width / 2 &&
      rectangle.x + rectangle.width / 2 > otherRectangle.x &&
      rectangle.y < otherRectangle.y + otherRectangle.height / 2 &&
      rectangle.y + rectangle.height / 2 > otherRectangle.y
    );
  }

  private circleWithRectangleCollides(circle: CircleCollisionBox, rectangle: RectangleCollisionBox): boolean {
    return (
      circle.x + circle.radius > rectangle.x - rectangle.width / 2 &&
      circle.x - circle.radius < rectangle.x + rectangle.width / 2 &&
      circle.y + circle.radius > rectangle.y - rectangle.height / 2 &&
      circle.y - circle.radius < rectangle.y + rectangle.height / 2
    );
  }
}
