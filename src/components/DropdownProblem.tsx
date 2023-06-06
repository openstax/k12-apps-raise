import type { BaseProblemProps } from './ProblemSetBlock'
import { determineFeedback } from '../lib/problems'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { mathifyElement } from '../lib/math'
import React, { useCallback, useState } from 'react'
import * as Yup from 'yup'
import { AttemptsCounter } from './AttemptsCounter'

interface DropdownProblemProps extends BaseProblemProps {
  solutionOptions: string
}

interface DropdownFormValues {
  response: string
}

export function buildClassName(response: string, solution: string, formDisabled: boolean): string {
  let className = 'os-form-select mb-3'
  if (response !== '') {
    className += ' os-form-select-selected-answer-choice'
  }
  if (solution === response && formDisabled) {
    className += ' os-form-select-correct-answer-choice os-disabled'
  }
  if (solution !== response && formDisabled) {
    className += ' os-form-select-wrong-answer-choice os-disabled'
  }
  return className
}

export const DropdownProblem = ({
  solvedCallback, exhaustedCallback, allowedRetryCallback, content, contentId, buttonText, solutionOptions,
  encourageResponse, correctResponse, solution, retryLimit, answerResponses, attemptsExhaustedResponse,
  onProblemAttempt
}: DropdownProblemProps): JSX.Element => {
  const [feedback, setFeedback] = useState('')
  const [formDisabled, setFormDisabled] = useState(false)
  const [retriesAllowed, setRetriesAllowed] = useState(0)

  const schema = Yup.object({
    response: Yup.string().trim().required('Please select an answer')
  })

  const generateOptions = (): JSX.Element[] => {
    const options: JSX.Element[] = []
    const parsedOptionValues: string[] = JSON.parse(solutionOptions)

    options.push(<option key="initial" value="">Select an answer</option>)
    parsedOptionValues.forEach(val => options.push(<option key={val} value={val}>{val}</option>))

    return options
  }

  const contentRefCallback = useCallback((node: HTMLDivElement | null): void => {
    if (node != null) {
      mathifyElement(node)
    }
  }, [feedback])

  const clearFeedback = (): void => {
    setFeedback('')
  }

  const evaluateInput = (input: string, answer: string): boolean => {
    return input === answer
  }

  const handleSubmit = async (values: DropdownFormValues): Promise<void> => {
    let correct = false
    let finalAttempt = false
    const attempt = retriesAllowed + 1

    if (evaluateInput(values.response, solution)) {
      correct = true
      setFeedback(correctResponse)
      solvedCallback()
      setFormDisabled(true)
    } else if (retryLimit === 0 || retriesAllowed !== retryLimit) {
      setRetriesAllowed(currRetries => currRetries + 1)
      setFeedback(determineFeedback(values.response, encourageResponse, answerResponses, evaluateInput))
      allowedRetryCallback()
    } else {
      setRetriesAllowed((currRetries) => currRetries + 1)
      setFeedback(attemptsExhaustedResponse)
      exhaustedCallback()
      setFormDisabled(true)
      finalAttempt = true
    }

    if (onProblemAttempt !== undefined) {
      onProblemAttempt(
        values.response,
        correct,
        attempt,
        finalAttempt,
        contentId
      )
    }
  }

  return (
    <div className="os-raise-bootstrap">
      <div className="my-3" ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: content }} />
      <Formik
        initialValues={{ response: '' }}
        onSubmit={handleSubmit}
        validationSchema={schema}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <Field
              name="response"
              as="select"
              value={values.response}
              disabled={isSubmitting || formDisabled}
              className={buildClassName(values.response, solution, formDisabled)}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { clearFeedback(); setFieldValue('response', e.target.value) }}
            >
              {generateOptions()}
            </Field>
            <ErrorMessage className="text-danger my-3" component="div" name="response" />
            <div className="os-text-center mt-4">
              <button
                className="os-btn btn-outline-primary"
                type="submit"
                disabled={isSubmitting || formDisabled}
              >
                {buttonText}
              </button>
            </div>
            {feedback !== '' ? <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: feedback }} className="my-3 os-feedback-message" /> : null }
            <AttemptsCounter retryLimit={retryLimit} retriesAllowed={retriesAllowed} />
          </Form>
        )}
      </Formik>
    </div>
  )
}
