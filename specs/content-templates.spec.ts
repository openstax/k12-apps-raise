import { test, expect } from '@playwright/test'
import { mockPageContentRequest } from './utils'

test('user input block can trigger content-only block', async ({ page }) => {
  const htmlContent = `
  <div class="os-raise-ib-input" data-fire-event="eventnameX" data-schema-version="1.0">
    <div class="os-raise-ib-input-content"></div>
    <div class="os-raise-ib-input-prompt"></div>
    <div class="os-raise-ib-input-ack"></div>
  </div>
  <div class="os-raise-ib-content" data-wait-for-event="eventnameX" data-schema-version="1.0">
    <p>Conditional content</p>
  </div>
  `

  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  await expect(page.locator('text=Conditional content')).not.toBeVisible()
  await page.fill('textarea', 'Response text')
  await page.locator('text=Submit').click()
  await page.waitForSelector('text=Conditional content')
})

test('segmented content template works', async ({ page }) => {
  const htmlContent = `
<div class="os-raise-ib-cta" data-button-text="Yes!" data-fire-event="event1">
  <div class="os-raise-ib-cta-content">
    <p>This is the content for block 1</p>
  </div>
  <div class="os-raise-ib-cta-prompt">
    <p>Want to see more?</p>
</div>
</div>
<div class="os-raise-ib-cta" data-button-text="Yes!!" data-fire-event="event2" data-wait-for-event="event1">
  <div class="os-raise-ib-cta-content">
    <p>This is the content for block 2</p>
  </div>
  <div class="os-raise-ib-cta-prompt">
    <p>Want to see more?</p>
  </div>
</div>
<div class="os-raise-ib-content" data-wait-for-event="event2">
  <p>That's all folks!</p>
</div>
  `

  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  await page.waitForSelector('text=This is the content for block 1')
  await expect(page.locator('text=This is the content for block 2')).not.toBeVisible()
  await expect(page.locator('text=That\'s all folks!')).not.toBeVisible()
  await page.click('text=Yes!')
  await page.waitForSelector('text=This is the content for block 2')
  await expect(page.locator('text=That\'s all folks!')).not.toBeVisible()
  await page.click('text=Yes!!')
  await page.waitForSelector('text=That\'s all folks!')
})

test('problemsets with success triggered content', async ({ page }) => {
  const htmlContent = `
  <div class="os-raise-ib-pset" data-fire-success-event="event1" data-schema-version="1.0">
    <div class="os-raise-ib-pset-problem" data-problem-type="dropdown" data-solution="red" data-solution-options='["red", "blue", "green"]'>
      <div class="os-raise-ib-pset-problem-content">
        <p id="problem">Dropdown problem content: \\( x^2 \\)</p>
      </div>
    </div>
    <div class="os-raise-ib-pset-correct-response">
      <p id="correct">Correct response with math: \\( x=2 \\)</p>
    </div>
    <div class="os-raise-ib-pset-encourage-response">
      <p id="encourage">Encourage response with math: \\( x=2 \\)</p>
    </div>
  </div>
  <div class="os-raise-ib-content" data-wait-for-event="event1" data-schema-version="1.0">
    <p>Great job!</p>
  </div>
  `

  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  await page.selectOption('select', { label: 'red' })
  await page.locator('text=Check').click()
  await page.waitForSelector('text=Great job!')
})

test('problem sets with learning opportunity triggered content', async ({ page }) => {
  const htmlContent = `
  <div class="os-raise-ib-pset" data-fire-learning-opportunity-event="event1" data-retry-limit="2" data-schema-version="1.0">
    <div class="os-raise-ib-pset-problem" data-problem-type="dropdown" data-solution="red" data-solution-options='["red", "blue", "green"]'>
      <div class="os-raise-ib-pset-problem-content">
        <p id="problem">Dropdown problem content: \\( x^2 \\)</p>
      </div>
    </div>
    <div class="os-raise-ib-pset-correct-response">
      <p id="correct">Correct response with math: \\( x=2 \\)</p>
    </div>
    <div class="os-raise-ib-pset-encourage-response">
      <p id="encourage">Encourage response with math: \\( x=2 \\)</p>
    </div>
  </div>
  <div class="os-raise-ib-content" data-wait-for-event="event1" data-schema-version="1.0">
    <p>Let's take another look at some concepts</p>
  </div>
  `

  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  await page.selectOption('select', { label: 'green' })
  await page.locator('text=Check').click()
  await page.locator('text=Check').click()
  await page.locator('text=Check').click()
  await page.waitForSelector('text=Let\'s take another look at some concepts')
})
