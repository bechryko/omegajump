//@index('./*', (f, _) => `export { ${_.pascalCase(f.name.split('.')[0])} } from '${f.path}';`)
export { ControlKeys } from './control-keys';
export { KeyboardController } from './keyboard-controller';
export { PlayerController } from './player-controller.d';
//@endindex
