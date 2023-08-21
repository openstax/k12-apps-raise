import { fireEvent, render, screen } from '@testing-library/react'
import { ContentBlock } from '../components/ContentBlock'
import '@testing-library/jest-dom'
import { parseContentOnlyBlock, OS_RAISE_IB_EVENT_PREFIX } from '../lib/blocks'
import { mathifyElement } from '../lib/math'
import { setupServer } from 'msw/node'
import 'whatwg-fetch'
import { rest } from 'msw'

const server = setupServer(
  rest.get('http://contentapi/contents/version/glossary-tooltip.json', async (req, res, ctx) => {
    return await res(ctx.json({
      content: [{ term: 'absolute value', definition: 'The distance between a number and \\( 0 \\) on the number line.' }]
    }))
  }))

beforeAll(() => { server.listen() })
afterEach(() => { server.resetHandlers() })
afterAll(() => { server.close() })

jest.mock('../lib/math.ts', () => ({
  mathifyElement: jest.fn()
}))

jest.mock('../lib/env.ts', () => {})

test('ContentBlock renders', async () => {
  render(
    <ContentBlock content={'<p>String</p>'} />
  )

  screen.getByText('String')
})

test('ContentBlock does not render if waitForEvent does not fire', async () => {
  render(
    <ContentBlock content={'<p>String</p>'} waitForEvent='someEvent' />
  )

  expect(screen.queryByText('String')).toBeNull()
})

test('ContentBlock does render if waitForEvent is fired', async () => {
  render(
    <ContentBlock content={'<p>String</p>'} waitForEvent='someEvent' />
  )

  fireEvent(document, new CustomEvent('someEvent'))

  screen.getByText('String')
})

test('ContentBlock from parseContentOnlyBlock renders on namespaced event', async () => {
  const htmlContent = '<div class="os-raise-ib-content" data-wait-for-event="event1"><p>Test content</p></div>'
  const divElem = document.createElement('div')
  divElem.innerHTML = htmlContent
  const generatedContentBlock = parseContentOnlyBlock(divElem.children[0] as HTMLElement)

  expect(generatedContentBlock).not.toBeNull()

  render(
    generatedContentBlock as JSX.Element
  )

  expect(screen.queryByText('Test content')).toBeNull()
  fireEvent(document, new CustomEvent(`${OS_RAISE_IB_EVENT_PREFIX}-event1`))
  screen.getByText('Test content')
})

test('ContentBlock calls mathifyElement when rendered', async () => {
  render(
    <ContentBlock content={'<p>String</p>'} />
  )

  expect(mathifyElement).toBeCalled()
})
