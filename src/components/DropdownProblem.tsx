import type { BaseProblemProps } from './ProblemSetBlock'
import { determineFeedback } from '../lib/problems'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { mathifyElement } from '../lib/math'
import React, { useCallback, useEffect, useState } from 'react'
import * as Yup from 'yup'
import { AttemptsCounter } from './AttemptsCounter'
import { CorrectAnswerIcon, WrongAnswerIcon } from './Icons'
import { type Persistor } from '../lib/persistor'

interface DropdownProblemProps extends BaseProblemProps {
  solutionOptions: string
  persistor?: Persistor
}

interface DropdownFormValues {
  response: string
}

interface PersistorData {
  userResponse: string
  formDisabled: boolean
  retriesAllowed: number
  feedback: string
}

enum PersistorGetStatus {
  Uninitialized,
  Success,
  Failure
}

export function buildClassName(response: string, solution: string, formDisabled: boolean): string {
  let className = 'os-form-select'
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
  const [response, setResponse] = useState('')
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

  const setPersistedState = async (): Promise<void> => {
    try {
      if (contentId === undefined || persistor === undefined) {
        return
      }

      if (response !== '' || formDisabled || retriesAllowed !== 0) {
        const newPersistedData: PersistorData = { userResponse: response, formDisabled, retriesAllowed, feedback }
        await persistor.put(contentId, JSON.stringify(newPersistedData))
      }
    } catch (err) {
      console.error(err)
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
        setResponse(parsedPersistedState.userResponse)
        setFormDisabled(parsedPersistedState.formDisabled)
        setRetriesAllowed(parsedPersistedState.retriesAllowed)
        setFeedback(parsedPersistedState.feedback)
      }
      setPersistorGetStatus(PersistorGetStatus.Success)
    } catch (err) {
      setPersistorGetStatus(PersistorGetStatus.Failure)
    }
  }

  useEffect(() => {
    setPersistedState().catch(() => { })
    getPersistedState().catch(() => { })
  }, [response, formDisabled, retriesAllowed])

  const handleSubmit = async (values: DropdownFormValues): Promise<void> => {
    let correct = false
    let finalAttempt = false
    const attempt = retriesAllowed + 1

    setResponse(values.response)

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
        enableReinitialize={true}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <div className='os-flex os-align-items-center'>
              {solution === response && formDisabled &&
                <div>
                  <CorrectAnswerIcon className={'os-mr'} />
                </div>
              }
              {solution !== response && formDisabled &&
                <div>
                  <WrongAnswerIcon className={'os-mr'} />
                </div>
              }
              <Field
                name="response"
                as="select"
                value={formDisabled ? response : values.response}
                disabled={isSubmitting || formDisabled}
                className={buildClassName(response, solution, formDisabled)}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { clearFeedback(); void setFieldValue('response', e.target.value) }}
              >
              {generateOptions()}
              </Field>
            </div>
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
