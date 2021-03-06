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
  verbose: true
}
