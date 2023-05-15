import { type FormEvent, useEffect, useRef } from 'react'
import { MathfieldElement } from 'mathlive'

// TODO: All of this setup should probably be organized differently / elsewhere. Just
// hacking around for now
MathfieldElement.fontsDirectory = ''
MathfieldElement.soundsDirectory = null
window.mathVirtualKeyboard.layouts = {
  rows: [
    [
      '+', '-', '\\times', '\\frac{#@}{#?}', '=', '.',
      '(', ')', '\\sqrt{#0}', '#@^{#?}'
    ],
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
  ]
}

window.mathVirtualKeyboard.addEventListener('geometrychange', (ev) => {
  // TODO: Not sure why, but this event doesn't fire when in React StrictMode after the keyboard initially appears to
  // resize when the undo, redo, ... buttons appear.
  if (window.mathVirtualKeyboard.container !== null) {
    window.mathVirtualKeyboard.container.style.height = `${window.mathVirtualKeyboard.boundingRect.height}px`
  }
})

interface MathfieldProps {
  onInput?: (event: FormEvent<MathfieldElement>) => void
  className?: string
  disabled?: boolean
}

export const Mathfield = ({ className, disabled, onInput }: MathfieldProps): JSX.Element => {
  const mathfieldRef = useRef<MathfieldElement>(null)
  const mathKeyboardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const maybeMathfield = mathfieldRef.current
    const maybeMathKeyboard = mathKeyboardRef.current
    if ((maybeMathfield === null) || (maybeMathKeyboard === null)) {
      return
    }

    maybeMathfield.addEventListener('focusout', (ev) => {
      maybeMathKeyboard.style.display = 'none'
      window.mathVirtualKeyboard.visible = false
    })

    maybeMathfield.addEventListener('focusin', (ev) => {
      window.mathVirtualKeyboard.container = maybeMathKeyboard

      const r = maybeMathfield.getBoundingClientRect()
      maybeMathKeyboard.style.display = 'block'
      const w = maybeMathKeyboard.offsetWidth
      maybeMathKeyboard.style.top = `${r.bottom + 16}px`
      maybeMathKeyboard.style.left = `${r.left + r.width / 2 - w / 2}px`
      maybeMathKeyboard.style.height = '500px'
      maybeMathKeyboard.style.width = '25vw'
      maybeMathKeyboard.style.minWidth = '320px'
      window.mathVirtualKeyboard.show()
    })
  }, [mathfieldRef, mathKeyboardRef])

  return (
    <div>
      <math-field
        class={className}
        ref={mathfieldRef}
        {...((disabled === true) ? { disabled: true } : {})}
        onInput={onInput} // TODO: Using onInput as for some reason onChange was not firing
      />
      <div ref={mathKeyboardRef} className='my-3'></div>
    </div>
  )
}
