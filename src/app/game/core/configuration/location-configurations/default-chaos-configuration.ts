import { ActivatorAttribute, BoosterAttribute, MovingAttribute, TrollAttribute } from '@omegajump-core/entities/platform-attributes';
import {
  BlackHolePlatform,
  CloakerPlatform,
  EnergyPlatform,
  EnergyState,
  SolidPlatform,
  TransformerPlatform
} from '@omegajump-core/entities/platforms';
import {
  CometPowerCell,
  DecoyPowerCell,
  DoubleJumpPowerCell,
  GravitonCatalystPowerCell,
  MagnetPowerCell,
  ShieldingPowerCell,
  SpeedPowerCell
} from '@omegajump-core/entities/power-cells';
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
  ],
  powerCellSpawning: [
    {
      constructor: GravitonCatalystPowerCell,
      spawningWeight: 2
    },
    {
      constructor: DoubleJumpPowerCell,
      spawningWeight: 3
    },
    {
      constructor: MagnetPowerCell,
      spawningWeight: 2
    },
    {
      constructor: SpeedPowerCell,
      spawningWeight: 3
    },
    {
      constructor: ShieldingPowerCell,
      spawningWeight: 2
    },
    {
      constructor: CometPowerCell,
      spawningWeight: 1
    },
    {
      constructor: DecoyPowerCell,
      spawningWeight: 0.25
    }
  ]
};
