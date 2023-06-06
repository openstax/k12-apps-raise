import { test, expect } from '@playwright/test'
import { DESMOS_URL } from '../src/lib/desmos'
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
  await page.waitForSelector('role=tooltip')
  await page.waitForSelector('.MathJax')
  await page.locator('text=Content text with math').hover() // Hover away to remove tooltip
  await page.locator('text=binomial').hover()
  await page.waitForSelector('role=tooltip')
  await page.waitForSelector('.MathJax')
  await page.locator('text=Content text with math').hover() // Hover away to remove tooltip
  await page.locator('text=ButtonText').click()
  await page.locator('text=annuity').hover()
  await page.waitForSelector('role=tooltip')
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
  await page.waitForSelector('role=tooltip')
  await page.waitForSelector('.MathJax')
  await page.locator('text=Content text with math').hover() // Hover away to remove tooltip
  await page.locator('text=binomial').hover()
  await page.waitForSelector('role=tooltip')
  await page.waitForSelector('.MathJax')
})

test('math is rendered in Multiselect question', async ({ page }) => {
  const htmlContent = `
  <div class="os-raise-ib-pset" data-retry-limit="3" data-schema-version="1.0">
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
  await page.waitForSelector('text=Attempts left: 4/4')
  await page.locator('text=green').click()
  await page.locator('text=Check').click()
  await page.waitForSelector('text=Attempts left: 3/4')
  await page.waitForSelector('#encourage .MathJax')
  await page.check('text=red')
  await page.uncheck('text=green')
  await page.locator('text=Check').click()
  await page.waitForSelector('#correct .MathJax')
  await page.waitForSelector('text=Attempts left: 3/4')
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

test('math is rendered in MultipleChoiceProblem question', async ({ page }) => {
  const htmlContent = `
  <div class="os-raise-ib-pset" data-schema-version="1.0">
    <div class="os-raise-ib-pset-problem" data-problem-type="multiplechoice" data-solution="red" data-solution-options='["red", "blue", "green"]'>
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
  await page.locator('text=green').click()
  await page.locator('text=Check').click()
  await page.waitForSelector('#encourage .MathJax')
  await page.check('.form-check-label >> nth=0')
  await page.locator('text=Check').click()
  await page.waitForSelector('#correct .MathJax')
})

test('math is rendered in user input answer', async ({ page }) => {
  const htmlContent = `
  <div class="os-raise-ib-pset" data-fire-success-event="event1" data-retry-limit="3" data-schema-version="1.0">
    <div class="os-raise-ib-pset-problem" data-problem-type="input" data-solution="42" data-problem-comparator="integer" >
      <div class="os-raise-ib-pset-problem-content">
      <p id="problem">Input problem content: \\( x^2 \\)</p>
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
  await page.waitForSelector('#problem .MathJax')
  await page.waitForSelector('text=Attempts left: 4/4')
  await page.fill('input', ' 41')
  await page.click('button')
  await page.waitForSelector('text=Attempts left: 3/4')
  await page.waitForSelector('#encourage .MathJax')
  await page.fill('input', ' 42')
  await page.click('button')
  await page.waitForSelector('#correct .MathJax')
  await page.waitForSelector('text=Great job!')
})

test('math is rendered in MultipleChoice answer', async ({ page }) => {
  const htmlContent = `
  <div class="os-raise-ib-pset" data-schema-version="1.0">
    <div class="os-raise-ib-pset-problem" data-problem-type="multiplechoice" data-solution='\\(x^2\\)' data-solution-options='["\\\\(x^2\\\\)", "blue", "green"]'>
      <div class="os-raise-ib-pset-problem-content">
        <p id="problem">MultipleChoice problem content: \\( x^2 \\)</p>
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
  await page.locator('text=blue').click()
  await page.locator('text=Check').click()
  await page.waitForSelector('#encourage .MathJax')
  await page.check('.form-check-label >> nth=0')
  await page.locator('text=Check').click()
  await page.waitForSelector('#correct .MathJax')
})

