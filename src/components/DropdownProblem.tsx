import type { BaseProblemProps } from './ProblemSetBlock'
import { determineFeedback } from '../lib/problems'
import { Formik, Form, Field, ErrorMessage, type FormikHelpers, type FormikErrors } from 'formik'
import { mathifyElement } from '../lib/math'
import React, { useCallback, useEffect, useState } from 'react'
import * as Yup from 'yup'
import { AttemptsCounter } from './AttemptsCounter'
import { CorrectAnswerIcon, WrongAnswerIcon } from './Icons'

interface DropdownProblemProps extends BaseProblemProps {
  solutionOptions: string
}

interface DropdownFormValues {
  response: string
}

interface PersistorData {
  userResponse: string
  formDisabled: boolean
  retriesAllowed: number
}

enum PersistorGetStatus {
  Uninitialized,
  Success,
  Failure
}

export function buildClassName(response: string, solution: string, formDisabled: boolean): string {
  let className = 'os-form-select'
  if (response !== '') {
    className += ' os-selected-answer-choice'
  }
  if (solution === response && formDisabled) {
    className += ' os-correct-answer-choice os-disabled'
  }
  if (solution !== response && formDisabled) {
    className += ' os-wrong-answer-choice os-disabled'
  }
  return className
}

export const DropdownProblem = ({
  solvedCallback, exhaustedCallback, allowedRetryCallback, content, contentId, buttonText, solutionOptions,
  encourageResponse, correctResponse, solution, retryLimit, answerResponses, attemptsExhaustedResponse,
  onProblemAttempt, persistor
}: DropdownProblemProps): JSX.Element => {
  const [feedback, setFeedback] = useState('')
  const [formDisabled, setFormDisabled] = useState(false)
  const [retriesAllowed, setRetriesAllowed] = useState(0)
  const [initialResponse, setInitialResponse] = useState('')
  const [persistorGetStatus, setPersistorGetStatus] = useState<number>(PersistorGetStatus.Uninitialized)

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

      const persistedState = await persistor.get(contentId)
      if (persistedState !== null) {
        const parsedPersistedState = JSON.parse(persistedState)
        setInitialResponse(parsedPersistedState.userResponse)
        setFormDisabled(parsedPersistedState.formDisabled)
        setRetriesAllowed(parsedPersistedState.retriesAllowed)
        handleProblemResult(
          parsedPersistedState.userResponse === solution,
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
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<DropdownFormValues>>
  ): Promise<void> => {
    try {
      if (contentId === undefined || persistor === undefined) {
        return
      }

      const newPersistedData: PersistorData = { userResponse: '', formDisabled: false, retriesAllowed: 0 }
      await persistor.put(contentId, JSON.stringify(newPersistedData))
      setFormDisabled(false)
      setRetriesAllowed(0)
      clearFeedback()
      void setFieldValue('response', '', false)
    } catch (err) {
      setFieldError('response', 'Error resetting question. Please try again.')
    }
  }

  const handleSubmit = async (values: DropdownFormValues, { setFieldError }: FormikHelpers<DropdownFormValues>): Promise<void> => {
    let correct = false
    let finalAttempt = false
    const attempt = retriesAllowed + 1

    const setPersistedState = async (persistorData: PersistorData): Promise<void> => {
      if (contentId === undefined || persistor === undefined) {
        return
      }
      await persistor.put(contentId, JSON.stringify(persistorData))
    }

    if (evaluateInput(values.response, solution)) {
      correct = true

      try {
        await setPersistedState({ userResponse: values.response, formDisabled: true, retriesAllowed })
      } catch (error) {
        setFieldError('response', 'Error saving response. Please try again.')
        return
      }

      setFormDisabled(true)
    } else if (retryLimit === 0 || retriesAllowed !== retryLimit) {
      try {
        await setPersistedState({ userResponse: values.response, formDisabled, retriesAllowed: retriesAllowed + 1 })
      } catch (error) {
        setFieldError('response', 'Error saving response. Please try again.')
        return
      }

      setRetriesAllowed(currRetries => currRetries + 1)
    } else {
      try {
        await setPersistedState({ userResponse: values.response, formDisabled: true, retriesAllowed: retriesAllowed + 1 })
      } catch (error) {
        setFieldError('response', 'Error saving response. Please try again.')
        return
      }

      setRetriesAllowed((currRetries) => currRetries + 1)
      setFormDisabled(true)
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
        initialValues={{ response: initialResponse }}
        onSubmit={handleSubmit}
        validationSchema={schema}
      >
        {({ isSubmitting, values, setFieldValue, setFieldError, setTouched }) => (
          <Form>
            <div className='os-flex os-align-items-center'>
              {solution === values.response && formDisabled &&
                <div>
                  <CorrectAnswerIcon className={'os-mr'} />
                </div>
              }
              {solution !== values.response && formDisabled &&
                <div>
                  <WrongAnswerIcon className={'os-mr'} />
                </div>
              }
              <Field
                name="response"
                as="select"
                value={values.response}
                disabled={isSubmitting || formDisabled}
                className={buildClassName(values.response, solution, formDisabled)}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { clearFeedback(); void setFieldValue('response', e.target.value) }}
              >
              {generateOptions()}
              </Field>
            </div>
            <ErrorMessage className="text-danger my-3" component="div" name="response" />
            <div className="os-text-center mt-4 os-flex os-justify-space-evenly">
              <button
                className="os-btn btn-outline-primary"
                type="submit"
                disabled={isSubmitting || formDisabled}
              >
                {buttonText}
              </button>
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
            {feedback !== '' ? <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: feedback }} className="my-3 os-feedback-message" /> : null }
            <AttemptsCounter retryLimit={retryLimit} retriesAllowed={retriesAllowed} />
          </Form>
        )}
      </Formik>
    </div>
  )
}
