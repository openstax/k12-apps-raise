import type { BaseProblemProps } from "./ProblemSetBlock";
import { determineFeedback } from "../lib/problems";
import { useCallback, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { mathifyElement } from "../lib/math";
import * as Yup from "yup";
import Checkbox from "./CustomCheckbox";

interface MultipleChoiceProps extends BaseProblemProps {
  solutionOptions: string;
}

interface MultipleChoiceFormValues {
  response: string;
}

export const MultipleChoiceProblem = ({
  solvedCallback,
  exhaustedCallback,
  allowedRetryCallback,
  content,
  contentId,
  buttonText,
  answerResponses,
  solutionOptions,
  correctResponse,
  encourageResponse,
  solution,
  retryLimit,
  attemptsExhaustedResponse,
  onProblemAttempt,
}: MultipleChoiceProps): JSX.Element => {
  const [feedback, setFeedback] = useState("");
  const [formDisabled, setFormDisabled] = useState(false);
  const [retriesAllowed, setRetriesAllowed] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const parsedOptionValues: string[] = JSON.parse(solutionOptions);

  const schema = Yup.object({
    response: Yup.string().trim().required("Please select an answer"),
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

  const questionBoxShadow = `${formDisabled ? "os-raise-no-box-shadow " : ""}`;

  const generateOptions = (
    values: MultipleChoiceFormValues,
    isSubmitting: boolean,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  ): JSX.Element[] => {
    const options: JSX.Element[] = [];

    const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      clearFeedback();
      setFieldValue("response", e.target.value);
      setSelectedAnswer(e.target.value);
    };

    parsedOptionValues.forEach((val) =>
      options.push(
        <div
          key={val}
          className={`${questionBoxShadow} ${
            solution === val && formDisabled
              ? "os-raise-correct-answer-choice"
              : ""
          } ${
            solution !== val && formDisabled
              ? "os-raise-wrong-answer-choice"
              : ""
          } ${selectedAnswer === val ? "os-raise-selected-answer-choice" : ""}
           os-form-check os-raise-default-answer-choice`}
        >
          <Checkbox
            label={val}
            type="radio"
            clearFeedback={() => {
              clearFeedback();
            }}
            correct={solution === val}
            disabled={isSubmitting || formDisabled}
            onChange={onChange}
            showAnswer={showAnswers}
            selectedMultiChoice={values.response === val}
          />
        </div>
      )
    );

    return options;
  };

  const evaluateInput = (input: string, answer: string): boolean => {
    return input === answer;
  };

  const handleSubmit = async (
    values: MultipleChoiceFormValues
  ): Promise<void> => {
    let correct = false;
    let finalAttempt = false;
    const attempt = retriesAllowed + 1;

    if (evaluateInput(values.response, solution)) {
      correct = true;
      setFeedback(correctResponse);
      setShowAnswers(true);
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
      setShowAnswers(true);
      setRetriesAllowed((currRetries) => currRetries + 1);
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
        initialValues={{ response: "" }}
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
                className="btn btn-outline-primary"
                type="submit"
                disabled={isSubmitting || formDisabled}
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
              {retryLimit === 0 ? (
                <p className="os-raise-attempts-text">
                  Attempts left: Unlimited
                </p>
              ) : (
                <p className="os-raise-attempts-text">
                  {" "}
                  Attempts left: {retryLimit - retriesAllowed + 1}/
                  {retryLimit + 1}{" "}
                </p>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
