import { useCallback, useState } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik'

interface CheckboxProps {
  label: string
  type: string
  correct: boolean
  disabled: boolean
  clearFeedback: () => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  showAnswer: boolean
}

export const Checkbox = ({ label, type, correct, disabled, onChange, showAnswer }: CheckboxProps): JSX.Element => {
  const [checked, setChecked] = useState(false)

  return (
      <div className='checkbox' onClick={() => {}}>
        <label className="form-check-label os-raise-100-heigh-width">
        <Field
        className="form-check-input"
        type= {type === 'multichoice' ? 'checkbox' : 'radio' }
        name="response"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { onChange(e); setChecked(!checked) }}
        disabled={disabled}
        checked={checked}
        value={label}>
        </Field>
        {label}
        {/* Change logic for showing answer for multiple choice and multi choice. */}
        {correct && showAnswer && checked ? <span> ✅ </span> : <></>}
        {!correct && showAnswer && checked ? <span> ❌ </span> : <></>}

        </label>

      </div>
  )
}

export default Checkbox
