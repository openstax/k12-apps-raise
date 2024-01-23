import { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  testDir: 'specs',
  timeout: 10000,
  webServer: {
    command: 'npx vite --port 3001',
    port: 3001,
    reuseExistingServer: false,
  },
  use: {
    screenshot: 'on',
    trace: 'retain-on-failure'
  }
}
export default config
