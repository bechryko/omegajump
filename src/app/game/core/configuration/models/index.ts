//@index('./*', (f, _) => `export { ${_.pascalCase(f.name.split('.')[0])} } from '${f.path}';`)
export { GameConfigGeneralPart } from './game-config-general-part.d';
export { GameConfigLocationPart } from './game-config-location-part.d';
export { GameConfig } from './game-config.d';
export { PlatformAttributeConstructor } from './platform-attribute-constructor.d';
export { PlatformAttributeSpawningConfig } from './platform-attribute-spawning-config.d';
export { PlatformConstructor } from './platform-constructor.d';
export { PlatformSpawningConfig } from './platform-spawning-config.d';
export { PlayerConfig } from './player-config.d';
export { PlayerControlsConfig } from './player-controls-config.d';
//@endindex
