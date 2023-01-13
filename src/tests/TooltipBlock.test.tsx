import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { TooltipBlock } from '../components/TooltipBlock'
import { mathifyElement } from '../lib/math'

jest.mock('../lib/math.ts', () => ({
  mathifyElement: jest.fn(async () => {})
}))

test('Tooltip Block displays tip after mouse over event', async () => {
  render(
      <TooltipBlock text='my-text' tip='<p>my-tip</p>'/>
  )

  screen.getByText('my-text')
  expect(document.querySelector('.os-raise-bootstrap')).not.toHaveTextContent('my-tip')
  fireEvent.mouseOver(screen.getByText('my-text'))
  expect(await screen.findByText('my-tip')).toBeVisible()
  expect(document.querySelector('.os-raise-bootstrap')).toHaveTextContent('my-tip')
})
test('Tooltip Block renders math', async () => {
  render(
    <TooltipBlock text='my-text' tip='<p>my-tip</p>'/>
  )

  expect(screen.getByText('my-text'))
  fireEvent.mouseOver(screen.getByText('my-text'))
  await waitFor(() => { expect(mathifyElement).toHaveBeenCalled() })
})
