import { useEffect, useRef } from 'react'
import { MathfieldElement } from 'mathlive'

MathfieldElement.fontsDirectory = ''
MathfieldElement.soundsDirectory = null
window.mathVirtualKeyboard.layouts = {
  // nth root not properly displaying in the calculator / input ('\\sqrt[#0]{#0}').
  rows: [
    [
      '\\sqrt{#0}', '#@^{#?}', '+', '-', '\\times', '\\frac{#@}{#?}', '|#0|', '\\sqrt[#0]{#0}', '\\gt', '\\lt', '\\ge', '\\le', '=', '.', '\\pi'
    ],
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'y', 'x', '(', ')']
  ]
}

window.mathVirtualKeyboard.addEventListener('geometrychange', (ev) => {
  if (window.mathVirtualKeyboard.container !== null) {
    window.mathVirtualKeyboard.container.style.height = `${window.mathVirtualKeyboard.boundingRect.height}px`
  }
})

interface MathfieldProps {
  onChange: (event: React.ChangeEvent<MathfieldElement>) => void
  className: string
  disabled: boolean
}

export const Mathfield = ({ className, disabled, onChange }: MathfieldProps): JSX.Element => {
  const mathfieldRef = useRef<MathfieldElement>(null)
  const mathKeyboardRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const maybeMathfield = mathfieldRef.current
    const maybeMathKeyboard = mathKeyboardRef.current
    if ((maybeMathfield === null) || (maybeMathKeyboard === null)) {
      return
    }

    maybeMathfield.addEventListener('focusout', (ev) => {
      maybeMathKeyboard.style.minWidth = '0'
      maybeMathKeyboard.style.width = '0'
      window.mathVirtualKeyboard.hide()
    })

    maybeMathfield.addEventListener('focusin', (ev) => {
      window.mathVirtualKeyboard.container = maybeMathKeyboard
      maybeMathKeyboard.style.display = 'block'
      maybeMathKeyboard.style.minWidth = '320px'
      maybeMathKeyboard.style.width = '100%'
      window.mathVirtualKeyboard.show()
    })

    if (disabled && maybeMathfield.shadowRoot !== null) {
      const pointerEventSpan = maybeMathfield.shadowRoot.querySelector('span')
      if (pointerEventSpan !== null && pointerEventSpan !== undefined) {
        pointerEventSpan.style.pointerEvents = 'none'
      }
    }

    maybeMathfield.addEventListener('change', (ev) => {
      if (onChange !== undefined) {
        onChange(ev as unknown as React.ChangeEvent<MathfieldElement>) // RN: Yeah, this is a total hack but I didn't want to deal with it during the spike :joy:
      }
    })
  }, [mathfieldRef, mathKeyboardRef, disabled])

  return (
    <>
      <math-field
        class={className}
        ref={mathfieldRef}
      />
      <div ref={mathKeyboardRef}></div>
    </>
  )
}
