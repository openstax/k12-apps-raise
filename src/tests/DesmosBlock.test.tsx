import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { loadDesmos } from '../lib/desmos'
import { DesmosBlock } from '../components/DesmosBlock'

jest.mock('../lib/desmos.ts', () => ({
  loadDesmos: jest.fn()
}))
jest.mock('Desmos', () => ({
  GraphingCalculator: jest.fn()
}))

test('Desmos block calls script', async () => {
  render(
      <DesmosBlock width={'500'} height={'500'} equations={'["x=5", "(1,2)"]'} expressions={'true'} scaleTop={'10'} scaleBottom={'-10'} scaleLeft={'-10'} scaleRight={'10'} />
  )
  expect(loadDesmos).toBeCalled()
})
