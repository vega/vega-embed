/** @type {import('jest').Config} */
const config = {
  testPathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/build', '<rootDir>/src'],
  coverageDirectory: './coverage/',
  collectCoverage: true,
  testEnvironment: './FixJSDOMEnvironment.ts',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  setupFiles: ['jest-canvas-mock'],
  globals: {
    'ts-jest': {
      diagnostics: false,
      useESM: true,
    },
  },
};

module.exports = config;
