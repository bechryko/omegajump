//@index('./*', (f, _) => `export { ${_.pascalCase(f.name.split('.')[0])} } from '${f.path}';`)
export { ControlObjects } from './control-objects.d';
export { Entity } from './entity';
export { ObjectWithAnimations } from './object-with-animations';
export { PlatformCreationConfig } from './platform-creation-config.d';
export { Position } from './position.d';
export { TemporaryEntity } from './temporary-entity';
export { TemporaryEntityConfig } from './temporary-entity-config.d';
export { Vector } from './vector.d';
export { Velocity } from './velocity.d';
//@endindex
