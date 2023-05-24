import { useCallback, useState } from 'react'
import { mathifyElement } from '../lib/math'
import { determineFeedback } from '../lib/problems'
import type { BaseProblemProps } from './ProblemSetBlock'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import Checkbox from './CustomCheckbox'

interface MultiselectProps extends BaseProblemProps {
  solutionOptions: string
}

interface MultiselectFormValues {
  response: string[]
}

export const MultiselectProblem = ({
  solvedCallback, exhaustedCallback, allowedRetryCallback, content, contentId, buttonText, solutionOptions,
  correctResponse, encourageResponse, solution, retryLimit, answerResponses, attemptsExhaustedResponse,
  onProblemAttempt
}: MultiselectProps): JSX.Element => {
  const [feedback, setFeedback] = useState('')
  const [formDisabled, setFormDisabled] = useState(false)
  const [retriesAllowed, setRetriesAllowed] = useState(0)
  const solutionArray: string[] = JSON.parse(solution)
  const parsedOptionValues: string[] = JSON.parse(solutionOptions)
  const [showAnswers, setShowAnswers] = useState(false)

  const schema = Yup.object({
    response: Yup.array().min(1, 'Please select an answer')
  })

  const contentRefCallback = useCallback((node: HTMLDivElement | null): void => {
    if (node != null) {
      mathifyElement(node)
    }
  }, [feedback])

  const clearFeedback = (): void => {
    setFeedback('')
  }

  const modifyModel = (values: MultiselectFormValues, e: React.ChangeEvent<HTMLInputElement>): string[] => {
    const newSet = new Set(values.response)
    if (e.target.checked) {
      newSet.add(e.target.value)
    } else {
      newSet.delete(e.target.value)
    }
    return Array.from(newSet)
  }

  const generateOptions = (values: MultiselectFormValues, isSubmitting: boolean, setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void): JSX.Element[] => {
    const options: JSX.Element[] = []

    const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => { clearFeedback(); setFieldValue('response', modifyModel(values, e)) }

    parsedOptionValues.forEach(val => options.push(
      <div key={val} className={`${solutionArray.includes(val) && showAnswers
          ? 'os-raise-correct-answer-choice os-raise-no-box-shadow'
          : ''
        } ${!solutionArray.includes(val) &&
          values.response.includes(val) &&
          showAnswers
          ? 'os-raise-wrong-answer-choice os-raise-no-box-shadow'
          : ''
        } ${values.response.includes(val)
          ? 'os-raise-selected-answer-choice'
          : ''
        } ${values.response.includes(val) && showAnswers
          ? 'os-form-check'
          : 'form-check'
        }
           os-raise-default-answer-choice`}
      >

        <Checkbox label={val}
          type='checkbox' clearFeedback={() => { clearFeedback() }}
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

  const handleSubmit = async (values: MultiselectFormValues): Promise<void> => {
    let correct = false
    let finalAttempt = false
    const attempt = retriesAllowed + 1
    if (compareForm(values.response, solutionArray)) {
      correct = true
      setFeedback(correctResponse)
      setShowAnswers(true)
      solvedCallback()
      setFormDisabled(true)
    } else if (retryLimit === 0 || retriesAllowed !== retryLimit) {
      setRetriesAllowed(currRetries => currRetries + 1)
      setFeedback(determineFeedback(values.response, encourageResponse, answerResponses, evaluateInput))
      allowedRetryCallback()
    } else {
      setShowAnswers(true)
      setRetriesAllowed(currRetries => currRetries + 1)
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
    <div className="os-raise-bootstrap" ref={contentRefCallback}>
      <div className="my-3" dangerouslySetInnerHTML={{ __html: content }} />
      <Formik
        initialValues={{ response: [] }}
        onSubmit={handleSubmit}
        validationSchema={schema}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <div className='os-raise-grid'>{generateOptions(values, isSubmitting, setFieldValue)}</div>
            <ErrorMessage className="text-danger my-3" component="div" name="response" />
            <div className='os-raise-text-center mt-4'>
              <button
                className="btn btn-outline-primary"
                type="submit"
                disabled={isSubmitting || formDisabled}
              >
                {buttonText}
              </button>
            </div>

            {feedback !== '' ? <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: feedback }} className="my-3 os-raise-feedback-message" /> : null}
            <div className="os-raise-d-flex os-raise-justify-content-end">
              {retryLimit === 0
                ? <p className="os-raise-attempts-text">
                  Attempts left: Unlimited
                </p>
                : <p className="os-raise-attempts-text">
                  Attempts left: {retryLimit - retriesAllowed + 1}/
                  {retryLimit + 1}
                </p>
              }
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
