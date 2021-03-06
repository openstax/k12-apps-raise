import React, { useState, useCallback } from 'react'
import { BaseProblemProps } from './ProblemSetBlock'
import { determineFeedback } from '../lib/problems'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { mathifyElement } from '../lib/math'
import * as Yup from 'yup'

interface InputProblemProps extends BaseProblemProps {
  comparator: string
}

interface InputSchema {
  response: string | number
}

interface InputFormValues {
  response: string
}

export const InputProblem = ({
  solvedCallback, exhaustedCallback, allowedRetryCallback, attemptsExhaustedResponse,
  solution, retryLimit, content, comparator, encourageResponse, buttonText, correctResponse, answerResponses
}: InputProblemProps): JSX.Element => {
  const [retriesAllowed, setRetriesAllowed] = useState(0)
  const [inputDisabled, setInputDisabled] = useState(false)
  const [feedback, setFeedback] = useState('')

  const schema = (): Yup.SchemaOf<InputSchema> => {
    if (comparator.toLowerCase() === 'integer') {
      return Yup.object({
        response: Yup.number().integer('Please provide an Integer').typeError('Please provide an Integer').required('Please provide an Integer')
      })
    }
    if (comparator.toLowerCase() === 'float') {
      return Yup.object({
        response: Yup.number().typeError('Please provide an number').required('Please provide a number')
      })
    }
    return Yup.object({
      response: Yup.string().trim().required('Please provide valid input')
    })
  }

  const contentRefCallback = useCallback((node: HTMLDivElement | null): void => {
    if (node != null) {
      mathifyElement(node)
    }
  }, [feedback])

  const evaluateInput = (input: string, answer: string): boolean => {
    if (comparator.toLowerCase() === 'integer') {
      return parseInt(input) === parseInt(answer)
    }
    if (comparator.toLowerCase() === 'float') {
      return parseFloat(input) === parseFloat(answer)
    }

    return input.toLowerCase() === answer.toLowerCase()
  }

  const handleSubmit = async (values: InputFormValues): Promise<void> => {
    if (evaluateInput(values.response.trim(), solution.trim())) {
      setFeedback(correctResponse)
      solvedCallback()
      setInputDisabled(true)
    } else if (retryLimit === 0 || retriesAllowed !== retryLimit) {
      setRetriesAllowed(currRetries => currRetries + 1)
      setFeedback(determineFeedback(values.response, encourageResponse, answerResponses, evaluateInput))
      allowedRetryCallback()
    } else {
      setFeedback(attemptsExhaustedResponse)
      exhaustedCallback()
      setInputDisabled(true)
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
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form >
              <Field
              name="response"
              disabled={inputDisabled || isSubmitting}
              autoComplete={'off'}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => { clearFeedback(); setFieldValue('response', e.target.value) }}
              className="os-form-control mb-3" />
              <ErrorMessage className="text-danger mb-3" component="div" name="response" />
              <button type="submit" disabled={inputDisabled || isSubmitting} className="btn btn-outline-primary">{buttonText}</button>
              {feedback !== '' ? <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: feedback }} className="my-3" /> : null }

            </Form>
          )}
        </Formik>
  </div>)
}
