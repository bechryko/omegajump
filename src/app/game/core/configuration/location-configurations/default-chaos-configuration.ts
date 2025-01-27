import { ActivatorAttribute, BoosterAttribute, MovingAttribute, TrollAttribute } from '@omegajump-core/entities/platform-attributes';
import {
  BlackHolePlatform,
  CloakerPlatform,
  EnergyPlatform,
  EnergyState,
  SolidPlatform,
  TransformerPlatform
} from '@omegajump-core/entities/platforms';
import { ChaosLocationController } from '@omegajump-core/location-controllers';
import { GameConfigLocationPart } from '../models';

export const defaultChaosConfiguration: GameConfigLocationPart = {
  locationController: ChaosLocationController,
  averagePlatformDensity: 1.2,
  platformDistanceFluctuation: 0.15,
  platformSpawning: [
    {
      constructor: SolidPlatform,
      spawningWeight: 12
    },
    {
      constructor: EnergyPlatform,
      additionalCreationConfig: {
        energyState: EnergyState.BLUE
      },
      spawningWeight: 2
    },
    {
      constructor: BlackHolePlatform,
      spawningWeight: 4
    },
    {
      constructor: CloakerPlatform,
      spawningWeight: 3
    },
    {
      constructor: TransformerPlatform,
      spawningWeight: 4
    }
  ],
  attributeSpawning: [
    {
      constructor: MovingAttribute,
      spawnChance: 0.075
    },
    {
      constructor: TrollAttribute,
      spawnChance: 0.02
    },
    {
      constructor: ActivatorAttribute,
      spawnChance: 0.03
    },
    {
      constructor: BoosterAttribute,
      spawnChance: 0.045
    }
  ]
};
