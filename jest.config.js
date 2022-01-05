'use strict';

module.exports = {
  roots: ['test'],
  verbose: false,
  testEnvironment: 'node',
  // testEnvironment: 'jsdom',
  testRegex: 'test/(.*/)*.*test.js$',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*'],
  transform: {
    '^.+\\.ts$': 'babel-jest',
    '^.+\\.js$': 'babel-jest'
  },
  // transformIgnorePatterns: ['/node_modules/'],
  transformIgnorePatterns: []
};
