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

test('math is rendered in Multiselect question', async ({ page }) => {
  const htmlContent = `
  <div class="os-raise-ib-pset" data-schema-version="1.0">
    <div class="os-raise-ib-pset-problem" data-problem-type="multiselect" data-solution='["red"]' data-solution-options='["red", "blue", "green"]'>
      <div class="os-raise-ib-pset-problem-content">
        <p id="problem">Multiselect problem content: \\( x^2 \\)</p>
      </div>
    </div>
    <div class="os-raise-ib-pset-correct-response">
      <p id="correct">Correct response with math: \\( x=2 \\)</p>
    </div>
    <div class="os-raise-ib-pset-encourage-response">
      <p id="encourage">Encourage response with math: \\( x=2 \\)</p>
    </div>
  </div>
  `
  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  await page.waitForSelector('#problem .MathJax')
  await page.locator('text=green').click()
  await page.locator('text=Check').click()
  await page.waitForSelector('#encourage .MathJax')
  await page.check('text=red')
  await page.uncheck('text=green')
  await page.locator('text=Check').click()
  await page.waitForSelector('#correct .MathJax')
})

test('math is rendered in Multiselect answer', async ({ page }) => {
  const htmlContent = `
  <div class="os-raise-ib-pset" data-schema-version="1.0">
    <div class="os-raise-ib-pset-problem" data-problem-type="multiselect" data-solution='["\\\\(x^2\\\\)"]' data-solution-options='["\\\\(x^2\\\\)", "blue", "green"]'>
      <div class="os-raise-ib-pset-problem-content">
        <p id="problem">Multiselect problem content: \\( x^2 \\)</p>
      </div>
    </div>
    <div class="os-raise-ib-pset-correct-response">
      <p id="correct">Correct response with math: \\( x=2 \\)</p>
    </div>
    <div class="os-raise-ib-pset-encourage-response">
      <p id="encourage">Encourage response with math: \\( x=2 \\)</p>
    </div>
  </div>
  `
  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  await page.waitForSelector('#problem .MathJax')
  await page.locator('text=green').click()
  await page.locator('text=Check').click()
  await page.waitForSelector('#encourage .MathJax')
  await page.check('input >> nth=0')
  await page.uncheck('text=green')
  await page.locator('text=Check').click()
  await page.waitForSelector('#correct .MathJax')
})

test('math is rendered in DropdownProblem question', async ({ page }) => {
  const htmlContent = `
  <div class="os-raise-ib-pset" data-schema-version="1.0">
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
  `
  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  await page.waitForSelector('#problem .MathJax')
  await page.selectOption('select', { label: 'blue' })
  await page.locator('text=Check').click()
  await page.waitForSelector('#encourage .MathJax')
  await page.selectOption('select', { label: 'red' })
  await page.locator('text=Check').click()
  await page.waitForSelector('#correct .MathJax')
})

test('User input problem with success triggered content', async ({ page }) => {
  const htmlContent = `
  <div class="os-raise-ib-pset" data-fire-success-event="event1" data-retry-limit="3" data-schema-version="1.0">
    <div class="os-raise-ib-pset-problem" data-problem-type="input" data-solution="42" data-problem-comparator="integer" >
      <div class="os-raise-ib-pset-problem-content">
      <p id="content">Input problem content: \\( x^2 \\)</p>
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
  await page.waitForSelector('#content .MathJax')

  await page.fill('textarea', ' 42')
  await page.click('button')
  await page.waitForSelector('#correct .MathJax')
  await page.waitForSelector('text=Great job!')
})

test('User input problem with encouragement response', async ({ page }) => {
  const htmlContent = `
  <div class="os-raise-ib-pset" data-fire-encourage-event="event1" data-retry-limit="3" data-schema-version="1.0">
    <div class="os-raise-ib-pset-problem" data-problem-type="input" data-solution="42" data-problem-comparator="integer" >
      <div class="os-raise-ib-pset-problem-content">
      <p id="content">Input problem content: \\( x^2 \\)</p>
      </div>
  </div>
    <div class="os-raise-ib-pset-correct-response">
      <p id="correct">Correct response with math: \\( x=2 \\)</p>
    </div>
    <div class="os-raise-ib-pset-encourage-response" data-wait-for-event="event1">
      <p id="encourage">Encourage response with math: \\( x=2 \\)</p>
    </div>
  </div>
  <div class="os-raise-ib-content" data-wait-for-event="event2" data-schema-version="1.0">
    <p>Great job!</p>
  </div>
  `

  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  await page.waitForSelector('#content .MathJax')
  await page.fill('textarea', ' 41')
  await page.click('button')
  await page.waitForSelector('#encourage .MathJax')
  await page.waitForSelector('text=Encourage response')
})

test('User input problem with learning opportunity ', async ({ page }) => {
  const htmlContent = `
  <div class="os-raise-ib-pset" data-fire-learning-opportunity-event="event1" data-retry-limit="2" data-schema-version="1.0">
    <div class="os-raise-ib-pset-problem" data-problem-type="input" data-solution="42" data-problem-comparator="integer" >
      <div class="os-raise-ib-pset-problem-content">
      <p id="content">Input problem content: \\( x^2 \\)</p>
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
  await page.waitForSelector('#content .MathJax')

  await page.fill('textarea', ' 41')
  await page.click('button')
  await page.click('button')
  await page.click('button')
  await page.waitForSelector('text=No more attempts allowed')
  await page.waitForSelector('text=Let\'s take another look at some concepts')
})
