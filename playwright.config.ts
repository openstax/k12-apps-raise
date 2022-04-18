import { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  testDir: 'specs',
  timeout: 10000,
  globalSetup: './specs/setup.ts',
  use: {
    baseURL: 'http://localhost:3001/',
    screenshot: 'on',
    trace: 'retain-on-failure'
  }
}
export default config
