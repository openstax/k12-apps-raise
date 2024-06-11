import '@testing-library/jest-dom'
import { vi } from 'vitest'

window.mathVirtualKeyboard = {
  layouts: {}
}

vi.mock('mathlive', () => ({
  MathfieldElement: {
    fontsDirectory: '',
    soundsDirectory: null
  }
}))
