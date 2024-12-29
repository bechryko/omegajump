//@index('./*', (f, _) => `export { ${_.camelCase(f.name)} } from '${f.path}';`)
export { appReducer } from './app.reducer';
export { settingsReducer } from './settings.reducer';
//@endindex
