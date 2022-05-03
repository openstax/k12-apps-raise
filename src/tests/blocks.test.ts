import { createRoot } from 'react-dom/client'
import '@testing-library/jest-dom'
import { ContentBlock } from '../components/ContentBlock'
import { CTABlock } from '../components/CTABlock'
import {
  blockifyHTML, isInteractiveBlock,
  renderContentOnlyBlocks, renderCTABlocks,
  renderUserInputBlocks,
  OS_RAISE_IB_CTA_CLASS,
  OS_RAISE_IB_CONTENT_CLASS,
  OS_RAISE_IB_INPUT_CLASS
} from '../lib/blocks'
import { UserInputBlock } from '../components/UserInputBlock'

const mockRender = jest.fn()

jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({ render: mockRender }))
}))

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

test('renderContentOnlyBlocks parses and creates expected block', async () => {
  const divElem = document.createElement('div')
  divElem.className = OS_RAISE_IB_CONTENT_CLASS
  divElem.innerHTML = '<p>Content</p>'
  document.body.appendChild(divElem)

  renderContentOnlyBlocks(document.body)
  expect(createRoot).toBeCalledWith(divElem)
})

test('renderCTABlocks parses and creates expected block', async () => {
  const divElem = document.createElement('div')
  divElem.className = OS_RAISE_IB_CTA_CLASS
  divElem.innerHTML = '<div class="os-raise-ib-cta-content"><p>Some Content</p></div><div class="os-raise-ib-cta-prompt"><p>Prompt</p></div>'
  document.body.appendChild(divElem)

  renderCTABlocks(document.body)
  expect(createRoot).toBeCalledWith(divElem)
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
  expect(createRoot).toBeCalledWith(divElem)
})
