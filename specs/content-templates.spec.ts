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
