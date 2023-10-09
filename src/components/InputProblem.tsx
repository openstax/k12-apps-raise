import React, { useState, useCallback } from 'react'
import type { BaseProblemProps } from './ProblemSetBlock'
import { determineFeedback, retriesRemaining } from '../lib/problems'
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik'
import { mathifyElement } from '../lib/math'
import * as Yup from 'yup'
import { AttemptsCounter } from './AttemptsCounter'
import { CorrectAnswerIcon, WrongAnswerIcon } from './Icons'
import { Mathfield } from './Mathfield'
import { type MathfieldElement } from 'mathlive'
import { parse, compare } from '@khanacademy/kas'
import { ComputeEngine } from '@cortex-js/compute-engine'
export const MAX_CHARACTER_INPUT_PROBLEM_LENGTH = 500

interface InputProblemProps extends BaseProblemProps {
  comparator: string
}

interface InputSchema {
  response?: string | number
}

interface InputFormValues {
  response: string
}

export function buildClassName(correct: boolean, formDisabled: boolean, errorResponse: string | undefined): string {
  let className = 'os-form-control'
  if (correct && formDisabled) {
    className += ' os-correct-answer-choice os-disabled'
  }
  if (!correct && formDisabled) {
    className += ' os-wrong-answer-choice os-disabled'
  }
  if (errorResponse !== undefined) {
    className += ' os-wrong-answer-choice'
  }
  return className
}

