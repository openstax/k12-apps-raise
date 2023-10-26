import { useEffect, useRef } from 'react'
import { MathfieldElement } from 'mathlive'

MathfieldElement.fontsDirectory = 'https://unpkg.com/mathlive/dist/fonts/'
MathfieldElement.soundsDirectory = null
window.mathVirtualKeyboard.layouts = {
  rows: [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    [
      '\\sqrt{#@}', '\\sqrt[#?]{#@}', '#@^{#?}', '+', '-', '\\times', '\\frac{#@}{#?}', '|#@|', '(', ')'
    ],
    ['\\gt', '\\lt', '\\ge', '\\le', '=', '.', '\\pi', 'y', 'x']
  ]
}
interface MathfieldProps {
  onInput: (event: React.ChangeEvent<MathfieldElement>) => void
  className: string
  disabled: boolean
  value: string
}

export const Mathfield = ({ className, disabled, onInput, value }: MathfieldProps): JSX.Element => {
  const mathfieldRef = useRef<MathfieldElement>(null)
  useEffect(() => {
    const mathFieldCurrent = mathfieldRef.current
    if ((mathFieldCurrent === null)) {
      return
    }
    mathFieldCurrent.mathVirtualKeyboardPolicy = 'manual'
    mathFieldCurrent.minFontScale = 0.7
    mathFieldCurrent.addEventListener('focusin', (ev) => {
      window.mathVirtualKeyboard.show()
    })

    mathFieldCurrent.addEventListener('focusout', (ev) => {
      window.mathVirtualKeyboard.hide()
    })
  }, [])

  useEffect(() => {
    const mathFieldCurrent = mathfieldRef.current
    if ((mathFieldCurrent === null)) {
      return
    }

    if (disabled && mathFieldCurrent.shadowRoot !== null) {
      const pointerEventSpan = mathFieldCurrent.shadowRoot.querySelector('span')
      if (pointerEventSpan !== null && pointerEventSpan !== undefined) {
        pointerEventSpan.style.pointerEvents = 'none'
      }
    }

    if (!disabled && mathFieldCurrent.shadowRoot !== null) {
      const pointerEventSpan = mathFieldCurrent.shadowRoot.querySelector('span')
      if (pointerEventSpan !== null && pointerEventSpan !== undefined) {
        pointerEventSpan.style.pointerEvents = 'auto'
      }
    }
  }, [disabled])

  useEffect(() => {
    const mathFieldCurrent = mathfieldRef.current
    if ((mathFieldCurrent === null)) {
      return
    }

    mathFieldCurrent.value = value
  }, [value])

  return (
    <>
      <math-field
        class={className}
        ref={mathfieldRef}
        onInput={onInput}
        tabIndex={disabled ? '-1' : '0'}
      />
    </>
  )
}
