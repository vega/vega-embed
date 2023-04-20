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
  "testURL": "http://localhost/",
  "setupFiles": [
    "jest-canvas-mock"
  ],
  "testEnvironment": "jsdom"
};