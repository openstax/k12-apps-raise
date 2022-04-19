import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { TooltipBlock } from '../components/TooltipBlock'

test('Tooltip Block unit test', async () => {
  render(
    <div data-testid="tooltip-content">
      <TooltipBlock text="my-text" tip="<p>my-tip</p>"/>
    </div>
  )

  expect(screen.getByTestId('tooltip-content')).toHaveTextContent('my-text')
  fireEvent.mouseOver(screen.getByText('my-text'))
  expect(await screen.findByText('my-tip')).toBeVisible()
  expect(document.querySelector('.os-raise-bootstrap')).toHaveTextContent('my-tip')
})
