import { test } from '@playwright/test'
import { mockPageContentRequest } from './utils'

test('math is rendered in cta blocks', async ({ page }) => {
  const htmlContent = `
  <div class="os-raise-ib-cta-block" data-button-text="ButtonText" data-fire-event="eventnameX" data-schema-version="1.0">
    <div class="os-raise-ib-cta-content">
      <p id="content">Content text with math \\( x=2 \\)</p>
    </div>
    <div class="os-raise-ib-cta-prompt">
      <p id="prompt">Prompt text with math \\( x=2 \\)</p>
    </div>
  </div>
  `

  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  await page.waitForSelector('#content .MathJax')
  await page.waitForSelector('#prompt .MathJax')
})
