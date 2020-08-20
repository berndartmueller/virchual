const path = require('path');

module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json',
    },
  },
  moduleNameMapper: {},
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: [path.join(__dirname, '/test/**/*.spec.{js,ts}'), path.join(__dirname, '/src/**/*.spec.{js,ts}')],
  moduleFileExtensions: ['ts', 'js', 'json'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./test/setup.jest.ts'],
};
