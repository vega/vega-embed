module.exports = {
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json"
  ],
  "testPathIgnorePatterns": [
    "<rootDir>/dist/",
    "<rootDir>/node_modules/",
    "<rootDir>/build/"
  ],
  "coverageDirectory": "./coverage/",
  "collectCoverage": true,
  "setupFiles": [
    "jest-canvas-mock"
  ],
  "testEnvironment": "jsdom",
  "testEnvironmentOptions": {
    "url": "http://localhost/"
  }
};
