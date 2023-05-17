import { KeypadInput, LegacyKeypad } from '@khanacademy/math-input'
import { useState } from 'react'

interface MathfieldProps {
  onChange: (newValue: string) => void
}

export const Mathfield = ({ onChange }: MathfieldProps): JSX.Element => {
  const [keypadElement, setKeypadElement] = useState<any>(null)
  const [value, setValue] = useState('')

  return (
    <>
      <KeypadInput
        value={value}
        keypadElement={keypadElement}
        onChange={(newValue, callback) => {
          setValue(newValue)
          onChange(newValue)
          callback()
        }}
        onFocus={() => {
          keypadElement?.activate()
        }}
        onBlur={() => {
          keypadElement?.dismiss()
        }}
      />
      <LegacyKeypad
        onElementMounted={(node) => {
          if (node !== null && keypadElement === null) {
            setKeypadElement(node)
          }
        }}
      />
    </>
  )
}
