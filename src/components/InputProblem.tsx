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
  solution, retryLimit, content, comparitor, encourageResponse
}: InputProblemProps): JSX.Element => {
  const [numberOfRetries, setNumberOfRetries] = useState(0)
  const [inputDisabled, setInputDisabled] = useState(false)
  const [feedback, setFeedback] = useState('')

  const schema = (): Yup.SchemaOf<InputSchema> => {
    if (comparitor === 'integer') {
      return Yup.object({
        response: Yup.number().integer().required('Please provide an Integer')
      })
    }
    if (comparitor === 'float') {
      return Yup.object({
        response: Yup.number().required('Please provide a number')
      })
    }
    if (comparitor === 'text') {
      return Yup.object({
        response: Yup.string().trim().required('Please provide valid input')
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
    console.log(values.response)
    console.log(feedback)

    if (values.response === solution) {
      setFeedback('Correct!')
      console.log('After correct! ', feedback)

      solvedCallback()
      return
    }
    if (retryLimit === 0) {
      setFeedback('Try again')
      allowedRetryCallback()
      return
    }
    if (numberOfRetries === retryLimit) {
      setInputDisabled(true)
      setFeedback('No more attempts allowed')
      exhaustedCallback()
    } else {
      setNumberOfRetries(numberOfRetries + 1)
      setFeedback(`Try again ${retryLimit - numberOfRetries} retries left`)
      allowedRetryCallback()
    }
  }

  // const clearFeedback = (): void => {
  //   setFeedback('')
  // }

  return (
  <div className="os-raise-bootstrap">

    <div className="my-3" ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: content }} />
    <Formik
          initialValues={{ response: '' }}
          onSubmit={handleSubmit}
          validationSchema={schema()}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field name="response" as="textarea" disabled={inputDisabled} className="form-control my-3" />
              <ErrorMessage className="text-danger my-3" component="div" name="response" />
              <button type="submit" disabled={inputDisabled} className="btn btn-outline-primary">Submit</button>
              {feedback !== '' ? <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: feedback }} className="my-3" /> : null }

            </Form>
          )}
        </Formik>
  </div>)
}
