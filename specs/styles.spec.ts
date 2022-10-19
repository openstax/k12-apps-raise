import { test, expect } from '@playwright/test'
import { mockPageContentRequest } from './utils'

test('Indentation class indents content correctly', async ({ page }) => {
  const htmlContent = '<p class="os-raise-indent">Hello</p>'
  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  const elem = await page.waitForSelector('text=Hello')
  expect(await elem.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('padding-left')
  })).toBe('32px')
})

test('Un-Indentation class for ordered lists unindents content.', async ({ page }) => {
  const htmlContent = `
<ol class="os-raise-noindent">
  <li>First</li>
</ol>`
  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  const elem = await page.waitForSelector('text=First')
  expect(await elem.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('list-style-position')
  })).toBe('inside')
})
