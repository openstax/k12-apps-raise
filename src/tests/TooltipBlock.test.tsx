import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { TooltipBlock } from '../components/TooltipBlock'
import { mathifyElement } from '../lib/math'

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
test('Tooltip Block renders math', async () => {
  jest.mock('../lib/math.ts')

  render(
    <div data-testid="tooltip-content">
      <TooltipBlock text="my-text" tip="\( x=2 \)"/>
    </div>
  )

  expect(screen.getByTestId('tooltip-content')).toHaveTextContent('my-text')
  fireEvent.mouseOver(screen.getByText('my-text'))
  //await waitFor(() => expect(document.querySelector('.MathJax')).not.toBeNull())

  // await waitFor(() => expect(mathifyElement).toHaveBeenCalled())
})
