
import { test, expect } from '@playwright/test'
import { mockPageContentRequest } from './utils'
import { MATHJAX_URL } from '../src/lib/math'

test('math in content is processed by MathJax', async ({ page }) => {
  const htmlMathContent = '<p id="equation1">Here is an equation: \\( \\frac{1}{2}x = 24 \\)</p>'

  await mockPageContentRequest(page, htmlMathContent)
  await page.goto('/')
  await page.waitForSelector('#equation1 .MathJax')
  expect(await page.locator('#equation1 .MathJax').count()).toBe(1)
})

test('MathJax script tag only occurs once', async ({ page }) => {
  const htmlMathContent = '<p id="equation1">Here is an equation: \\( \\frac{1}{2}x = 24 \\)</p>'

  await mockPageContentRequest(page, htmlMathContent)
  await page.goto('/')
  await page.waitForSelector('#equation1 .MathJax')
  expect(await page.locator(`script[src="${MATHJAX_URL}"]`).count()).toBe(1)
})

test('math with expected delimiters is supported', async ({ page }) => {
  const htmlMathContent = `
  <p id="equation1">Here is an equation: \\( \\frac{1}{2}x = 24 \\)</p>
  <p id="equation2">Here is an equation: \\[ \\frac{1}{2}x = 24 \\]</p>
  <p id="equation3">Here is an equation: $$ \\frac{1}{2}x = 24 $$</p>
  `

  await mockPageContentRequest(page, htmlMathContent)
  await page.goto('/')
  await page.waitForSelector('#equation1 .MathJax')
  await page.waitForSelector('#equation2 .MathJax')
  await page.waitForSelector('#equation3 .MathJax')
})
