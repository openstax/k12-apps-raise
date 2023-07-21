import { useEffect, useRef } from 'react'
import { MathfieldElement } from 'mathlive'

MathfieldElement.fontsDirectory = ''
MathfieldElement.soundsDirectory = null
window.mathVirtualKeyboard.layouts = {
  // nth root not properly displaying in the calculator / input ('\\sqrt[#0]{#0}').
  rows: [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    [
      '\\sqrt{#0}', '#@^{#?}', '+', '-', '\\times', '\\frac{#@}{#?}', '|#0|', '\\sqrt[#0]{#0}', '(', ')'
    ],
    ['\\gt', '\\lt', '\\ge', '\\le', '=', '.', '\\pi', 'y', 'x']
  ]
}

interface MathfieldProps {
  onInput: (event: React.ChangeEvent<MathfieldElement>) => void
  className: string
  disabled: boolean
}

export const Mathfield = ({ className, disabled, onInput }: MathfieldProps): JSX.Element => {
  const mathfieldRef = useRef<MathfieldElement>(null)
  useEffect(() => {
    const mathFieldCurrent = mathfieldRef.current
    if ((mathFieldCurrent === null)) {
      return
    }
    mathFieldCurrent.mathVirtualKeyboardPolicy = 'manual'

    mathFieldCurrent.addEventListener('focusin', (ev) => {
      window.mathVirtualKeyboard.show()
    })

    mathFieldCurrent.addEventListener('focusout', (ev) => {
      window.mathVirtualKeyboard.hide()
    })

    if (disabled && mathFieldCurrent.shadowRoot !== null) {
      const pointerEventSpan = mathFieldCurrent.shadowRoot.querySelector('span')
      if (pointerEventSpan !== null && pointerEventSpan !== undefined) {
        pointerEventSpan.style.pointerEvents = 'none'
      }
    }
  }, [disabled])

  return (
    <>
      <math-field
        class={className}
        ref={mathfieldRef}
        onInput={onInput}
      />
    </>
  )
}
