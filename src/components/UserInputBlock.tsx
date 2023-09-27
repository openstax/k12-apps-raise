import { EventControlledContent } from './EventControlledContent'
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik'
import { useState, useCallback, useContext, useEffect } from 'react'
import { mathifyElement } from '../lib/math'
import * as Yup from 'yup'
import { tooltipify } from '../lib/tooltip'
import { ContentLoadedContext } from '../lib/contexts'
import { type Persistor } from '../lib/persistor'

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
  persistor?: Persistor
}

interface InputFormValues {
  response: string
}

interface PersistorData {
  userResponse: string
  responseSubmitted: boolean
}

enum PersistorGetStatus {
  Uninitialized,
  Success,
  Failure
}

export function buildClassName(formDisabled: boolean, errorResponse: string | undefined): string {
  let className = 'os-form-control'
  if (formDisabled) {
    className += ' os-textarea-disabled'
  }
  if (errorResponse !== undefined) {
    className += ' os-wrong-answer-choice'
  }
  return className
}

export const UserInputBlock = ({ content, prompt, ack, waitForEvent, fireEvent, buttonText, contentId, onInputSubmitted, persistor }: UserInputBlockProps): JSX.Element => {
  const [responseSubmitted, setResponseSubmitted] = useState(false)
  const [initialResponse, setInitialResponse] = useState('')
  const [persistorGetStatus, setPersistorGetStatus] = useState<number>(PersistorGetStatus.Uninitialized)
  const contentLoadedContext = useContext(ContentLoadedContext)
  const NON_EMPTY_VALUE_ERROR = 'Please provide valid input'
  const EXCEEDED_MAX_INPUT_ERROR = 'Input is too long'

  const schema = Yup.object({
    response: Yup.string()
      .max(MAX_CHARACTER_INPUT_BLOCK_LENGTH, EXCEEDED_MAX_INPUT_ERROR)
  })

  const getPersistedState = async (): Promise<void> => {
    try {
      if (contentId === undefined || persistor === undefined) {
        setPersistorGetStatus(PersistorGetStatus.Success)
        return
      }

      const persistedState = await persistor.get(contentId)
      if (persistedState !== null) {
        const parsedPersistedState = JSON.parse(persistedState)
        setInitialResponse(parsedPersistedState.userResponse)
        setResponseSubmitted(parsedPersistedState.responseSubmitted)
      }
      setPersistorGetStatus(PersistorGetStatus.Success)
    } catch (err) {
      setPersistorGetStatus(PersistorGetStatus.Failure)
    }
  }

  useEffect(() => {
    getPersistedState().catch(() => { })
  }, [])

  const handleSubmit = async (values: InputFormValues, { setFieldError }: FormikHelpers<InputFormValues>): Promise<void> => {
    if (values.response.trim() === '') {
      setFieldError('response', NON_EMPTY_VALUE_ERROR)
      return
    }

    try {
      if (contentId !== undefined && persistor !== undefined) {
        const newPersistedData: PersistorData = { userResponse: values.response, responseSubmitted: true }
        await persistor.put(contentId, JSON.stringify(newPersistedData))
      }
    } catch (error) {
      setFieldError('response', 'Error saving response. Please try again.')
      return
    }

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
      tooltipify(node).catch((error) => { console.error(error) })
    }
  }, [])

  const maybeAck = !responseSubmitted
    ? null
    : (
      < div className='my-3 os-feedback-message ' ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: ack }} />
      )

  if (persistorGetStatus === PersistorGetStatus.Failure) {
    return (
      <div className="os-raise-bootstrap">
        <div className="text-center">
          <span className="text-danger">There was an error loading content. Please try refreshing the page.</span>
        </div>
      </div>
    )
  }

  if (persistorGetStatus === PersistorGetStatus.Uninitialized) {
    return (
      <div className="os-raise-bootstrap">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <EventControlledContent waitForEvent={waitForEvent}>
      <div className="os-raise-bootstrap">
        <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: content }} />
        <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: prompt }} />
        <Formik
          initialValues={{ response: initialResponse }}
          onSubmit={handleSubmit}
          validationSchema={schema}
          validateOnBlur={false}
        >
          {({ isSubmitting, errors }) => (
            <Form>
              <Field
              name="response"
              as="textarea"
              disabled={isSubmitting || responseSubmitted}
              rows={DEFAULT_TEXTAREA_ROWS}
              className={buildClassName(responseSubmitted, errors.response)}/>
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
