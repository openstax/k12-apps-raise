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

interface PersistorState {
  userResponse: string
  responseSubmitted: boolean
}

enum PersistorStatus {
  Impersistent,
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
  const [interactiveState, setInteractiveState] = useState<PersistorState | null>(null)
  const [persistorStatus, setPersistorStatus] = useState<number>(PersistorStatus.Impersistent)
  const contentLoadedContext = useContext(ContentLoadedContext)
  const NON_EMPTY_VALUE_ERROR = 'Please provide valid input'
  const EXCEEDED_MAX_INPUT_ERROR = 'Input is too long'

  const schema = Yup.object({
    response: Yup.string()
      .max(MAX_CHARACTER_INPUT_BLOCK_LENGTH, EXCEEDED_MAX_INPUT_ERROR)
  })

  const updateInteractiveState = async (): Promise<void> => {
    try {
      if (contentId === undefined || persistor === undefined) {
        setInteractiveState({
          userResponse: '',
          responseSubmitted: false
        }
        )
        setPersistorStatus(PersistorStatus.Success)
        return
      }

      const currentLocalStorageState = await persistor.get(contentId)
      if (currentLocalStorageState !== null) {
        const parsedLocalStorage = JSON.parse(currentLocalStorageState)
        setInteractiveState({
          userResponse: parsedLocalStorage.userResponse,
          responseSubmitted: parsedLocalStorage.responseSubmitted
        })
        setResponseSubmitted(parsedLocalStorage.responseSubmitted)
      } else {
        setInteractiveState({
          userResponse: '',
          responseSubmitted: false
        })
      }
      setPersistorStatus(PersistorStatus.Success)
    } catch (err) {
      setPersistorStatus(PersistorStatus.Failure)
      console.error(err)
    }
  }

  useEffect(() => {
    updateInteractiveState().catch(() => { })
  }, [])

  const handleSubmit = async (values: InputFormValues, { setFieldError }: FormikHelpers<InputFormValues>): Promise<void> => {
    if (values.response.trim() === '') {
      setFieldError('response', NON_EMPTY_VALUE_ERROR)
      return
    }

    try {
      if (contentId !== undefined && persistor !== undefined) {
        await persistor.put(contentId, JSON.stringify({ userResponse: values.response, responseSubmitted: true }))
        const currentLocalStorageState = await persistor.get(contentId)
        if (currentLocalStorageState !== null) {
          const parsedLocalStorage = JSON.parse(currentLocalStorageState)
          setInteractiveState({
            userResponse: parsedLocalStorage.userResponse,
            responseSubmitted: parsedLocalStorage.responseSubmitted
          })
        }
      }
    } catch (error) {
      setPersistorStatus(PersistorStatus.Failure)
      console.error(error)
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

  if (interactiveState !== null && persistorStatus === PersistorStatus.Success) {
    return (
      <EventControlledContent waitForEvent={waitForEvent}>
        <div className="os-raise-bootstrap">
          <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: content }} />
          <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: prompt }} />
          <Formik
            initialValues={{ response: interactiveState.userResponse }}
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

  if (persistorStatus === PersistorStatus.Failure) {
    return (
      <div className="os-raise-bootstrap">
        <div className="text-center">
          <span className="text-danger">There was an error loading content. Please try refreshing the page.</span>
        </div>
      </div>
    )
  }

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
