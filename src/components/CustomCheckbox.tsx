import { Field } from 'formik'

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
  const selectedCorrectAnswer = selected && correct && showAnswer

  const selectedWrongAnswer = selected && !correct && showAnswer

  return (
    <div className="os-raise-flex os-raise-align-items-center">
      {selectedCorrectAnswer
        ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="os-raise-ml-1"
        >
          <path
            fill="#019920"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
          />
        </svg>
          )
        : (
        <></>
          )}
      {selectedWrongAnswer
        ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="os-raise-ml-1"
        >
          <path
            fill="#fc0516"
            d="M12 2c5.53 0 10 4.47 10 10s-4.47 10-10 10S2 17.53 2 12S6.47 2 12 2m3.59 5L12 10.59L8.41 7L7 8.41L10.59 12L7 15.59L8.41 17L12 13.41L15.59 17L17 15.59L13.41 12L17 8.41L15.59 7Z"
          />
        </svg>
          )
        : (
        <></>
          )}
      <label
        className={`form-check-label os-raise-fill-label-container ${
          showAnswer ? 'os-raise-no-cursor-pointer' : ''
        }`}
      >
        <Field
          className={`os-form-check-input ${
            type === 'radio' ? 'os-raise-hide-input-button' : ''
          } ${
            type === 'checkbox' && selected && showAnswer
              ? 'os-raise-hide-input-button'
              : ''
          }`}
          type={type}
          name="response"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(e)
          }}
          disabled={disabled}
          value={label}
        ></Field>
        {label}
      </label>
    </div>
  )
}
