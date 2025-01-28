//@index('./*', (f, _) => `export { ${_.pascalCase(f.name)} } from '${f.path}';`)
export { OnDestroy } from './on-destroy';
export { OnJump } from './on-jump';
export { OnPlayerJump } from './on-player-jump';
export { OnPlayerMove } from './on-player-move';
export { OnTick } from './on-tick';
//@endindex
//@index('./*', (f, _) => `export { call${_.pascalCase(f.name)} } from '${f.path}';`)
export { callOnDestroy } from './on-destroy';
export { callOnJump } from './on-jump';
export { callOnPlayerJump } from './on-player-jump';
export { callOnPlayerMove } from './on-player-move';
export { callOnTick } from './on-tick';
//@endindex
