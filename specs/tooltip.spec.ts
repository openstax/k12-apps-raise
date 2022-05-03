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
