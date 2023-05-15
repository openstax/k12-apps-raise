import React, { useState, useCallback } from 'react'
import type { BaseProblemProps } from './ProblemSetBlock'
import { Mathfield } from './Mathfield'
import { determineFeedback } from '../lib/problems'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { mathifyElement } from '../lib/math'
import * as Yup from 'yup'
import { type MathfieldElement } from 'mathlive'
import * as KAS from '@khanacademy/kas'

export const MAX_CHARACTER_INPUT_PROBLEM_LENGTH = 500

interface InputProblemProps extends BaseProblemProps {
  comparator: string
}

interface InputSchema {
  response: string | number
}

interface InputFormValues {
  response: string
}

export const InputProblem = ({
  solvedCallback, exhaustedCallback, allowedRetryCallback, attemptsExhaustedResponse,
  solution, retryLimit, content, contentId, comparator, encourageResponse, buttonText, correctResponse, answerResponses, onProblemAttempt
}: InputProblemProps): JSX.Element => {
  const [retriesAllowed, setRetriesAllowed] = useState(0)
  const [inputDisabled, setInputDisabled] = useState(false)
  const [feedback, setFeedback] = useState('')
  const NUMERIC_INPUT_ERROR = 'Enter numeric values only'
  const EXCEEDED_MAX_INPUT_ERROR = 'Input is too long'
  const NON_EMPTY_VALUE_ERROR = 'Please provide valid input'

  const schema = (): Yup.Schema<InputSchema> => {
    if (comparator.toLowerCase() === 'integer') {
      return Yup.object({
        response: Yup.number().integer(NUMERIC_INPUT_ERROR).typeError(NUMERIC_INPUT_ERROR).required(NUMERIC_INPUT_ERROR)
      })
    }
    if (comparator.toLowerCase() === 'float') {
      return Yup.object({
        response: Yup.number().typeError(NUMERIC_INPUT_ERROR).required(NUMERIC_INPUT_ERROR)
      })
    }
    return Yup.object({
      response: Yup.string().trim().required(NON_EMPTY_VALUE_ERROR).max(MAX_CHARACTER_INPUT_PROBLEM_LENGTH, EXCEEDED_MAX_INPUT_ERROR)
    })
  }

  const contentRefCallback = useCallback((node: HTMLDivElement | null): void => {
    if (node != null) {
      mathifyElement(node)
    }
  }, [feedback])

  const evaluateInput = (input: string, answer: string): boolean => {
    if (comparator.toLowerCase() === 'integer') {
      return parseInt(input) === parseInt(answer)
    }
    if (comparator.toLowerCase() === 'float') {
      return parseFloat(input) === parseFloat(answer)
    }
    if (comparator.toLowerCase() === 'math') {
      // TODO: This only seems to work in some cases and needs more investigation / work.
      const parsedInput = KAS.parse(input)
      const parsedAnswer = KAS.parse(answer)

      if ((parsedInput.parsed !== true) || (parsedAnswer.parsed !== true)) {
        console.error(`Parsing error with input '${input}' or answer '${answer}':`)
        console.error(parsedInput)
        console.error(parsedAnswer)
        return false
      }
      return KAS.compare(parsedInput.expr, parsedAnswer.expr).equal
    }

    return input.toLowerCase() === answer.toLowerCase()
  }

  const handleSubmit = async (values: InputFormValues): Promise<void> => {
    let correct = false
    let finalAttempt = false
    const attempt = retriesAllowed + 1

    if (evaluateInput(values.response.trim(), solution.trim())) {
      correct = true
      setFeedback(correctResponse)
      solvedCallback()
      setInputDisabled(true)
    } else if (retryLimit === 0 || retriesAllowed !== retryLimit) {
      setRetriesAllowed(currRetries => currRetries + 1)
      setFeedback(determineFeedback(values.response, encourageResponse, answerResponses, evaluateInput))
      allowedRetryCallback()
    } else {
      setFeedback(attemptsExhaustedResponse)
      exhaustedCallback()
      setInputDisabled(true)
      finalAttempt = true
    }

    if (onProblemAttempt !== undefined) {
      onProblemAttempt(
        values.response,
        correct,
        attempt,
        finalAttempt,
        contentId
      )
    }
  }
  const clearFeedback = (): void => {
    setFeedback('')
  }
  return (
  <div className="os-raise-bootstrap">

    <div className="my-3" ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: content }} />
    <Formik
          initialValues={{ response: '' }}
          onSubmit={handleSubmit}
          validationSchema={schema}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form >
              {
                // TODO: Just hacking this in here to test math inputs via Mathfield for now
                comparator.toLowerCase() === 'math'
                  ? (
                  <Field
                    name="response"
                    disabled={inputDisabled || isSubmitting}
                    as={Mathfield}
                    onInput={(e: React.ChangeEvent<MathfieldElement>) => { clearFeedback(); setFieldValue('response', e.target.value) }}
                    className="os-form-control mb-3 w-50" />
                    )
                  : (
                    <Field
                    name="response"
                    disabled={inputDisabled || isSubmitting}
                    autoComplete={'off'}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => { clearFeedback(); setFieldValue('response', e.target.value) }}
                    className="os-form-control mb-3" />
                    )
              }
              <ErrorMessage className="text-danger mb-3" component="div" name="response" />
              <button type="submit" disabled={inputDisabled || isSubmitting} className="btn btn-outline-primary">{buttonText}</button>
              {feedback !== '' ? <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: feedback }} className="my-3" /> : null }

            </Form>
          )}
        </Formik>
  </div>)
}
