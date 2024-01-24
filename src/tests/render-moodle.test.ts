import { createRoot } from 'react-dom/client'
import '@testing-library/jest-dom'
import {
  OS_RAISE_IB_CTA_CLASS,
  OS_RAISE_IB_CONTENT_CLASS,
  OS_RAISE_IB_INPUT_CLASS,
  OS_RAISE_IB_PSET_CLASS,
  OS_RAISE_IB_DESMOS_CLASS
} from '../lib/blocks'
import {
  renderContentOnlyBlocks,
  renderCTABlocks,
  renderUserInputBlocks,
  renderProblemSetBlocks,
  renderDesmosBlocks
} from '../lib/render-moodle'

const mockRender = jest.fn()

jest.mock('../lib/env.ts', () => {})

jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({ render: mockRender }))
}))

test('renderContentOnlyBlocks parses and creates expected block', async () => {
  const divElem = document.createElement('div')
  divElem.className = OS_RAISE_IB_CONTENT_CLASS
  divElem.innerHTML = '<p>Content</p>'
  document.body.appendChild(divElem)

  renderContentOnlyBlocks(document.body)
  expect(createRoot).toHaveBeenCalledWith(divElem)
})

test('renderCTABlocks parses and creates expected block', async () => {
  const divElem = document.createElement('div')
  divElem.className = OS_RAISE_IB_CTA_CLASS
  divElem.innerHTML = '<div class="os-raise-ib-cta-content"><p>Some Content</p></div><div class="os-raise-ib-cta-prompt"><p>Prompt</p></div>'
  document.body.appendChild(divElem)

  renderCTABlocks(document.body)
  expect(createRoot).toHaveBeenCalledWith(divElem)
})

test('renderDesmosBlocks parses and creates expected block', async () => {
  const divElem = document.createElement('div')
  divElem.className = OS_RAISE_IB_DESMOS_CLASS
  divElem.innerHTML = '<div class="os-raise-ib-desmos-gc" data-width="600" data-top="50" data-bottom="-50" data-left="-50" data-right="50" data-height="500" data-equations=\'["(1,2)", "(x=5)"]\'></div>'
  document.body.appendChild(divElem)

  renderDesmosBlocks(document.body)
  expect(createRoot).toHaveBeenCalledWith(divElem)
})

test('renderUserInputBlocks parses and creates expected block', async () => {
  const divElem = document.createElement('div')
  divElem.className = OS_RAISE_IB_INPUT_CLASS
  divElem.innerHTML = `
  <div class="os-raise-ib-input-content"></div>
  <div class="os-raise-ib-input-prompt"></div>
  <div class="os-raise-ib-input-ack"></div>
  `
  document.body.appendChild(divElem)

  renderUserInputBlocks(document.body)
  expect(createRoot).toHaveBeenCalledWith(divElem)
})

test('renderProblemSetBlocks parses and creates expected block', async () => {
  const divElem = document.createElement('div')
  divElem.className = OS_RAISE_IB_PSET_CLASS
  divElem.innerHTML = `
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
  document.body.appendChild(divElem)

  renderProblemSetBlocks(document.body)
  expect(createRoot).toHaveBeenCalledWith(divElem)
})
