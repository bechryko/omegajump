import { TemporaryEntity } from '@omegajump-core/entities/models';

export class TemporaryEntityHandler {
  private readonly list: TemporaryEntity[] = [];

  public add(entity: TemporaryEntity): TemporaryEntity {
    this.list.push(entity);
    return entity;
  }

  public deleteDisabledEntities(): void {
    this.list.forEach(entity => {
      if (entity.disabled) {
        this.list.splice(this.list.indexOf(entity), 1);
      }
    });
  }

  public get entities(): TemporaryEntity[] {
    return [...this.list];
  }
}
