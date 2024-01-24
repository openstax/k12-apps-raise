export default {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  testMatch: ['**/src/tests/*.ts?(x)'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts?(x)',
    '!src/*.d.ts',
    '!src/lib/env.ts'
  ],
  moduleNameMapper: {
    '^mathlive$': '<rootDir>/node_modules/mathlive'
  },
  setupFiles: [
    '<rootDir>/jest.setup.ts',
    '<rootDir>/jest.polyfills.js'
  ],
  resolver: '<rootDir>/jest.resolver.js',
  verbose: true
}
