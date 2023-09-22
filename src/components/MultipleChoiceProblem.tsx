import type { BaseProblemProps } from './ProblemSetBlock'
import { determineFeedback } from '../lib/problems'
import { useCallback, useEffect, useState } from 'react'
import { Formik, Form, ErrorMessage, type FormikErrors } from 'formik'
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
  feedback: string
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
  const [response, setResponse] = useState('')
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
            selected={response === val}
          />
        </div>
      )
    )

    return options
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
        const newPersistedData: PersistorData = { userResponse: response, formDisabled, retriesAllowed, feedback, showAnswers }
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
        setShowAnswers(parsedPersistedState.showAnswers)
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

  const handleSubmit = async (
    values: MultipleChoiceFormValues
  ): Promise<void> => {
    let correct = false
    let finalAttempt = false
    const attempt = retriesAllowed + 1

    setResponse(values.response)

    if (evaluateInput(values.response, solution)) {
      correct = true
      setFeedback(correctResponse)
      setShowAnswers(true)
      solvedCallback()
      setFormDisabled(true)
    } else if (retryLimit === 0 || retriesAllowed !== retryLimit) {
      setRetriesAllowed((currRetries) => currRetries + 1)
      setFeedback(
        determineFeedback(
          values.response,
          encourageResponse,
          answerResponses,
          evaluateInput
        )
      )
      allowedRetryCallback()
    } else {
      setShowAnswers(true)
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
    <div className="os-raise-bootstrap" ref={contentRefCallback}>
      <div className="my-3" dangerouslySetInnerHTML={{ __html: content }} />
      <Formik
        initialValues={{ response }}
        onSubmit={handleSubmit}
        validationSchema={schema}
        enableReinitialize={true}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <div className="os-grid">
              {generateOptions(values, isSubmitting, setFieldValue)}
            </div>
            <ErrorMessage
              className="text-danger my-3"
              component="div"
              name="response"
            />
            <div className="os-text-center mt-4">
              <button
                className="os-btn btn-outline-primary"
                type="submit"
                disabled={isSubmitting || formDisabled}
              >
                {buttonText}
              </button>
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
