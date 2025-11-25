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
    ['jest-html-reporter', {
      pageTitle: 'Backend Unit & Integration Tests Report',
      outputPath: './test-reports/backend-test-report.html',
      includeFailureMsg: true,
      includeConsoleLog: true,
      theme: 'defaultTheme',
      logo: '',
      executionTimeWarningThreshold: 5
    }]
  ],
  coverageReporters: ['html', 'text', 'lcov', 'json']
};