import { Field } from 'formik'
import { CorrectAnswerIcon, WrongAnswerIcon } from './Icons'
// select box
interface CheckboxProps {
  label: string
  type: string
  correct: boolean
  disabled: boolean
  clearFeedback: () => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  showAnswer: boolean
  selected: boolean
}

export const Checkbox = ({
  label,
  type,
  correct,
  disabled,
  onChange,
  showAnswer,
  selected
}: CheckboxProps): JSX.Element => {
  const selectedCorrectAnswer =
    selected && correct && showAnswer
  const selectedWrongAnswer =
    selected && !correct && showAnswer

  return (
    <div className="os-raise-flex os-raise-align-items-center">
        {selectedCorrectAnswer
          ? <CorrectAnswerIcon />
          : <></>
        }
        {selectedWrongAnswer
          ? <WrongAnswerIcon />
          : <></>
        }
      <label className={`form-check-label os-raise-fill-label-container ${showAnswer ? 'os-raise-no-cursor-pointer' : ''}`}>
        <Field
          className={`os-form-check-input ${type === 'radio' ? 'os-raise-hide-input-button' : ''
            } ${type === 'checkbox' && selected && showAnswer
              ? 'os-raise-hide-input-button'
              : ''
            }`}
          type={type}
          name="response"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => { onChange(e) }}
          disabled={disabled}
          value={label}
        ></Field>
        {label}

      </label>
    </div>
  )
}
