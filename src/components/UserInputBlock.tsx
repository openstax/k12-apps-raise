import { EventControlledContent } from './EventControlledContent'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useState, useCallback, useContext } from 'react'
import { mathifyElement } from '../lib/math'
import * as Yup from 'yup'
import { tooltipify } from '../lib/tooltip'
import { ContentLoadedContext } from '../lib/contexts'

const DEFAULT_TEXTAREA_ROWS = 2
export const MAX_CHARACTER_INPUT_BLOCK_LENGTH = 5000

interface UserInputBlockProps {
  content: string
  prompt: string
  ack: string
  waitForEvent?: string
  fireEvent?: string
  buttonText: string
  contentId?: string
  onInputSubmitted?: (
    contentId: string | undefined,
    variant: string | undefined,
    response: string,
    inputContentId: string | undefined
  ) => void
}

interface InputFormValues {
  response: string
}

export const UserInputBlock = ({ content, prompt, ack, waitForEvent, fireEvent, buttonText, contentId, onInputSubmitted }: UserInputBlockProps): JSX.Element => {
  const [responseSubmitted, setResponseSubmitted] = useState(false)
  const contentLoadedContext = useContext(ContentLoadedContext)

  const schema = Yup.object({
    response: Yup.string()
      .trim()
      .required('Please provide valid input')
      .max(MAX_CHARACTER_INPUT_BLOCK_LENGTH, 'Input is too long')
  })

  const handleSubmit = async (values: InputFormValues): Promise<void> => {
    setResponseSubmitted(true)
    if (fireEvent !== undefined) {
      const submitEvent = new CustomEvent(fireEvent)
      document.dispatchEvent(submitEvent)
    }
    if (onInputSubmitted !== undefined) {
      onInputSubmitted(
        contentLoadedContext.contentId,
        contentLoadedContext.variant,
        values.response,
        contentId
      )
    }
  }

  const contentRefCallback = useCallback((node: HTMLDivElement | null): void => {
    if (node != null) {
      mathifyElement(node)
      tooltipify(node)
    }
  }, [])

  const maybeAck = !responseSubmitted
    ? null
    : (
      < div className='mb-3' ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: ack }} />
      )

  return (
    <EventControlledContent waitForEvent={waitForEvent}>
      <div className="os-raise-bootstrap">
        <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: content }} />
        <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: prompt }} />
        <Formik
          initialValues={{ response: '' }}
          onSubmit={handleSubmit}
          validationSchema={schema}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field name="response" as="textarea" disabled={isSubmitting || responseSubmitted} rows={DEFAULT_TEXTAREA_ROWS} className="form-control my-3"/>
              <ErrorMessage className="text-danger my-3" component="div" name="response" />
              <div className='os-text-center mt-4'>
              <button type="submit" disabled={isSubmitting || responseSubmitted} className="os-btn btn-outline-primary">{buttonText}</button>
              </div>
            </Form>
          )}
        </Formik>
        {maybeAck}
      </div>
    </EventControlledContent>
  )
}
