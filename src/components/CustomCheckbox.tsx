import { useState } from "react";
import { Field } from "formik";

interface CheckboxProps {
  label: string;
  type: string;
  correct: boolean;
  disabled: boolean;
  clearFeedback: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showAnswer: boolean;
}

export const Checkbox = ({
  label,
  type,
  correct,
  disabled,
  onChange,
  showAnswer,
}: CheckboxProps): JSX.Element => {
  const [selected, setSelected] = useState(false);

  return (
    <div className="checkbox" onClick={() => {}}>
      <label className="form-check-label os-raise-fill-label-container">
        <Field
          className="os-form-check-input os-raise-hide-radio-button"
          type={type === "multichoice" ? "checkbox" : "radio"}
          name="response"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(e);
            if (type === "checkbox") {
              setSelected(!selected);
            }
          }}
          disabled={disabled}
          checked={type === "checkbox" ? selected : null}
          value={label}
        ></Field>
        {label}
        {/* Change logic for showing answer for multiple choice and multi choice. */}
        {correct && showAnswer && selected ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="green"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            />
          </svg>
        ) : (
          <></>
        )}
        {!correct && showAnswer && selected ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="red"
              d="M12 2c5.53 0 10 4.47 10 10s-4.47 10-10 10S2 17.53 2 12S6.47 2 12 2m3.59 5L12 10.59L8.41 7L7 8.41L10.59 12L7 15.59L8.41 17L12 13.41L15.59 17L17 15.59L13.41 12L17 8.41L15.59 7Z"
            />
          </svg>
        ) : (
          <></>
        )}
      </label>
    </div>
  );
};

export default Checkbox;
