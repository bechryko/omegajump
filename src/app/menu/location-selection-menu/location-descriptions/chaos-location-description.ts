import { defaultChaosConfiguration } from '@omegajump-core/configuration';
import { LocationDescription, LocationType } from './models';

export const chaosLocationDescription: LocationDescription = {
  translationCode: 'CHAOS',
  locationType: LocationType.ZONE,
  config: defaultChaosConfiguration,
  style: {
    backgroundColor: '#001b48',
    fontColor: '#a3c6ff',
    textShadowColor: '#001e50'
  }
};
