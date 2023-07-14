import { useEffect, useRef } from 'react'
import { MathfieldElement } from 'mathlive'

// TODO: All of this setup should probably be organized differently / elsewhere. Just
// hacking around for now
MathfieldElement.fontsDirectory = ''
MathfieldElement.soundsDirectory = null
window.mathVirtualKeyboard.layouts = {
  rows: [
    [
      '\\sqrt{#0}', '#@^{#?}', '+', '-', '\\times', '\\frac{#@}{#?}', '\\gt', '\\lt', '\\ge', '\\le', '=', '.', '\\pi'
    ],
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'y', 'x', '(', ')']
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
  onChange?: (event: React.ChangeEvent<MathfieldElement>) => void
  className?: string
  disabled?: boolean
}

export const Mathfield = ({ className, disabled, onChange }: MathfieldProps): JSX.Element => {
  const mathfieldRef = useRef<MathfieldElement>(null)
  const mathKeyboardRef = useRef<HTMLDivElement>(null)
  console.log(disabled)
  useEffect(() => {
    const maybeMathfield = mathfieldRef.current
    const maybeMathKeyboard = mathKeyboardRef.current
    if ((maybeMathfield === null) || (maybeMathKeyboard === null)) {
      return
    }
    maybeMathfield.style.width = '500px'

    maybeMathfield.addEventListener('focusout', (ev) => {
      maybeMathKeyboard.style.display = 'none'
      window.mathVirtualKeyboard.visible = false
    })

    maybeMathfield.addEventListener('focusin', (ev) => {
      window.mathVirtualKeyboard.container = maybeMathKeyboard
      const r = maybeMathfield.getBoundingClientRect()
      maybeMathKeyboard.style.display = 'block'
      const w = maybeMathKeyboard.offsetWidth
      maybeMathKeyboard.style.top = `${r.bottom + 1}px`
      maybeMathKeyboard.style.left = `${r.left + r.width / 2 - w / 2}px`
      maybeMathKeyboard.style.height = '600px'
      maybeMathKeyboard.style.width = '50vw'
      maybeMathKeyboard.style.minWidth = '320px'
      maybeMathKeyboard.style.maxWidth = '500px'
      window.mathVirtualKeyboard.show()
    })

    // Using an onChange in the element below did not work, so resorted to this for now
    maybeMathfield.addEventListener('change', (ev) => {
      if (onChange !== undefined) {
        onChange(ev as unknown as React.ChangeEvent<MathfieldElement>) // RN: Yeah, this is a total hack but I didn't want to deal with it during the spike :joy:
      }
    })
  }, [mathfieldRef, mathKeyboardRef, disabled])

  return (
    <div>
      <math-field
        class={className}
        // on change will not work.
        // onChange={onChange}
        ref={mathfieldRef}
        {...((disabled === true) ? { disabled: true } : {})}
      />
      <div ref={mathKeyboardRef} className='my-3'></div>
    </div>
  )
}
