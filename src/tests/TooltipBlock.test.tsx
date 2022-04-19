import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { TooltipBlock } from '../components/TooltipBlock'

test('Tooltip Block unit test', async () => {
  render(
    <div data-testid="tooltip-content">
      <TooltipBlock text="my-text" tip="my-tip"/>
    </div>
  )

  expect(screen.getByTestId('tooltip-content')).toHaveTextContent('my-text')
})
