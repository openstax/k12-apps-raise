import { EventControlledContent } from './EventControlledContent'
import { Formik, Form, Field } from 'formik'
import { useState } from 'react'

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

  const maybePrompt = responseSubmitted
    ? null
    : (
        <div dangerouslySetInnerHTML={{ __html: prompt }} />
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
              <Field name="response" disabled={isSubmitting}/>
              <button type="submit" disabled={isSubmitting}>{buttonText !== undefined ? buttonText : DEFAULT_BUTTON_TEXT}</button>
            </Form>
          )}
        </Formik>
      )
  const maybeAck = !responseSubmitted
    ? null
    : (
      <div dangerouslySetInnerHTML={{ __html: ack }} />
      )

  return (
    <EventControlledContent waitForEvent={waitForEvent}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      {maybePrompt}
      {maybeInputForm}
      {maybeAck}
    </EventControlledContent>
  )
}
