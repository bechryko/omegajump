//@index('./*', (f, _) => `export { ${_.pascalCase(f.name.split('.')[0])} } from '${f.path}';`)
export { ConfusionEffect } from './confusion-effect';
export { Effect } from './effect';
export { EffectConstructor } from './effect-constructor.d';
//@endindex
