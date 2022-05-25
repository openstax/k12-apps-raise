import { BaseProblemProps, determineFeedback, NO_MORE_ATTEMPTS_MESSAGE } from './ProblemSetBlock'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { mathifyElement } from '../lib/math'
import React, { useCallback, useState } from 'react'
import * as Yup from 'yup'

interface DropdownProblemProps extends BaseProblemProps {
  solutionOptions: string
}

interface DropdownFormValues {
  response: string
}

export const DropdownProblem = ({
  solvedCallback, exhaustedCallback, allowedRetryCallback, content, buttonText, solutionOptions,
  encourageResponse, correctResponse, solution, retryLimit, answerResponses
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
  }, [])

  const clearFeedback = (): void => {
    setFeedback('')
  }

  const evaluateInput = (input: string, answer: string): boolean => {
    return input === answer
  }

  const handleSubmit = async (values: DropdownFormValues): Promise<void> => {
    if (values.response === solution) {
      setFeedback(correctResponse)
      solvedCallback()
      setFormDisabled(true)
    } else if (retryLimit === 0 || retriesAllowed !== retryLimit) {
      setRetriesAllowed(currRetries => currRetries + 1)
      setFeedback(determineFeedback(values.response, encourageResponse, answerResponses, evaluateInput))
      allowedRetryCallback()
    } else {
      exhaustedCallback()
      setFeedback(NO_MORE_ATTEMPTS_MESSAGE)
      setFormDisabled(true)
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
              className="os-form-select mb-3"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { clearFeedback(); setFieldValue('response', e.target.value) }}
            >
              {generateOptions()}
            </Field>
            <ErrorMessage className="text-danger my-3" component="div" name="response" />
            <button type="submit" disabled={isSubmitting || formDisabled} className="btn btn-outline-primary">{buttonText}</button>
            {feedback !== '' ? <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: feedback }} className="my-3" /> : null }
          </Form>
        )}
      </Formik>
    </div>
  )
}
