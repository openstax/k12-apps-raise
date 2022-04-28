import { fireEvent, render, screen } from '@testing-library/react'
import { ContentBlock } from '../components/ContentBlock'
import '@testing-library/jest-dom'
import { parseContentOnlyBlock, OS_RAISE_IB_EVENT_PREFIX } from '../lib/blocks'
import { mathifyElement } from '../lib/math'

jest.mock('../lib/math.ts', () => ({
  mathifyElement: jest.fn()
}))

test('ContentBlock renders', async () => {
  render(
    <div data-testid="content-block">
      <ContentBlock content={'<p>String</p>'} />
    </div>
  )

  expect(screen.getByTestId('content-block').querySelector('p')).toHaveTextContent('String')
})

test('ContentBlock does not render if waitForEvent does not fire', async () => {
  render(
    <div data-testid="content-block">
      <ContentBlock content={'<p>String</p>'} waitForEvent='someEvent' />
    </div>
  )
  expect(screen.getByTestId('content-block')).not.toHaveTextContent('String')
})

test('ContentBlock does render if waitForEvent is fired', async () => {
  render(
    <div data-testid="content-block">
      <ContentBlock content={'<p>String</p>'} waitForEvent='someEvent' />
    </div>
  )

  fireEvent(document, new CustomEvent('someEvent'))

  expect(screen.getByTestId('content-block').querySelector('p')).toHaveTextContent('String')
})

test('ContentBlock from parseContentOnlyBlock renders on namespaced event', async () => {
  const htmlContent = '<div class="os-raise-ib-content" data-wait-for-event="event1"><p>Test content</p></div>'
  const divElem = document.createElement('div')
  divElem.innerHTML = htmlContent
  const generatedContentBlock = parseContentOnlyBlock(divElem.children[0] as HTMLElement)

  expect(generatedContentBlock).not.toBeNull()

  render(
    <div data-testid="content-block">
      {generatedContentBlock as JSX.Element}
    </div>
  )
  expect(screen.getByTestId('content-block')).not.toHaveTextContent('Test content')
  fireEvent(document, new CustomEvent(`${OS_RAISE_IB_EVENT_PREFIX}-event1`))
  expect(screen.getByTestId('content-block')).toHaveTextContent('Test content')
})

test('ContentBlock calls mathifyElement when rendered', async () => {
  render(
    <div data-testid="content-block">
      <ContentBlock content={'<p>String</p>'} />
    </div>
  )

  expect(mathifyElement).toBeCalled()
})
