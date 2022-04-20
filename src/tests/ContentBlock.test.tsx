import { fireEvent, render, screen } from '@testing-library/react'
import { ContentBlock } from '../components/ContentBlock'
import '@testing-library/jest-dom'

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
  expect(screen.getByTestId('content-block').querySelector('p')).toBeNull()
})

test('CTABlock does render if waitForEvent is fired', async () => {
  render(
    <div data-testid="content-block">
      <ContentBlock content={'<p>String</p>'} waitForEvent='someEvent' />
    </div>
  )

  fireEvent(document, new CustomEvent('someEvent'))

  expect(screen.getByTestId('content-block').querySelector('p')).toHaveTextContent('String')
})
