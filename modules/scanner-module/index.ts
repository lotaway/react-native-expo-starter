// Reexport the native module. On web, it will be resolved to ScannerModule.web.ts
// and on native platforms to ScannerModule.ts
export { default } from './src/ScannerModule';
export { default as ScannerModuleView } from './src/ScannerModuleView';
export * from  './src/ScannerModule.types';
