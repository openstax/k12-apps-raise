import { test, expect } from '@playwright/test'
import { mockPageContentRequest } from './utils'

test('segmented content template works', async ({ page }) => {
  const htmlContent = `
<div class="os-raise-ib-cta" data-button-text="Yes!" data-fire-event="event1">
  <div class="os-raise-ib-cta-content">
    <p>This is the content for block 1</p>
  </div>
  <div class="os-raise-ib-cta-prompt">
    <p>Want to see more?</p>
</div>
</div>
<div class="os-raise-ib-cta" data-button-text="Yes!" data-fire-event="event2" data-wait-for-event="event1">
  <div class="os-raise-ib-cta-content">
    <p>This is the content for block 2</p>
  </div>
  <div class="os-raise-ib-cta-prompt">
    <p>Want to see more?</p>
  </div>
</div>
<div class="os-raise-ib-content" data-wait-for-event="event2">
  <p>That's all folks!</p>
</div>
  `

  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  await page.waitForSelector('text=This is the content for block 1')
  await expect(page.locator('text=This is the content for block 2')).not.toBeVisible()
  await expect(page.locator('text=That\'s all folks!')).not.toBeVisible()
  await page.click('text=Yes!')
  await page.waitForSelector('text=This is the content for block 2')
  await expect(page.locator('text=That\'s all folks!')).not.toBeVisible()
  await page.click('text=Yes!')
  await page.waitForSelector('text=That\'s all folks!')
})
