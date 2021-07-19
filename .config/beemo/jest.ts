import {JestConfig} from '@beemo/driver-jest';

const config: JestConfig = {
  testURL: 'http://localhost/',
  setupFiles: ['jest-canvas-mock'],
  testEnvironment: 'jsdom',
};

export default config;