test('math rendered in attempts-exhausted response', async ({ page }) => {
  const htmlContent = `
  <div class="os-raise-ib-pset" data-schema-version="1.0" data-retry-limit="3">
    <div class="os-raise-ib-pset-problem" data-problem-type="multiplechoice" data-solution='\\(x^2\\)' data-solution-options='["\\\\(x^2\\\\)", "blue", "green"]'>
      <div class="os-raise-ib-pset-problem-content">
        <p id="problem">MultipleChoice problem content: \\( x^2 \\)</p>
      </div>
      <div class='os-raise-ib-pset-attempts-exhausted-response'>
          <p id="attemptsExhausted">The answer is 42 \\( x=2 \\)</p>
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
  await page.locator('text=blue').click()
  await page.locator('text=Check').click()
  await page.locator('text=Check').click()
  await page.locator('text=Check').click()
  await page.locator('text=Check').click()
  await page.waitForSelector('#attemptsExhausted .MathJax')
})

test('attempts-exhausted response overrides answer-specific response', async ({ page }) => {
  const htmlContent = `
  <div class="os-raise-ib-pset" data-schema-version="1.0" data-retry-limit="3">
    <div class="os-raise-ib-pset-problem" data-problem-type="input" data-solution='42' data-problem-comparator='integer'>
      <div class="os-raise-ib-pset-problem-content">
        <p id="problem">MultipleChoice problem content: \\( x^2 \\)</p>
      </div>
      <div class="os-raise-ib-pset-encourage-response" data-answer="41">
          <p>Almost there</p>
      </div>
      <div class='os-raise-ib-pset-attempts-exhausted-response'>
          <p id="attemptsExhausted">The answer is 42</p>
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
  await page.fill('input', ' 40')
  await page.locator('text=Check').click()
  await page.waitForSelector('#encourage .MathJax')
  await page.locator('text=Check').click()
  await page.locator('text=Check').click()
  await page.fill('input', ' 41')
  await page.locator('text=Check').click()
  await page.waitForSelector('#attemptsExhausted')
})

test('Desmos script loads', async ({ page }) => {
  const htmlDesmosContent = '<div class="os-raise-ib-desmos-gc" data-expressions="false" data-width="600" data-top="50" data-bottom="-50" data-left="-50" data-right="50" data-height="500" data-equations=\'["(1,2)", "x=5"]\'></div>'

  await mockPageContentRequest(page, htmlDesmosContent)
  await page.goto('/')
  await page.waitForSelector('.dcg-grapher')
  expect(await page.locator(`script[src="${DESMOS_URL}"]`).count()).toBe(1)
})
test('There is only one Desmos script for multiple calculators', async ({ page }) => {
  const htmlDesmosContent = `<div class="os-raise-ib-desmos-gc" data-disable-expressions data-width="600" data-top="50" data-bottom="-50" data-left="-50" data-right="50" data-height="500" data-equations='["(1,2)", "x=5"]'></div>
  <div class="os-raise-ib-desmos-gc" data-disable-expressions data-width="600" data-top="50" data-bottom="-50" data-left="-50" data-right="50" data-height="500" data-equations='["(1,2)", "x=5"]'></div>`

  await mockPageContentRequest(page, htmlDesmosContent)
  await page.goto('/')
  await page.waitForSelector('.dcg-grapher')
  expect(await page.locator(`script[src="${DESMOS_URL}"]`).count()).toBe(1)
})
test('Desmos has equations and shows all in expressions panel.', async ({ page }) => {
  const htmlDesmosContent = '<div class="os-raise-ib-desmos-gc" data-width="600" data-top="50" data-bottom="-50" data-left="-50" data-right="50" data-height="500" data-equations=\'["(1,2)", "x=5"]\'></div>'
  await mockPageContentRequest(page, htmlDesmosContent)
  await page.goto('/')
  await page.waitForSelector('.dcg-grapher')
  await page.waitForSelector('text=x=5')
  await page.waitForSelector('text=(1,2)')
})

test('Desmos has equations and tables shows all in expressions panel', async ({ page }) => {
  const htmlDesmosContent = `<div class="os-raise-ib-desmos-gc" data-height="500" data-width="600" data-equations='["(1,2)", "x=5"]' data-tables='[[{"variable": "x_1", "values": [1, 2]}, {"variable": "x_2", "values": [125, 204]}],[{"variable": "x_3", "values": [543, 2]},{"variable": "x_4", "values": [1, 2]}]]'
 data-top="100" data-bottom="-100" data-left="-10" data-right="10" data-schema-version="1.0"></div>`
  await mockPageContentRequest(page, htmlDesmosContent)
  await page.goto('/')
  await page.waitForSelector('.dcg-grapher')
  await page.waitForSelector('text=x=5')
  await page.waitForSelector('text=(1,2)')
  await page.waitForSelector('.dcg-table-container')
  await page.waitForSelector('text=x1')
  await page.waitForSelector('text=x2')
  await page.waitForSelector('text=x3')
  await page.waitForSelector('text=x4')
  await page.waitForSelector('text=125')
  await page.waitForSelector('text=543')
})

test('Desmos expressions panel is not visible.', async ({ page }) => {
  const htmlDesmosContent = '<div class="os-raise-ib-desmos-gc" data-disable-expressions data-width="600" data-top="50" data-bottom="-50" data-left="-50" data-right="50" data-height="500" data-equations=\'["(1,2)", "x=5"]\'></div>'
  await mockPageContentRequest(page, htmlDesmosContent)
  await page.goto('/')
  await page.waitForSelector('.dcg-grapher')
  await expect(page.locator('text=x=5')).not.toBeVisible()
})