export const InputProblem = ({
  solvedCallback, exhaustedCallback, allowedRetryCallback, attemptsExhaustedResponse,
  solution, retryLimit, content, contentId, comparator, encourageResponse, buttonText, correctResponse, answerResponses, onProblemAttempt
}: InputProblemProps): JSX.Element => {
  const [retriesAllowed, setRetriesAllowed] = useState(0)
  const [inputDisabled, setInputDisabled] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [userResponseCorrect, setUserResponseCorrect] = useState(false)
  const NUMERIC_INPUT_ERROR = 'Enter numeric values only'
  const EXCEEDED_MAX_INPUT_ERROR = 'Input is too long'
  const NON_EMPTY_VALUE_ERROR = 'Please provide valid input'

  const schema = (): Yup.Schema<InputSchema> => {
    if (comparator.toLowerCase() === 'integer') {
      return Yup.object({
        response: Yup.number().integer(NUMERIC_INPUT_ERROR).typeError(NUMERIC_INPUT_ERROR)
      })
    }
    if (comparator.toLowerCase() === 'float') {
      return Yup.object({
        response: Yup.number().typeError(NUMERIC_INPUT_ERROR)
      })
    }
    return Yup.object({
      response: Yup.string().max(MAX_CHARACTER_INPUT_PROBLEM_LENGTH, EXCEEDED_MAX_INPUT_ERROR)
    })
  }

  const contentRefCallback = useCallback((node: HTMLDivElement | null): void => {
    if (node != null) {
      mathifyElement(node)
    }
  }, [feedback])

  const evaluateInput = (input: string, answer: string): boolean => {
    const trimmedInput = input.trim()
    const trimmedAnswer = answer.trim()
    if (comparator.toLowerCase() === 'integer') {
      return parseInt(trimmedInput) === parseInt(trimmedAnswer)
    }
    if (comparator.toLowerCase() === 'float') {
      return parseFloat(trimmedInput) === parseFloat(trimmedAnswer)
    }
    if (comparator.toLowerCase() === 'math') {
      const ce = new ComputeEngine()

      let parsedInput = parse(ce.serialize(ce.parse(trimmedInput)))
      let parsedAnswer = parse(ce.serialize(ce.parse(trimmedAnswer)))

      // Sometimes compute engine produces an output that the KAS parse method does not understand
      // If that is the case we can try to parse again with the raw trimmed input and answer
      // An example of an expression that requires this is x>5
      if (!parsedInput.parsed) {
        parsedInput = parse(trimmedInput)
      }
      if (!parsedAnswer.parsed) {
        parsedAnswer = parse(trimmedAnswer)
      }

      if (!parsedInput.parsed || !parsedAnswer.parsed) {
        return false
      }

      return compare(parsedInput.expr, parsedAnswer.expr, { simplify: false, form: true }).equal
    }
    return trimmedInput.toLowerCase() === trimmedAnswer.toLowerCase()
  }

  const handleFeedback = (correct: boolean, userAttempts: number): void => {
    if (correct) {
      setFeedback(correctResponse)
    } else if (retriesRemaining(retryLimit, userAttempts)) {
      setFeedback(determineFeedback(encourageResponse, answerResponses))
    } else {
      setFeedback(attemptsExhaustedResponse)
    }
  }

  const handleSubmit = async (values: InputFormValues, { setFieldError }: FormikHelpers<InputFormValues>): Promise<void> => {
    let correct = false
    let finalAttempt = false
    const attempt = retriesAllowed + 1

    if (values.response.trim() === '') {
      if ((comparator.toLowerCase() === 'integer') || (comparator.toLowerCase() === 'float')) {
        setFieldError('response', NUMERIC_INPUT_ERROR)
      } else {
        setFieldError('response', NON_EMPTY_VALUE_ERROR)
      }
      return
    }

    if (evaluateInput(values.response, solution)) {
      correct = true
      setUserResponseCorrect(true)
      solvedCallback()
      setInputDisabled(true)
    } else if (retriesRemaining(retryLimit, retriesAllowed)) {
      setRetriesAllowed(currRetries => currRetries + 1)
      allowedRetryCallback()
    } else {
      setRetriesAllowed(currRetries => currRetries + 1)
      exhaustedCallback()
      setInputDisabled(true)
      finalAttempt = true
    }

    handleFeedback(correct, retriesAllowed)
    handleFeedback(correct, retriesAllowed)

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
  const clearFeedback = (): void => {
    setFeedback('')
  }
  return (
  <div className="os-raise-bootstrap">

    <div className="my-3" ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: content }} />
    <Formik
          initialValues={{ response: '' }}
          onSubmit={handleSubmit}
          validationSchema={schema}
          validateOnBlur={false}
        >
          {({ isSubmitting, setFieldValue, values, errors }) => (
            <Form >
              <div className='os-flex os-align-items-center'>

                {userResponseCorrect && inputDisabled &&
                  <div>
                    <CorrectAnswerIcon className={'os-mr'} />
                  </div>
                }
                {!userResponseCorrect && inputDisabled &&
                  <div>
                    <WrongAnswerIcon className={'os-mr'} />
                  </div>
                }
              {
                comparator.toLowerCase() === 'math'
                  ? (
                  <Field
                    name="response"
                    disabled={inputDisabled || isSubmitting}
                    as={Mathfield}
                    onInput={(e: React.ChangeEvent<MathfieldElement>): void => { clearFeedback(); void setFieldValue('response', e.target.value) }}
                    className={buildClassName(userResponseCorrect, inputDisabled || isSubmitting, errors.response)} />
                    )
                  : (
                    <Field
                    name="response"
                    disabled={inputDisabled || isSubmitting}
                    autoComplete={'off'}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => { clearFeedback(); void setFieldValue('response', e.target.value) }}
                    className={buildClassName(userResponseCorrect, inputDisabled || isSubmitting, errors.response)} />
                    )
              }
              </div>
              <ErrorMessage className="text-danger my-3" component="div" name="response" />
              <div className="os-text-center mt-4">
              <button type="submit" disabled={inputDisabled || isSubmitting} className="os-btn btn-outline-primary">{buttonText}</button></div>
              {feedback !== '' ? <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: feedback }} className="my-3 os-feedback-message" /> : null}
              <AttemptsCounter retryLimit={retryLimit} retriesAllowed={retriesAllowed}/>
            </Form>
          )}
        </Formik>
  </div>)
}
