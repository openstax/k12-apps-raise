import { Ref, useEffect, useRef } from 'react'
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
  buttonRef: React.RefObject<HTMLButtonElement>
}

export const Mathfield = ({ className, disabled, onInput, buttonRef }: MathfieldProps): JSX.Element => {
  const mathfieldRef = useRef<MathfieldElement>(null)
  const mathKeyboardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mathFieldCurrent = mathfieldRef.current
    const maybeMathKeyboard = mathKeyboardRef.current

    if ((mathFieldCurrent === null) || (maybeMathKeyboard === null)) {
      return
    }

    mathFieldCurrent.mathVirtualKeyboardPolicy = 'manual'
    mathFieldCurrent.minFontScale = 0.7
    mathFieldCurrent.addEventListener('focusin', (ev) => {
      window.mathVirtualKeyboard.container = maybeMathKeyboard
      const r = mathFieldCurrent.getBoundingClientRect()
      maybeMathKeyboard.style.display = 'block'
      const w = maybeMathKeyboard.offsetWidth
      maybeMathKeyboard.style.top = `${r.bottom + 16}px`
      maybeMathKeyboard.style.left = `${r.left + r.width / 2 - w / 2}px`
      maybeMathKeyboard.style.height = '310px'
      maybeMathKeyboard.style.width = '100%'
      window.mathVirtualKeyboard.show()
    })

    const handleFocusOut = (ev: FocusEvent): void => {
      console.log(ev)
      if ((ev.relatedTarget !== buttonRef.current) && (ev.isTrusted)) {
        maybeMathKeyboard.style.display = 'none'
        window.mathVirtualKeyboard.hide()
      }
    }

    mathFieldCurrent.addEventListener('focusout', handleFocusOut)
  }, [])

  useEffect(() => {
    const mathFieldCurrent = mathfieldRef.current
    const maybeMathKeyboard = mathKeyboardRef.current

    if ((mathFieldCurrent === null) || (maybeMathKeyboard === null)) {
      return
    }
    // if (disabled) {
    //   maybeMathKeyboard.style.display = 'none'
    //   window.mathVirtualKeyboard.hide()
    // }
    // if (!disabled) {
    //   window.mathVirtualKeyboard.container = maybeMathKeyboard
    //   const r = mathFieldCurrent.getBoundingClientRect()
    //   maybeMathKeyboard.style.display = 'block'
    //   const w = maybeMathKeyboard.offsetWidth
    //   maybeMathKeyboard.style.top = `${r.bottom + 16}px`
    //   maybeMathKeyboard.style.left = `${r.left + r.width / 2 - w / 2}px`
    //   maybeMathKeyboard.style.height = '310px'
    //   maybeMathKeyboard.style.width = '100%'
    //   window.mathVirtualKeyboard.show()
    // }

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

  return (
    <>
      <math-field
        class={className}
        ref={mathfieldRef}
        onInput={onInput}
        tabIndex={disabled ? '-1' : '0'}
      />
      <div ref={mathKeyboardRef}></div>
    </>
  )
}
