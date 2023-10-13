import { useCallback, useEffect, useState } from 'react'
import { mathifyElement } from '../lib/math'
import { determineFeedback } from '../lib/problems'
import type { BaseProblemProps } from './ProblemSetBlock'
import { Formik, Form, ErrorMessage, type FormikErrors, type FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { FormSelectable } from './FormSelectable'
import { AttemptsCounter } from './AttemptsCounter'

interface MultiselectProps extends BaseProblemProps {
  solutionOptions: string
}

interface MultiselectFormValues {
  response: string[]
}

interface PersistorData {
  userResponse: string[]
  formDisabled: boolean
  retriesAllowed: number
  showAnswers: boolean
}

enum PersistorGetStatus {
  Uninitialized,
  Success,
  Failure
}

export function buildClassName(solutionArray: string[], showAnswers: boolean, val: string, values: { response: string[] }): string {
  let className = 'os-default-answer-choice'

  if (solutionArray.includes(val) && showAnswers) {
    className += ' os-correct-answer-choice'
  } else if (!solutionArray.includes(val) && values.response.includes(val) && showAnswers) {
    className += ' os-wrong-answer-choice'
  }

  if (showAnswers) {
    className += ' os-disabled'
  }

  if (values.response.includes(val)) {
    className += ' os-selected-answer-choice'
  }

  if (values.response.includes(val) && showAnswers) {
    className += ' os-form-check'
  }

  return className
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
  persistor
}: MultiselectProps): JSX.Element => {
  const [feedback, setFeedback] = useState('')
  const [formDisabled, setFormDisabled] = useState(false)
  const [retriesAllowed, setRetriesAllowed] = useState(0)
  const solutionArray: string[] = JSON.parse(solution)
  const parsedOptionValues: string[] = JSON.parse(solutionOptions)
  const [showAnswers, setShowAnswers] = useState(false)
  const [initialResponse, setInitialResponse] = useState<string[]>([])
  const [persistorGetStatus, setPersistorGetStatus] = useState<number>(PersistorGetStatus.Uninitialized)

  const schema = Yup.object({
    response: Yup.array().min(1, 'Please select an answer')
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

  const modifyModel = (
    values: MultiselectFormValues,
    e: React.ChangeEvent<HTMLInputElement>
  ): string[] => {
    const newSet = new Set(values.response)
    if (e.target.checked) {
      newSet.add(e.target.value)
    } else {
      newSet.delete(e.target.value)
    }
    return Array.from(newSet)
  }

  const generateOptions = (
    values: MultiselectFormValues,
    isSubmitting: boolean,
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => Promise<void | FormikErrors<MultiselectFormValues>>
  ): JSX.Element[] => {
    const options: JSX.Element[] = []
    const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => { clearFeedback(); void setFieldValue('response', modifyModel(values, e)) }

    parsedOptionValues.forEach(val => options.push(
      <div key={val} className={buildClassName(solutionArray, showAnswers, val, values)}>
        <FormSelectable label={val}
          type='checkbox'
          correct={solutionArray.includes(val)}
          disabled={isSubmitting || formDisabled}
          onChange={onChange}
          showAnswer={showAnswers}
          selected={values.response.includes(val)}
        />
      </div>
    ))

    return options
  }

  const evaluateInput = (input: string[], answer: string): boolean => {
    return compareForm(input, JSON.parse(answer))
  }

  const compareForm = (form: string[], solution: string[]): boolean => {
    if (form.length !== solution.length) {
      return false
    }
    for (let i = 0; i < solution.length; i++) {
      if (!solution.includes(form[i])) {
        return false
      }
    }
    return true
  }

  const handleFeedback = (userResponse: string[], userAttempts: number): void => {
    if (userResponse.length === 0) {
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
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<MultiselectFormValues>>
  ): Promise<void> => {
    try {
      if (contentId === undefined || persistor === undefined) {
        return
      }

      const newPersistedData: PersistorData = { userResponse: [], formDisabled: false, retriesAllowed: 0, showAnswers: false }
      await persistor.put(contentId, JSON.stringify(newPersistedData))
      setInitialResponse([])
      setFormDisabled(false)
      setRetriesAllowed(0)
      setShowAnswers(false)
      clearFeedback()
      void setFieldValue('response', [], false)
    } catch (err) {
      setFieldError('response', 'Error resetting question. Please try again.')
    }
  }

  const handleSubmit = async (values: MultiselectFormValues, { setFieldError }: FormikHelpers<MultiselectFormValues>): Promise<void> => {
    let correct = false
    let finalAttempt = false
    const attempt = retriesAllowed + 1

    const setPersistedState = async (persistorData: PersistorData): Promise<void> => {
      if (contentId === undefined || persistor === undefined) {
        return
      }
      await persistor.put(contentId, JSON.stringify(persistorData))
    }

    if (compareForm(values.response, solutionArray)) {
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
      setRetriesAllowed(currRetries => currRetries + 1)
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
            <div className='os-grid'>{generateOptions(values, isSubmitting, setFieldValue)}</div>
            <ErrorMessage className="text-danger my-3" component="div" name="response" />
            <div className='os-text-center mt-4 os-flex os-justify-space-evenly'>
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

            {feedback !== '' ? <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: feedback }} className="my-3 os-feedback-message" /> : null}
            <AttemptsCounter retryLimit={retryLimit} retriesAllowed={retriesAllowed} />
          </Form>
        )}
      </Formik>
    </div>
  )
}
