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

test('Graybox class styles content correctly', async ({ page }) => {
  const htmlContent = '<p class="os-raise-graybox">Hello</p>'
  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  const elem = await page.waitForSelector('text=Hello')
  expect(await elem.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('border')
  })).toBe('1px solid rgb(217, 217, 217)')
  expect(await elem.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('padding')
  })).toBe('5px')
  expect(await elem.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('background-color')
  })).toBe('rgb(245, 245, 245)')
  expect(await elem.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('border-radius')
  })).toBe('5px')
})
