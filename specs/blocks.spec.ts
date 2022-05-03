import { test } from '@playwright/test'
import { mockPageContentRequest } from './utils'

test('user input block is rendered with math', async ({ page }) => {
  const htmlContent = `
  <div class="os-raise-ib-input" data-button-text="ButtonText" data-fire-event="eventnameX" data-schema-version="1.0">
    <div class="os-raise-ib-input-content">
      <p id="content">Content text with math \\( x=2 \\)</p>
    </div>
    <div class="os-raise-ib-input-prompt">
      <p id="prompt">Prompt text with math \\( x=2 \\)</p>
    </div>
    <div class="os-raise-ib-input-ack">
      <p id="ack">Ack text with math \\( x=2 \\)</p>
    </div>
  </div>
  `

  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  await page.waitForSelector('#content .MathJax')
  await page.waitForSelector('#prompt .MathJax')
  await page.fill('textarea', 'Response text')
  await page.locator('text=ButtonText').click()
  await page.waitForSelector('#ack .MathJax')
})
