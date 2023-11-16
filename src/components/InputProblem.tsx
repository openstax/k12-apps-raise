import React, { useState, useCallback, useEffect } from 'react'
import type { BaseProblemProps } from './ProblemSetBlock'
import { determineFeedback } from '../lib/problems'
import { Formik, Form, Field, ErrorMessage, type FormikHelpers, type FormikErrors } from 'formik'
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

interface PersistorData {
  userResponse: string
  inputDisabled: boolean
  retriesAllowed: number
}

enum PersistorGetStatus {
  Uninitialized,
  Success,
  Failure
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
  solvedCallback, exhaustedCallback, allowedRetryCallback, resetCallback, attemptsExhaustedResponse,
  solution, retryLimit, content, contentId, comparator, encourageResponse, buttonText, correctResponse, answerResponses, onProblemAttempt,
  persistor
}: InputProblemProps): JSX.Element => {
  const [retriesAllowed, setRetriesAllowed] = useState(0)
  const [inputDisabled, setInputDisabled] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [response, setResponse] = useState('')
  const [persistorGetStatus, setPersistorGetStatus] = useState<number>(PersistorGetStatus.Uninitialized)
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

  const handleProblemResult = (correct: boolean, userAttempts: number, userResponse: string): void => {
    if (userResponse === '') {
      return
    }

    if (correct) {
      setFeedback(correctResponse)
      solvedCallback()
    } else if (retryLimit === 0 || userAttempts !== retryLimit) {
      setFeedback(determineFeedback(userResponse, encourageResponse, answerResponses, evaluateInput))
      allowedRetryCallback()
    } else {
      setFeedback(attemptsExhaustedResponse)
      exhaustedCallback()
    }
  }

  const getPersistedState = async (): Promise<void> => {
    try {
      if (contentId === undefined || persistor === undefined) {
        setPersistorGetStatus(PersistorGetStatus.Success)
        return
      }

      const persistedState = await persistor.get(contentId, '1')
      if (persistedState !== null) {
        const parsedPersistedState = JSON.parse(persistedState)
        setResponse(parsedPersistedState.userResponse)
        setInputDisabled(parsedPersistedState.inputDisabled)
        setRetriesAllowed(parsedPersistedState.retriesAllowed)
        handleProblemResult(
          evaluateInput(parsedPersistedState.userResponse, solution),
          parsedPersistedState.retriesAllowed > 0 ? parsedPersistedState.retriesAllowed - 1 : 0,
          parsedPersistedState.userResponse
        )
      }
      setPersistorGetStatus(PersistorGetStatus.Success)
    } catch (err) {
      setPersistorGetStatus(PersistorGetStatus.Failure)
    }
  }

  useEffect(() => {
    getPersistedState().catch(() => { })
  }, [])

  const resetPersistedState = async (
    setFieldError: (field: string, message: string) => void,
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<InputFormValues>>
  ): Promise<void> => {
    try {
      if (contentId === undefined || persistor === undefined) {
        return
      }

      const newPersistedData: PersistorData = { userResponse: '', inputDisabled: false, retriesAllowed: 0 }
      await persistor.put(contentId, JSON.stringify(newPersistedData), '1')
      setInputDisabled(false)
      setRetriesAllowed(0)
      clearFeedback()
      resetCallback()
      void setFieldValue('response', '', false)
    } catch (err) {
      setFieldError('response', 'Error resetting question. Please try again.')
    }
  }

  const handleSubmit = async (values: InputFormValues, { setFieldError }: FormikHelpers<InputFormValues>): Promise<void> => {
    let correct = false
    let finalAttempt = false
    const attempt = retriesAllowed + 1

    const setPersistedState = async (persistorData: PersistorData): Promise<void> => {
      if (contentId === undefined || persistor === undefined) {
        return
      }
      await persistor.put(contentId, JSON.stringify(persistorData), '1')
    }

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

      try {
        await setPersistedState({ userResponse: values.response, inputDisabled: true, retriesAllowed })
      } catch (error) {
        setFieldError('response', 'Error saving response. Please try again.')
        return
      }

      setInputDisabled(true)
    } else if (retryLimit === 0 || retriesAllowed !== retryLimit) {
      try {
        await setPersistedState({ userResponse: values.response, inputDisabled, retriesAllowed: retriesAllowed + 1 })
      } catch (error) {
        setFieldError('response', 'Error saving response. Please try again.')
        return
      }

      setRetriesAllowed(currRetries => currRetries + 1)
    } else {
      try {
        await setPersistedState({ userResponse: values.response, inputDisabled: true, retriesAllowed: retriesAllowed + 1 })
      } catch (error) {
        setFieldError('response', 'Error saving response. Please try again.')
        return
      }

      setRetriesAllowed(currRetries => currRetries + 1)
      setInputDisabled(true)
      finalAttempt = true
    }

    handleProblemResult(correct, retriesAllowed, values.response)

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

  if (persistorGetStatus === PersistorGetStatus.Failure) {
    return (
      <div className="os-raise-bootstrap">
        <div className="text-center">
          <span className="text-danger">There was an error loading content. Please try refreshing the page.</span>
        </div>
      </div>
    )
  }

  if (persistorGetStatus === PersistorGetStatus.Uninitialized) {
    return (
      <div className="os-raise-bootstrap">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
  <div className="os-raise-bootstrap">

    <div className="my-3" ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: content }} />
    <Formik
          initialValues={{ response }}
          onSubmit={handleSubmit}
          validationSchema={schema}
          validateOnBlur={false}
        >
          {({ isSubmitting, setFieldValue, values, errors, setFieldError, setTouched }) => (
            <Form >
              <div className='os-flex os-align-items-center'>

                {evaluateInput(values.response, solution) && inputDisabled &&
                  <div>
                    <CorrectAnswerIcon className={'os-mr'} />
                  </div>
                }
                {!evaluateInput(values.response, solution) && inputDisabled &&
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
                    className={buildClassName(evaluateInput(values.response, solution), inputDisabled || isSubmitting, errors.response)} />
                    )
                  : (
                    <Field
                    name="response"
                    disabled={inputDisabled || isSubmitting}
                    autoComplete={'off'}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => { clearFeedback(); void setFieldValue('response', e.target.value) }}
                    className={buildClassName(evaluateInput(values.response, solution), inputDisabled || isSubmitting, errors.response)} />
                    )
              }
              </div>
              <ErrorMessage className="text-danger my-3" component="div" name="response" />
              <div className="os-text-center mt-4 os-flex os-justify-space-evenly">
                <button type="submit" disabled={inputDisabled || isSubmitting} className="os-btn btn-outline-primary">{buttonText}</button>
                {
                  (persistor !== undefined) &&
                  <button
                    type="button"
                    onClick={(): void => {
                      void resetPersistedState(setFieldError, setFieldValue)
                      void setTouched({ response: true }, false)
                    }}
                    className="os-btn btn-outline-primary"
                  >
                    Reset
                  </button>
                }
              </div>
              {feedback !== '' ? <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: feedback }} className="my-3 os-feedback-message" /> : null}
              <AttemptsCounter retryLimit={retryLimit} retriesAllowed={retriesAllowed}/>
            </Form>
          )}
        </Formik>
  </div>)
}
