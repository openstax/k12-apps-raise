import type { MathfieldElementAttributes, MathfieldElement } from 'mathlive'
import type { DOMAttributes } from 'react'

declare global {
  interface Window {
    Y?: {
      // This definition is stricter than the actual API but sufficient for our usage
      // Reference: https://clarle.github.io/yui3/yui/docs/api/classes/YUI.html#method_use
      use: (module: string, callback: () => void) => void
    }
    M?: {
      cfg: {
        courseId: number
        wwwroot: string
        sesskey: string
      }
    }
  }
  namespace JSX {
    interface IntrinsicElements {
      ['math-field']: Partial<MathfieldElementAttributes & DOMAttributes<MathfieldElement>>
    }
  }
}

export {}
