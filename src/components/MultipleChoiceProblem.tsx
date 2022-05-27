import { BaseProblemProps } from './ProblemSetBlock'
import { determineFeedback } from '../lib/problems'
import { useCallback, useState } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { mathifyElement } from '../lib/math'
import * as Yup from 'yup'

interface MultipleChoiceProps extends BaseProblemProps {
  solutionOptions: string
}

interface MultipleChoiceFormValues {
  response: string
}

export const MultipleChoiceProblem = ({
  solvedCallback, exhaustedCallback, allowedRetryCallback, content, buttonText, answerResponses, solutionOptions,
  correctResponse, encourageResponse, solution, retryLimit, attemptsExhaustedResponse
}: MultipleChoiceProps): JSX.Element => {
  const [feedback, setFeedback] = useState('')
  const [formDisabled, setFormDisabled] = useState(false)
  const [retriesAllowed, setRetriesAllowed] = useState(0)
  const parsedOptionValues: string[] = JSON.parse(solutionOptions)

  const schema = Yup.object({
    response: Yup.string().trim().required('Please select an answer')
  })

  const contentRefCallback = useCallback((node: HTMLDivElement | null): void => {
    if (node != null) {
      mathifyElement(node)
    }
  }, [feedback])

  const clearFeedback = (): void => {
    setFeedback('')
  }

  const generateOptions = (values: MultipleChoiceFormValues, isSubmitting: boolean, setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void): JSX.Element[] => {
    const options: JSX.Element[] = []

    parsedOptionValues.forEach(val => options.push(
    <div key={val} className="form-check">
      <label className="form-check-label">
        <Field
        className="form-check-input"
        type="radio"
        name="response"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { clearFeedback(); setFieldValue('response', e.target.value) }}
        disabled={isSubmitting || formDisabled}
        value={val}>
        </Field>
        {val}
      </label>
    </div>
    ))

    return options
  }

  const evaluateInput = (input: string, answer: string): boolean => {
    return input === answer
  }

  const handleSubmit = async (values: MultipleChoiceFormValues): Promise<void> => {
    if (evaluateInput(values.response, solution)) {
      setFeedback(correctResponse)
      solvedCallback()
      setFormDisabled(true)
    } else if (retryLimit === 0 || retriesAllowed !== retryLimit) {
      setRetriesAllowed(currRetries => currRetries + 1)
      setFeedback(determineFeedback(values.response, encourageResponse, answerResponses, evaluateInput))
      allowedRetryCallback()
    } else {
      setFeedback(attemptsExhaustedResponse)
      exhaustedCallback()
      setFormDisabled(true)
    }
  }

  return (
    <div className="os-raise-bootstrap" ref={contentRefCallback}>
      <div className="my-3" dangerouslySetInnerHTML={{ __html: content }} />
      <Formik
        initialValues={{ response: '' }}
        onSubmit={handleSubmit}
        validationSchema={schema}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            {generateOptions(values, isSubmitting, setFieldValue)}
            <ErrorMessage className="text-danger my-3" component="div" name="response" />
            <button type="submit" disabled={isSubmitting || formDisabled} className="btn btn-outline-primary">{buttonText}</button>
            {feedback !== '' ? <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: feedback }} className="my-3" /> : null }
          </Form>
        )}
      </Formik>
    </div>
  )
}
