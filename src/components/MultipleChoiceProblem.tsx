import type { BaseProblemProps } from './ProblemSetBlock'
import { determineFeedback } from '../lib/problems'
import { useCallback, useEffect, useState } from 'react'
import { Formik, Form, ErrorMessage, type FormikErrors, type FormikHelpers } from 'formik'
import { mathifyElement } from '../lib/math'
import * as Yup from 'yup'
import { FormSelectable } from './FormSelectable'
import { AttemptsCounter } from './AttemptsCounter'

interface MultipleChoiceProps extends BaseProblemProps {
  solutionOptions: string
}

interface MultipleChoiceFormValues {
  response: string
}

interface PersistorData {
  userResponse: string
  formDisabled: boolean
  retriesAllowed: number
  showAnswers: boolean
}

enum PersistorGetStatus {
  Uninitialized,
  Success,
  Failure
}

export function buildClassName(val: string, solution: string, response: string, showAnswers: boolean): string {
  let className = 'os-form-check os-default-answer-choice'

  if (solution === val && response === val && showAnswers) {
    className += ' os-correct-answer-choice'
  }

  if (solution !== val && response === val && showAnswers) {
    className += ' os-wrong-answer-choice'
  }

  if (showAnswers) {
    className += ' os-disabled'
  }

  if (response === val) {
    className += ' os-selected-answer-choice'
  }

  return className
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
  persistor
}: MultipleChoiceProps): JSX.Element => {
  const [feedback, setFeedback] = useState('')
  const [formDisabled, setFormDisabled] = useState(false)
  const [retriesAllowed, setRetriesAllowed] = useState(0)
  const [showAnswers, setShowAnswers] = useState(false)
  const parsedOptionValues: string[] = JSON.parse(solutionOptions)
  const [initialResponse, setInitialResponse] = useState('')
  const [persistorGetStatus, setPersistorGetStatus] = useState<number>(PersistorGetStatus.Uninitialized)

  const schema = Yup.object({
    response: Yup.string().trim().required('Please select an answer')
  })

  const contentRefCallback = useCallback(
    (node: HTMLDivElement | null): void => {
      if (node != null) {
        mathifyElement(node)
      }
    },
    [feedback]
  )

  const clearFeedback = (): void => {
    setFeedback('')
  }

  const generateOptions = (
    values: MultipleChoiceFormValues,
    isSubmitting: boolean,
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => Promise<void | FormikErrors<MultipleChoiceFormValues>>
  ): JSX.Element[] => {
    const options: JSX.Element[] = []

    const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      clearFeedback()
      void setFieldValue('response', e.target.value)
    }

    parsedOptionValues.forEach((val) =>
      options.push(
        <div
          key={val}
          className={buildClassName(val, solution, values.response, showAnswers)}
        >
          <FormSelectable
            label={val}
            type="radio"
            correct={solution === val}
            disabled={isSubmitting || formDisabled}
            onChange={onChange}
            showAnswer={showAnswers}
            selected={values.response === val}
          />
        </div>
      )
    )

    return options
  }

  const evaluateInput = (input: string, answer: string): boolean => {
    return input === answer
  }

  const handleFeedback = (userResponse: string, userAttempts: number): void => {
    if (userResponse === '') {
      return
    }

    if (evaluateInput(userResponse, solution)) {
      setFeedback(correctResponse)
    } else if (retryLimit === 0 || userAttempts !== retryLimit) {
      setFeedback(determineFeedback(userResponse, encourageResponse, answerResponses, evaluateInput))
    } else {
      setFeedback(attemptsExhaustedResponse)
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
        handleFeedback(parsedPersistedState.userResponse, parsedPersistedState.retriesAllowed > 0 ? parsedPersistedState.retriesAllowed - 1 : 0)
        setShowAnswers(parsedPersistedState.showAnswers)
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
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<MultipleChoiceFormValues>>
  ): Promise<void> => {
    try {
      if (contentId === undefined || persistor === undefined) {
        return
      }

      const newPersistedData: PersistorData = { userResponse: '', formDisabled: false, retriesAllowed: 0, showAnswers: false }
      await persistor.put(contentId, JSON.stringify(newPersistedData))
      setInitialResponse('')
      setFormDisabled(false)
      setRetriesAllowed(0)
      setShowAnswers(false)
      clearFeedback()
      void setFieldValue('response', '', false)
    } catch (err) {
      setFieldError('response', 'Error resetting question. Please try again.')
    }
  }

  const handleSubmit = async (
    values: MultipleChoiceFormValues, { setFieldError }: FormikHelpers<MultipleChoiceFormValues>
  ): Promise<void> => {
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
        await setPersistedState({ userResponse: values.response, formDisabled: true, retriesAllowed, showAnswers: true })
      } catch (error) {
        setFieldError('response', 'Error saving response. Please try again.')
        return
      }

      setShowAnswers(true)
      solvedCallback()
      setFormDisabled(true)
    } else if (retryLimit === 0 || retriesAllowed !== retryLimit) {
      try {
        await setPersistedState({ userResponse: values.response, formDisabled, retriesAllowed: retriesAllowed + 1, showAnswers })
      } catch (error) {
        setFieldError('response', 'Error saving response. Please try again.')
        return
      }

      setRetriesAllowed((currRetries) => currRetries + 1)
      allowedRetryCallback()
    } else {
      try {
        await setPersistedState({ userResponse: values.response, formDisabled: true, retriesAllowed: retriesAllowed + 1, showAnswers: true })
      } catch (error) {
        setFieldError('response', 'Error saving response. Please try again.')
        return
      }

      setShowAnswers(true)
      setRetriesAllowed((currRetries) => currRetries + 1)
      exhaustedCallback()
      setFormDisabled(true)
      finalAttempt = true
    }

    handleFeedback(values.response, retriesAllowed)

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
    <div className="os-raise-bootstrap" ref={contentRefCallback}>
      <div className="my-3" dangerouslySetInnerHTML={{ __html: content }} />
      <Formik
        initialValues={{ response: initialResponse }}
        onSubmit={handleSubmit}
        validationSchema={schema}
      >
        {({ isSubmitting, setFieldValue, values, setFieldError, setTouched }) => (
          <Form>
            <div className="os-grid">
              {generateOptions(values, isSubmitting, setFieldValue)}
            </div>
            <ErrorMessage
              className="text-danger my-3"
              component="div"
              name="response"
            />
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
            {feedback !== ''
              ? (
              <div
                ref={contentRefCallback}
                dangerouslySetInnerHTML={{ __html: feedback }}
                className="my-3 os-feedback-message"
              />
                )
              : null}
              <AttemptsCounter retryLimit={retryLimit} retriesAllowed={retriesAllowed}/>
          </Form>
        )}
      </Formik>
    </div>
  )
}
