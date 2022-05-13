import React, { useState, useCallback } from 'react'
import { BaseProblemProps } from './ProblemSetBlock'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { mathifyElement } from '../lib/math'
import * as Yup from 'yup'

interface InputProblemProps extends BaseProblemProps { }

interface InputSchema {
  response: string | number
}

interface InputFormValues {
  response: string
}

export const InputProblem = ({
  solvedCallback, exhaustedCallback, allowedRetryCallback,
  solution, retryLimit, content, comparitor, encourageResponse, buttonText, correctResponse
}: InputProblemProps): JSX.Element => {
  const [retriesAllowed, setRetriesAllowed] = useState(0)
  const [inputDisabled, setInputDisabled] = useState(false)
  const [feedback, setFeedback] = useState('')

  const schema = (): Yup.SchemaOf<InputSchema> => {
    if (comparitor === 'integer') {
      return Yup.object({
        response: Yup.number().integer().typeError('Please provide an Integer').required('Please provide an Integer')
      })
    }
    if (comparitor === 'float') {
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
  }, [])

  const handleSubmit = async (values: InputFormValues): Promise<void> => {
    if (values.response.trim() === solution.trim()) {
      console.log('solved callback')
      setFeedback(correctResponse)
      solvedCallback()
      setInputDisabled(true)
    } else if (retryLimit === 0 || retriesAllowed !== retryLimit) {
      setRetriesAllowed(currRetries => currRetries + 1)
      setFeedback(encourageResponse)
      allowedRetryCallback()
    } else {
      exhaustedCallback()
      setFeedback('No more attempts allowed')
      setInputDisabled(true)
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
          {({ isSubmitting }) => (
            <Form >
              <Field name="response" as="textarea" disabled={inputDisabled} className="form-control my-3" />
              <ErrorMessage className="text-danger my-3" component="div" name="response" />
              <button type="submit" disabled={inputDisabled} className="btn btn-outline-primary">{buttonText}</button>
              {feedback !== '' ? <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: feedback }} className="my-3" /> : null }

            </Form>
          )}
        </Formik>
  </div>)
}
