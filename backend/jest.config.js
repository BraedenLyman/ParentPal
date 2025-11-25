module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!jest.config.js'
  ],
  coverageThreshold: {
    global: {
      branches: 24,
      functions: 29,
      lines: 31,
      statements: 31
    }
  },
  setupFilesAfterEnv: [],
  testTimeout: 10000,
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: './test-reports',
      filename: 'backend-test-report.html',
      pageTitle: 'Backend Unit & Integration Tests Report',
      expand: true,
      openReport: false
    }]
  ],
  coverageReporters: ['html', 'text', 'lcov', 'json']
};