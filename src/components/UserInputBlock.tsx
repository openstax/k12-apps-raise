import { EventControlledContent } from './EventControlledContent'
import { Formik, Form, Field } from 'formik'
import { useState, useCallback } from 'react'
import { mathifyElement } from '../lib/math'

const DEFAULT_BUTTON_TEXT = 'Submit'

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

  const handleSubmit = async (values: InputFormValues): Promise<void> => {
    if (values.response === '') {
      return
    }

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
        >
          {({ isSubmitting }) => (
            <Form>
              <Field name="response" as="textarea" disabled={isSubmitting}/>
              <button type="submit" disabled={isSubmitting}>{buttonText !== undefined ? buttonText : DEFAULT_BUTTON_TEXT}</button>
            </Form>
          )}
        </Formik>
      )
  const maybeAck = !responseSubmitted
    ? null
    : (
      <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: ack }} />
      )

  return (
    <EventControlledContent waitForEvent={waitForEvent}>
      <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: content }} />
      {maybePrompt}
      {maybeInputForm}
      {maybeAck}
    </EventControlledContent>
  )
}
