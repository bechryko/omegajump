import { GameConfigLocationPart } from '@omegajump-core/configuration';
import { LocationType } from './location-type';

export interface LocationDescription {
  translationCode: string;
  locationType: LocationType;
  config: GameConfigLocationPart;
  style: LocationStyle;
}

interface LocationStyle {
  backgroundColor: string;
  fontColor: string;
  textShadowColor: string;
}
