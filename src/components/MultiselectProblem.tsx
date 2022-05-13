import { useCallback, useState } from 'react'
import { mathifyElement } from '../lib/math'
import { BaseProblemProps, NO_MORE_ATTEMPTS_MESSAGE } from './ProblemSetBlock'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'

interface MultiselectProps extends BaseProblemProps {
  solutionOptions: string
}

interface MultiselectFormValues {
  response: string[]
}

export const MultiselectProblem = ({
  solvedCallback, exhaustedCallback, allowedRetryCallback, content, buttonText, solutionOptions,
  correctResponse, encourageResponse, solution, retryLimit
}: MultiselectProps): JSX.Element => {
  const [feedback, setFeedback] = useState('')
  const [formDisabled, setFormDisabled] = useState(false)
  const [retriesAllowed, setRetriesAllowed] = useState(0)
  const solutionArray: string[] = JSON.parse(solution)
  const parsedOptionValues: string[] = JSON.parse(solutionOptions)

  const schema = Yup.object({
    response: Yup.array().min(1, 'Please select an answer')
  })

  const contentRefCallback = useCallback((node: HTMLDivElement | null): void => {
    if (node != null) {
      mathifyElement(node)
    }
  }, [])

  const clearFeedback = (): void => {
    setFeedback('')
  }

  const modifyModel = (values: MultiselectFormValues, e: React.ChangeEvent<HTMLInputElement>): string[] => {
    const newSet = new Set(values.response)
    if (e.target.checked) {
      newSet.add(e.target.value)
    } else {
      newSet.delete(e.target.value)
    }
    return Array.from(newSet)
  }

  const generateOptions = (values: MultiselectFormValues, isSubmitting: boolean, setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void): JSX.Element[] => {
    const options: JSX.Element[] = []

    parsedOptionValues.forEach(val => options.push(
    <label key={val}>
      <Field
      key={val}
      type="checkbox"
      name="response"
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { clearFeedback(); setFieldValue('response', modifyModel(values, e)) }}
      disabled={isSubmitting || formDisabled}
      value={val}>
      </Field>
      {val}
    </label>
    ))

    return options
  }

  const compareForm = (form: string[], solution: string[]): boolean => {
    if (form.length !== solution.length) {
      return false
    }
    for (let i = 0; i < solution.length; i++) {
      if (!solution.includes(form[i])) {
        return false
      }
    }
    return true
  }

  const handleSubmit = async (values: MultiselectFormValues): Promise<void> => {
    if (compareForm(values.response, solutionArray)) {
      setFeedback(correctResponse)
      solvedCallback()
      setFormDisabled(true)
    } else if (retryLimit === 0 || retriesAllowed !== retryLimit) {
      setRetriesAllowed(currRetries => currRetries + 1)
      setFeedback(encourageResponse)
      allowedRetryCallback()
    } else {
      exhaustedCallback()
      setFeedback(NO_MORE_ATTEMPTS_MESSAGE)
      setFormDisabled(true)
    }
  }

  return (
    <div className="os-raise-bootstrap" ref={contentRefCallback}>
      <div className="my-3" dangerouslySetInnerHTML={{ __html: content }} />
      <Formik
        initialValues={{ response: [] }}
        onSubmit={handleSubmit}
        validationSchema={schema}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <div role="group">
              {generateOptions(values, isSubmitting, setFieldValue)}
            </div>
            <ErrorMessage className="text-danger my-3" component="div" name="response" />
            <button type="submit" disabled={isSubmitting || formDisabled} className="btn btn-outline-primary">{buttonText}</button>
            {feedback !== '' ? <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: feedback }} className="my-3" /> : null }
          </Form>
        )}
      </Formik>
    </div>
  )
}
