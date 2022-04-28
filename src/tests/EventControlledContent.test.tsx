import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { EventControlledContent } from '../components/EventControlledContent'

test('EventControlledContent does not render children if waitForEvent does not fire', async () => {
  render(
    <div data-testid="content">
      <EventControlledContent waitForEvent='someEvent'>
        <p>Controlled content</p>
      </EventControlledContent>
    </div>
  )

  expect(screen.getByTestId('content')).not.toHaveTextContent('Controlled content')
})

test('EventControlledContent renders children if waitForEvent fires', async () => {
  render(
    <div data-testid="content">
      <EventControlledContent waitForEvent='someEvent'>
        <p>Controlled content</p>
      </EventControlledContent>
    </div>
  )

  fireEvent(document, new CustomEvent('someEvent'))
  expect(screen.getByTestId('content')).toHaveTextContent('Controlled content')
})
