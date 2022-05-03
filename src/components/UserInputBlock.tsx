import { EventControlledContent } from './EventControlledContent'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useState, useCallback } from 'react'
import { mathifyElement } from '../lib/math'
import * as Yup from 'yup'

const DEFAULT_BUTTON_TEXT = 'Submit'
const DEFAULT_TEXTAREA_ROWS = 3

interface UserInputBlockProps {
  content: string
  prompt: string
  ack: string
  waitForEvent?: string
  fireEvent?: string
  buttonText?: string
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
    }
  }, [])

  const maybePrompt = responseSubmitted
    ? null
    : (
        <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: prompt }} />
      )

  const maybeInputForm = responseSubmitted
    ? null
    : (
        <Formik
          initialValues={{ response: '' }}
          onSubmit={handleSubmit}
          validationSchema={schema}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field name="response" as="textarea" disabled={isSubmitting} rows={DEFAULT_TEXTAREA_ROWS} className="form-control my-3"/>
              <ErrorMessage className="text-danger my-3" component="div" name="response" />
              <button type="submit" disabled={isSubmitting} className="btn btn-outline-primary">{buttonText !== undefined ? buttonText : DEFAULT_BUTTON_TEXT}</button>
            </Form>
          )}
        </Formik>
      )

  const maybeAck = !responseSubmitted
    ? null
    : (
      < div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: ack }} />
      )

  return (
    <EventControlledContent waitForEvent={waitForEvent}>
      <div className="os-raise-bootstrap">
        <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: content }} />
        {maybePrompt}
        {maybeInputForm}
        {maybeAck}
      </div>
    </EventControlledContent>
  )
}