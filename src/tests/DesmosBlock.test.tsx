
import { render, waitFor, fireEvent } from '@testing-library/react'
import { loadDesmos } from '../lib/desmos'
import { DesmosBlock } from '../components/DesmosBlock'
import { vi, test, expect } from 'vitest'

vi.mock('../lib/desmos.ts', () => ({
  loadDesmos: vi.fn(async () => {})
}))

test('Desmos block calls script and graphing calculator functions', async () => {
  const setExpression = vi.fn()
  const setMathBounds = vi.fn()
  const setDefaultState = vi.fn()
  const getState = vi.fn()
  const graphingCalculator = vi.fn(() => {
    return {
      setExpression,
      setMathBounds,
      setDefaultState,
      getState
    }
  })
  window.Desmos = {
    GraphingCalculator: graphingCalculator
  } as any

  render(
      <DesmosBlock width={'500'} height={'500'} equations={'["x=5", "(1,2)"]'} tables='[[{"variable": "x_1", "values": [1, 2]}, {"variable": "y_1", "values": [3, 5]}]]' disableExpressions={false} scaleTop={'10'} scaleBottom={'-10'} scaleLeft={'-10'} scaleRight={'10'} />
  )

  expect(loadDesmos).toHaveBeenCalled()

  await waitFor(() => { expect(graphingCalculator).toHaveBeenCalled() })
  expect(setExpression).toHaveBeenCalled()
  expect(setMathBounds).toHaveBeenCalled()
  expect(setDefaultState).toHaveBeenCalled()
  expect(getState).toHaveBeenCalled()
})

test('DesmosBlock does not render if waitForEvent does not fire', async () => {
  const setExpression = vi.fn()
  const setMathBounds = vi.fn()
  const setDefaultState = vi.fn()
  const getState = vi.fn()
  const graphingCalculator = vi.fn(() => {
    return {
      setExpression,
      setMathBounds,
      setDefaultState,
      getState
    }
  })
  window.Desmos = {
    GraphingCalculator: graphingCalculator
  } as any

  render(
      <DesmosBlock waitForEvent='event' width={'500'} height={'500'} equations={'["x=5", "(1,2)"]'} tables='[[{"variable": "x_1", "values": [1, 2]}, {"variable": "y_1", "values": [3, 5]}]]' disableExpressions={false} scaleTop={'10'} scaleBottom={'-10'} scaleLeft={'-10'} scaleRight={'10'} />
  )

  expect(loadDesmos).toHaveBeenCalled()

  await waitFor(() => { expect(graphingCalculator).not.toHaveBeenCalled() })
  expect(setExpression).not.toHaveBeenCalled()
  expect(setMathBounds).not.toHaveBeenCalled()
  expect(setDefaultState).not.toHaveBeenCalled()
  expect(getState).not.toHaveBeenCalled()
})

test('DesmosBlock calculator does render if waitForEvent does fire', async () => {
  const setExpression = vi.fn()
  const setMathBounds = vi.fn()
  const setDefaultState = vi.fn()
  const getState = vi.fn()
  const graphingCalculator = vi.fn(() => {
    return {
      setExpression,
      setMathBounds,
      setDefaultState,
      getState
    }
  })
  window.Desmos = {
    GraphingCalculator: graphingCalculator
  } as any

  render(
      <DesmosBlock waitForEvent='event' width={'500'} height={'500'} equations={'["x=5", "(1,2)"]'} tables='[[{"variable": "x_1", "values": [1, 2]}, {"variable": "y_1", "values": [3, 5]}]]'
      disableExpressions={false} scaleTop={'10'} scaleBottom={'-10'} scaleLeft={'-10'} scaleRight={'10'} />
  )

  expect(loadDesmos).toHaveBeenCalled()

  fireEvent(document, new CustomEvent('event'))

  await waitFor(() => { expect(graphingCalculator).toHaveBeenCalled() })
  expect(setExpression).toHaveBeenCalled()
  expect(setMathBounds).toHaveBeenCalled()
  expect(setDefaultState).toHaveBeenCalled()
  expect(getState).toHaveBeenCalled()
})
