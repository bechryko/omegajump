import { ControlObjects } from '@omegajump-core/entities/models';
import { PowerCell } from '@omegajump-core/entities/power-cells';
import { PowerCellSpawningConfig } from './power-cell-spawning-config';

/* eslint-disable @typescript-eslint/naming-convention */

export interface PowerCellConstructor {
  OUTLINE_COLOR?: string;
  PRIMARY_COLOR?: string;
  new (controlObjects: ControlObjects, powerCellSpawningConfigs: PowerCellSpawningConfig[]): PowerCell;
}
