import { test, expect } from '@playwright/test'
import { mockPageContentRequest } from './utils'

test('tooltip renders math from glossary-tooltip.', async ({ page }) => {
  const htmlContent = `

    <p><span id="tooltip1" class="os-raise-ib-tooltip" data-store="glossary-tooltip" data-schema-version="1.0">absolute value</span></p>

  `
  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  await page.waitForSelector('text= absolute value ')
  await expect(page.locator('text=The absolute value of a number')).not.toBeVisible()
  await page.locator('#tooltip1').hover()
  await page.waitForSelector('text=The absolute value of a number')

  await expect(page.locator('text=The absolute value of a number')).toBeVisible()
})
/*
test('segmented content template renders math and tooltips', async ({ page }) => {
  const htmlContent = `
<div class="os-raise-ib-cta" data-button-text="Yes!" data-fire-event="event1">
  <div class="os-raise-ib-cta-content">
    <p>This is the content for block 1</p>
    <p id="equation1">Math for block 1: \\( x=0 \\)</p>
    <p><span id="tooltip1" class="os-raise-ib-tooltip" data-store="glossary-tooltip">absolute value</span></p>
  </div>
  <div class="os-raise-ib-cta-prompt">
    <p>Want to see more?</p>
</div>
</div>
<div class="os-raise-ib-cta" data-button-text="Yes!" data-fire-event="event2" data-wait-for-event="event1">
  <div class="os-raise-ib-cta-content">
    <p>This is the content for block 2</p>
    <p id="equation2">Math for block 2: \\( x=0 \\)</p>
    <p><span id="tooltip2" class="os-raise-ib-tooltip" data-store="glossary-tooltip">absolute value</span></p>
  </div>
  <div class="os-raise-ib-cta-prompt">
    <p>Want to see more?</p>
  </div>
</div>
<div class="os-raise-ib-content" data-wait-for-event="event2">
  <p>That's all folks!</p>
  <p id="equation3">Math for ending block: \\( x=0 \\)</p>
  <p><span id="tooltip3" class="os-raise-ib-tooltip" data-store="glossary-tooltip">absolute value</span></p>
</div>
  `

  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  await page.waitForSelector('text=This is the content for block 1')
  await page.waitForSelector('#equation1 .MathJax')
  await page.locator('#tooltip1').hover()
  await page.waitForSelector('text=The absolute value of a number')
  await expect(page.locator('text=This is the content for block 2')).not.toBeVisible()
  await expect(page.locator('text=That\'s all folks!')).not.toBeVisible()
  await page.click('text=Yes!')
  await page.waitForSelector('text=This is the content for block 2')
  await page.waitForSelector('#equation2 .MathJax')
  await page.locator('#tooltip2').hover()
  await expect(page.locator('text=That\'s all folks!')).not.toBeVisible()
  await page.click('text=Yes!')
  await page.waitForSelector('text=That\'s all folks!')
  await page.waitForSelector('#equation3 .MathJax')
  await page.locator('#tooltip3').hover()
})
*/
