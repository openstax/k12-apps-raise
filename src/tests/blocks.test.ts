import { createRoot } from 'react-dom/client'
import '@testing-library/jest-dom'
import { ContentBlock } from '../components/ContentBlock'
import {
  blockifyHTML, isInteractiveBlock, renderContentOnlyBlocks,
  OS_RAISE_IB_CONTENT_CLASS, OS_RAISE_IB_INPUT_CLASS
} from '../lib/blocks'

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
  <div class="os-raise-ib-content" data-wait-for-event="event">Test waiting</div>
  <div class="os-raise-ib-content">Test no wait</div>
  <p>P4</p>
  <p>P5</p>`
  const components = blockifyHTML(htmlContent)
  expect(components.length).toBe(4)
  expect(components[0].props.children.type).toBe(ContentBlock)
  expect(components[1].props.children.type).toBe(ContentBlock)
  expect(components[2].props.children.type).toBe(ContentBlock)
  expect(components[3].props.children.type).toBe(ContentBlock)
})

test('renderContentOnlyBlocks parses and creates expected block', async () => {
  const divElem = document.createElement('div')
  divElem.className = OS_RAISE_IB_CONTENT_CLASS
  divElem.innerHTML = '<p>Content</p>'
  document.body.appendChild(divElem)

  renderContentOnlyBlocks(document.body)
  expect(createRoot).toBeCalledWith(divElem)
})
