import { test } from '@playwright/test'
import { mockPageContentRequest } from './utils'

test('tooltip renders on hover', async ({ page }) => {
  const htmlContent = '<p>A sentence with the word <span class="os-raise-ib-tooltip" data-store="glossary">absolute value</span> with its definition as a tooltip</p>'

  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  await page.locator('text=absolute value').hover()
  await page.waitForSelector('text=The absolute value of a number')
  await page.waitForSelector('.MathJax')
})
