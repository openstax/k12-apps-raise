import { test, expect } from '@playwright/test'
import { mockPageContentRequest } from './utils'

test('user input block can trigger content-only block and tooltip', async ({ page }) => {
  const htmlContent = `
  <div class="os-raise-ib-input" data-fire-event="eventnameX" data-schema-version="1.0">
    <div class="os-raise-ib-input-content"></div>
    <div class="os-raise-ib-input-prompt"></div>
    <div class="os-raise-ib-input-ack"></div>
  </div>
  <div class="os-raise-ib-content" data-wait-for-event="eventnameX" data-schema-version="1.0">
    <p>Conditional content</p>
    <p>A sentence with the word <span class="os-raise-ib-tooltip" data-store="glossary-tooltip">absolute value</span> with its definition as a tooltip</p>
  </div>
  `

  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  await expect(page.locator('text=Conditional content')).not.toBeVisible()
  await page.fill('textarea', 'Response text')
  await page.locator('text=Submit').click()
  await page.waitForSelector('text=Conditional content')
  await page.locator('text=absolute value').hover()
  await page.waitForSelector('text=Coming soon!Math: \\( E=mc^2 \\)')
  await page.waitForSelector('.MathJax')
})

test('segmented content template works and displays tooltips', async ({ page }) => {
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
  <p>A sentence with the word <span class="os-raise-ib-tooltip" data-store="glossary-tooltip">absolute value</span> with its definition as a tooltip</p>
</div>
  `

  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  await page.waitForSelector('text=This is the content for block 1')
  await expect(page.locator('text=This is the content for block 2')).not.toBeVisible()
  await expect(page.locator('text=That\'s all folks!')).not.toBeVisible()
  await expect(page.locator('text=Coming soon!Math: \\( E=mc^2 \\)')).not.toBeVisible()
  await page.click('text=Yes!')
  await page.waitForSelector('text=This is the content for block 2')
  await expect(page.locator('text=That\'s all folks!')).not.toBeVisible()
  await page.click('text=Yes!')
  await page.waitForSelector('text=That\'s all folks!')
  await page.locator('text=absolute value').hover()
  await page.waitForSelector('text=Coming soon!Math: \\( E=mc^2 \\)')
  await page.waitForSelector('.MathJax')
})
