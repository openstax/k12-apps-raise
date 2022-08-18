import { EventControlledContent } from './EventControlledContent'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useState, useCallback } from 'react'
import { mathifyElement } from '../lib/math'
import * as Yup from 'yup'
import { tooltipify } from '../lib/tooltip'

const DEFAULT_TEXTAREA_ROWS = 2

interface UserInputBlockProps {
  content: string
  prompt: string
  ack: string
  waitForEvent?: string
  fireEvent?: string
  buttonText: string
}

interface InputFormValues {
  response: string
}

export const UserInputBlock = ({ content, prompt, ack, waitForEvent, fireEvent, buttonText }: UserInputBlockProps): JSX.Element => {
  const [responseSubmitted, setResponseSubmitted] = useState(false)

  const schema = Yup.object({
    response: Yup.string().trim().required('Please provide valid input')
  })

  const handleSubmit = async (values: InputFormValues): Promise<void> => {
    setResponseSubmitted(true)
    if (fireEvent !== undefined) {
      const submitEvent = new CustomEvent(fireEvent)
      document.dispatchEvent(submitEvent)
    }
  }

  const contentRefCallback = useCallback((node: HTMLDivElement | null): void => {
    if (node != null) {
      mathifyElement(node)
      tooltipify(node)
    }
  }, [])

  const maybePrompt = responseSubmitted
    ? null
    : (
        <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: prompt }} />
      )

  const maybeAck = !responseSubmitted
    ? null
    : (
      < div className='my-3' ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: ack }} />
      )

  return (
    <EventControlledContent waitForEvent={waitForEvent}>
      <div className="os-raise-bootstrap">
        <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: content }} />
        {maybePrompt}
        <Formik
          initialValues={{ response: '' }}
          onSubmit={handleSubmit}
          validationSchema={schema}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field name="response" as="textarea" disabled={isSubmitting || responseSubmitted} rows={DEFAULT_TEXTAREA_ROWS} className="form-control my-3"/>
              <ErrorMessage className="text-danger my-3" component="div" name="response" />
              <button type="submit" disabled={isSubmitting || responseSubmitted} className="btn btn-outline-primary">{buttonText}</button>
            </Form>
          )}
        </Formik>
        {maybeAck}
      </div>
    </EventControlledContent>
  )
}
