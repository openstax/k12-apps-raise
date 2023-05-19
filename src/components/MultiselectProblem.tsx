import { useCallback, useState } from "react";
import { mathifyElement } from "../lib/math";
import { determineFeedback } from "../lib/problems";
import type { BaseProblemProps } from "./ProblemSetBlock";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

interface MultiselectProps extends BaseProblemProps {
  solutionOptions: string;
}

interface MultiselectFormValues {
  response: string[];
}

export const MultiselectProblem = ({
  solvedCallback,
  exhaustedCallback,
  allowedRetryCallback,
  content,
  contentId,
  buttonText,
  solutionOptions,
  correctResponse,
  encourageResponse,
  solution,
  retryLimit,
  answerResponses,
  attemptsExhaustedResponse,
  onProblemAttempt,
}: MultiselectProps): JSX.Element => {
  const [feedback, setFeedback] = useState("");
  const [formDisabled, setFormDisabled] = useState(false);
  const [retriesAllowed, setRetriesAllowed] = useState(0);
  const solutionArray: string[] = JSON.parse(solution);
  const parsedOptionValues: string[] = JSON.parse(solutionOptions);

  const schema = Yup.object({
    response: Yup.array().min(1, "Please select an answer"),
  });

  const contentRefCallback = useCallback(
    (node: HTMLDivElement | null): void => {
      if (node != null) {
        mathifyElement(node);
      }
    },
    [feedback]
  );

  const clearFeedback = (): void => {
    setFeedback("");
  };

  const modifyModel = (
    values: MultiselectFormValues,
    e: React.ChangeEvent<HTMLInputElement>
  ): string[] => {
    const newSet = new Set(values.response);
    if (e.target.checked) {
      newSet.add(e.target.value);
    } else {
      newSet.delete(e.target.value);
    }
    return Array.from(newSet);
  };

  const generateOptions = (
    values: MultiselectFormValues,
    isSubmitting: boolean,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  ): JSX.Element[] => {
    const options: JSX.Element[] = [];

    parsedOptionValues.forEach((val) =>
      options.push(
        <div key={val} className="form-check os-raise-default-answer-choice">
          <label className="form-check-label os-raise-100-height-width os-test">
            <Field
              className="form-check-input os-form-check-input"
              type="checkbox"
              name="response"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                clearFeedback();
                setFieldValue("response", modifyModel(values, e));
              }}
              disabled={isSubmitting || formDisabled}
              value={val}
            ></Field>
            <span className="os-raise-ml">{val}</span>
          </label>
        </div>
      )
    );

    return options;
  };

  const evaluateInput = (input: string[], answer: string): boolean => {
    return compareForm(input, JSON.parse(answer));
  };

  const compareForm = (form: string[], solution: string[]): boolean => {
    if (form.length !== solution.length) {
      return false;
    }
    for (let i = 0; i < solution.length; i++) {
      if (!solution.includes(form[i])) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (values: MultiselectFormValues): Promise<void> => {
    let correct = false;
    let finalAttempt = false;
    const attempt = retriesAllowed + 1;

    if (compareForm(values.response, solutionArray)) {
      correct = true;
      setFeedback(correctResponse);
      console.log(correctResponse);
      solvedCallback();
      setFormDisabled(true);
    } else if (retryLimit === 0 || retriesAllowed !== retryLimit) {
      setRetriesAllowed((currRetries) => currRetries + 1);
      setFeedback(
        determineFeedback(
          values.response,
          encourageResponse,
          answerResponses,
          evaluateInput
        )
      );
      allowedRetryCallback();
    } else {
      setFeedback(attemptsExhaustedResponse);
      exhaustedCallback();
      setFormDisabled(true);
      finalAttempt = true;
    }

    if (onProblemAttempt !== undefined) {
      onProblemAttempt(
        values.response,
        correct,
        attempt,
        finalAttempt,
        contentId
      );
    }
  };

  return (
    <div className="os-raise-bootstrap" ref={contentRefCallback}>
      <div className="my-3" dangerouslySetInnerHTML={{ __html: content }} />
      <Formik
        initialValues={{ response: [] }}
        onSubmit={handleSubmit}
        validationSchema={schema}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <div className="os-raise-grid">
              {generateOptions(values, isSubmitting, setFieldValue)}
            </div>
            <ErrorMessage
              className="text-danger my-3"
              component="div"
              name="response"
            />
            <div className="os-raise-text-center mt-4">
              <button
                type="submit"
                disabled={isSubmitting || formDisabled}
                className="os-raise-button"
              >
                {buttonText}
              </button>
            </div>
            {feedback !== "" ? (
              <div
                ref={contentRefCallback}
                dangerouslySetInnerHTML={{ __html: feedback }}
                className="my-3 os-raise-feedback-message"
              />
            ) : null}
            <div className="os-raise-d-flex os-raise-justify-content-end">
              <span className="os-raise-attempts-text">attempts: 1/3</span>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
