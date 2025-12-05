module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.d.ts',
    '!src/**/*.test.js'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],
  verbose: true,
  testTimeout: 10000
};
