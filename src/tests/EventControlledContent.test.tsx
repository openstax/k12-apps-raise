import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { EventControlledContent } from '../components/EventControlledContent'

test('EventControlledContent does not render children if waitForEvent does not fire', async () => {
  render(
    <EventControlledContent waitForEvent='someEvent'>
      <p>Controlled content</p>
    </EventControlledContent>
  )

  expect(screen.queryByText('Controlled content')).toBeNull()
})

test('EventControlledContent renders children if waitForEvent fires', async () => {
  render(
    <EventControlledContent waitForEvent='someEvent'>
      <p>Controlled content</p>
    </EventControlledContent>
  )

  fireEvent(document, new CustomEvent('someEvent'))
  screen.getByText('Controlled content')
})
