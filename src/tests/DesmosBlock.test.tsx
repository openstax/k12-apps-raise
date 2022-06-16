import '@testing-library/jest-dom'
import { render, waitFor } from '@testing-library/react'
import { loadDesmos } from '../lib/desmos'
import { DesmosBlock } from '../components/DesmosBlock'

jest.mock('../lib/desmos.ts', () => ({
  loadDesmos: jest.fn(async () => {})
}))

test('Desmos block calls script and grahing calcultor functions', async () => {
  const setExpression = jest.fn()
  const setMathBounds = jest.fn()
  const graphingCalculator = jest.fn(() => {
    return {
      setExpression: setExpression,
      setMathBounds: setMathBounds
    }
  })
  window.Desmos = {
    GraphingCalculator: graphingCalculator
  } as any

  render(
      <DesmosBlock width={'500'} height={'500'} equations={'["x=5", "(1,2)"]'} expressions={'true'} scaleTop={'10'} scaleBottom={'-10'} scaleLeft={'-10'} scaleRight={'10'} />
  )

  expect(loadDesmos).toBeCalled()

  await waitFor(() => expect(graphingCalculator).toBeCalled())
  expect(setExpression).toBeCalled()
  expect(setMathBounds).toBeCalled()
})
