import { Field } from 'formik'
import { CorrectAnswerIcon, WrongAnswerIcon } from './Icons'
interface CheckboxProps {
  label: string
  type: string
  correct: boolean
  disabled: boolean
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
  const showCorrectAnswer =
    selected && correct && showAnswer
  const showWrongAnswer =
    selected && !correct && showAnswer

  return (
    <div className={`os-raise-flex os-raise-align-items-center ${showAnswer ? 'disabled' : ''}`}>
        {showCorrectAnswer
          ? <CorrectAnswerIcon />
          : <></>
        }
        {showWrongAnswer
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
