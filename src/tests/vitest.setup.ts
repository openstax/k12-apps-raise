import '@testing-library/jest-dom'
import { vi } from 'vitest'

window.mathVirtualKeyboard = {
  layouts: {}
} as any

vi.mock('mathlive', () => ({
  MathfieldElement: {
    fontsDirectory: '',
    soundsDirectory: null
  }
}))
