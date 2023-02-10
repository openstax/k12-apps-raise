import '@testing-library/jest-dom'
import { ContentBlock } from '../components/ContentBlock'
import { CTABlock } from '../components/CTABlock'
import {
  blockifyHTML,
  isInteractiveBlock,
  OS_RAISE_IB_CTA_CLASS,
  OS_RAISE_IB_CONTENT_CLASS,
  OS_RAISE_IB_INPUT_CLASS,
  OS_RAISE_IB_PSET_CLASS
} from '../lib/blocks'
import { UserInputBlock } from '../components/UserInputBlock'
import { ProblemSetBlock } from '../components/ProblemSetBlock'

jest.mock('../lib/env.ts', () => {})

test('isInteractiveBlock returns false on non-interactive block', async () => {
  const tmpDiv = document.createElement('div')

  expect(isInteractiveBlock(tmpDiv)).toBe(false)

  tmpDiv.className = 'otherclass'
  expect(isInteractiveBlock(tmpDiv)).toBe(false)
})

test('isInteractiveBlock recognizes content-only block', async () => {
  const tmpDiv = document.createElement('div')
  tmpDiv.className = OS_RAISE_IB_CONTENT_CLASS

  expect(isInteractiveBlock(tmpDiv)).toBe(true)

  tmpDiv.className = `${OS_RAISE_IB_CONTENT_CLASS} otherclass`
  expect(isInteractiveBlock(tmpDiv)).toBe(true)
})

test('isInteractiveBlock recognizes CTA-block', async () => {
  const tmpDiv = document.createElement('div')
  tmpDiv.className = OS_RAISE_IB_CTA_CLASS

  expect(isInteractiveBlock(tmpDiv)).toBe(true)

  tmpDiv.className = `${OS_RAISE_IB_CTA_CLASS} otherclass`
})

test('isInteractiveBlock recognizes user input block', async () => {
  const tmpDiv = document.createElement('div')
  tmpDiv.className = OS_RAISE_IB_INPUT_CLASS

  expect(isInteractiveBlock(tmpDiv)).toBe(true)

  tmpDiv.className = `${OS_RAISE_IB_INPUT_CLASS} otherclass`

  expect(isInteractiveBlock(tmpDiv)).toBe(true)
})

test('isInteractiveBlock recognizes problem set block', async () => {
  const tmpDiv = document.createElement('div')
  tmpDiv.className = OS_RAISE_IB_PSET_CLASS

  expect(isInteractiveBlock(tmpDiv)).toBe(true)

  tmpDiv.className = `${OS_RAISE_IB_PSET_CLASS} otherclass`

  expect(isInteractiveBlock(tmpDiv)).toBe(true)
})

test('blockifyHTML consolidates non-block peer elements into a single content block component', async () => {
  const htmlContent = '<p>P1</p><p>P2</p><p>P3</p>'
  const components = blockifyHTML(htmlContent)
  expect(components.length).toBe(1)
  expect(components[0].props.children.type).toBe(ContentBlock)
})

test('blockifyHTML handles non-block content with interactive blocks', async () => {
  const htmlContent = `
  <p>P1</p>
  <p>P2</p>
  <p>P3</p>
  <div class="${OS_RAISE_IB_CTA_CLASS}" data-button-text="CHECK" data-fire-event="event1">
    <div class="os-raise-ib-cta-content">
      <p>This is the content for block 1</p>
    </div>
    <div class="os-raise-ib-cta-prompt">
      <p>Want to see more?</p>
    </div>
  </div>
  <div class="${OS_RAISE_IB_CONTENT_CLASS}" data-wait-for-event="event">Test waiting</div>
  <div class="${OS_RAISE_IB_CONTENT_CLASS}">Test no wait</div>
  <div class="${OS_RAISE_IB_INPUT_CLASS}">
    <div class="os-raise-ib-input-content"></div>
    <div class="os-raise-ib-input-prompt"></div>
    <div class="os-raise-ib-input-ack"></div>
  </div>
  <p>P4</p>
  <p>P5</p>`
  const components = blockifyHTML(htmlContent)
  expect(components.length).toBe(6)
  expect(components[0].props.children.type).toBe(ContentBlock)
  expect(components[1].props.children.type).toBe(CTABlock)
  expect(components[2].props.children.type).toBe(ContentBlock)
  expect(components[3].props.children.type).toBe(ContentBlock)
  expect(components[4].props.children.type).toBe(UserInputBlock)
  expect(components[5].props.children.type).toBe(ContentBlock)
})

test('blockifyHTML handles problem set blocks', async () => {
  const htmlContent = `
  <div class="${OS_RAISE_IB_PSET_CLASS}" data-schema-version="1.0">
    <div class="os-raise-ib-pset-problem" data-problem-type="input" data-solution="42" data-problem-comparator="integer">
      <div class="os-raise-ib-pset-problem-content"></div>
    </div>
    <div class="os-raise-ib-pset-problem" data-problem-type="dropdown" data-solution="red" data-solution-options='["red", "blue", "green"]'>
      <div class="os-raise-ib-pset-problem-content"></div>
    </div>
    <div class="os-raise-ib-pset-problem" data-problem-type="multiselect" data-solution='["red", "blue"]' data-solution-options='["red", "blue", "green"]'>
      <div class="os-raise-ib-pset-problem-content"></div>
    </div>
    <div class="os-raise-ib-pset-correct-response"></div>
    <div class="os-raise-ib-pset-encourage-response"></div>
  </div>
  `
  const components = blockifyHTML(htmlContent)
  expect(components.length).toBe(1)
  expect(components[0].props.children.type).toBe(ProblemSetBlock)
})
