export * from './typeorm';
export * from './types';
export const externalModules = new Set([
  '@nestjs/common',
  'typeorm',
  '@nestjs/typeorm',
  'class-validator',
]);
