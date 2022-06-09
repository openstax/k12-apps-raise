import { test, expect } from '@playwright/test'
import { mockPageContentRequest } from './utils'
import { DESMOS_URL } from '../src/lib/desmos'

test('math in content is processed by MathJax', async ({ page }) => {
  const htmlMathContent = '<p id="equation1">Here is an equation: \\( \\frac{1}{2}x = 24 \\)</p>'

  await mockPageContentRequest(page, htmlMathContent)
  await page.goto('/')
  await page.waitForSelector('#equation1 .MathJax')
  expect(await page.locator('#equation1 .MathJax').count()).toBe(1)
})

test('MathJax script tag only occurs once', async ({ page }) => {
  const htmlDesmosContent = `<div id="calc" class="os-raise-ib-desmos" data-equations='["y=x^2", " (1,2)"]'>
  </div>
  `

  await mockPageContentRequest(page, htmlDesmosContent)
  await page.goto('/')
  await page.waitForSelector('#calc')
  expect(await page.locator(`script[src="${DESMOS_URL}"]`).count()).toBe(1)
})
