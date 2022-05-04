import { test } from '@playwright/test'
import { mockPageContentRequest } from './utils'

test('user input block is rendered with math and tooltip', async ({ page }) => {
  const htmlContent = `
  <div class="os-raise-ib-input" data-button-text="ButtonText" data-fire-event="eventnameX" data-schema-version="1.0">
    <div class="os-raise-ib-input-content">
      <p id="content">Content text with math \\( x=2 \\)</p>
      <p>A sentence with the word <span class="os-raise-ib-tooltip" data-store="glossary-tooltip">absolute value</span> with its definition as a tooltip</p>
    </div>
    <div class="os-raise-ib-input-prompt">
      <p id="prompt">Prompt text with math \\( x=2 \\)</p>
      <p>A sentence with the word <span class="os-raise-ib-tooltip" data-store="glossary-tooltip">binomial</span> with its definition as a tooltip</p>
    </div>
    <div class="os-raise-ib-input-ack">
      <p id="ack">Ack text with math \\( x=2 \\)</p>
      <p>A sentence with the word <span class="os-raise-ib-tooltip" data-store="glossary-tooltip">annuity</span> with its definition as a tooltip</p>
    </div>
  </div>
  `

  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  await page.waitForSelector('#content .MathJax')
  await page.waitForSelector('#prompt .MathJax')
  await page.fill('textarea', 'Response text')
  await page.locator('text=absolute value').hover()
  await page.waitForSelector('text=Coming soon!')
  await page.waitForSelector('.MathJax')
  await page.locator('text=binomial').hover()
  await page.waitForSelector('text=Coming soon!')
  await page.waitForSelector('.MathJax')
  await page.locator('text=ButtonText').click()
  await page.locator('text=annuity').hover()
  await page.waitForSelector('text=Coming soon!')
  await page.waitForSelector('.MathJax')
  await page.waitForSelector('#ack .MathJax')
})

test('math and tooltip is rendered in cta blocks', async ({ page }) => {
  const htmlContent = `
  <div class="os-raise-ib-cta-block" data-button-text="ButtonText" data-fire-event="eventnameX" data-schema-version="1.0">
    <div class="os-raise-ib-cta-content">
      <p id="content">Content text with math \\( x=2 \\)</p>
      <p>A sentence with the word <span class="os-raise-ib-tooltip" data-store="glossary-tooltip">absolute value</span> with its definition as a tooltip</p>
    </div>
    <div class="os-raise-ib-cta-prompt">
      <p id="prompt">Prompt text with math \\( x=2 \\)</p>
      <p>A sentence with the word <span class="os-raise-ib-tooltip" data-store="glossary-tooltip">binomial</span> with its definition as a tooltip</p>
    </div>
  </div>
  `

  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  await page.waitForSelector('#content .MathJax')
  await page.waitForSelector('#prompt .MathJax')
  await page.locator('text=absolute value').hover()
  await page.waitForSelector('text=Coming soon!')
  await page.waitForSelector('.MathJax')
  await page.locator('text=binomial').hover()
  await page.waitForSelector('text=Coming soon!')
  await page.waitForSelector('.MathJax')
})
