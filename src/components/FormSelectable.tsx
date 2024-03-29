import { Field } from 'formik'
import { CorrectAnswerIcon, WrongAnswerIcon } from './Icons'
interface FormSelectableProps {
  label: string
  type: string
  correct: boolean
  disabled: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  showAnswer: boolean
  selected: boolean
}

export const FormSelectable = ({
  label,
  type,
  correct,
  disabled,
  onChange,
  showAnswer,
  selected
}: FormSelectableProps): JSX.Element => {
  const showCorrectAnswer =
    selected && correct && showAnswer
  const showWrongAnswer =
    selected && !correct && showAnswer

  return (
    <div className='os-flex os-align-items-center os-height-100'>
        {showCorrectAnswer
          ? <CorrectAnswerIcon className={'os-ml'} />
          : <></>
        }
        {showWrongAnswer
          ? <WrongAnswerIcon className={'os-ml'} />
          : <></>
        }
      <label className={`form-check-label os-label-container ${showAnswer ? 'os-no-cursor-pointer' : ''} ${type === 'checkbox' ? 'os-flex' : ''}`}>
      <Field
          className={`os-form-check-input ${type === 'radio' ? 'os-hide-input-button' : ''
            } ${type === 'checkbox' && selected && showAnswer
              ? 'os-hide-input-button'
              : ''
            }`}
          type={type}
          name="response"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => { onChange(e) }}
          disabled={disabled}
          value={label}
      >
      </Field>
        <span>{label}</span>
      </label>
    </div>
  )
}
