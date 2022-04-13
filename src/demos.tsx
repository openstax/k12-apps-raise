import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Formik, Field, Form, FormikHelpers } from 'formik'

interface ProblemProps {
  problem: string
  solution: number
}

interface Values {
  response: string
}

const InteractiveProblem = ({ problem, solution }: ProblemProps): JSX.Element => {
  const [answeredCorrect, setAnsweredCorrect] = useState(false)
  const [feedback, setFeedback] = useState('')

  const handleSubmit = async (values: Values, actions: FormikHelpers<Values>): Promise<void> => {
    if (parseInt(values.response) === solution) {
      setAnsweredCorrect(true)
      setFeedback('Great job!')
    } else {
      setFeedback('Try again!')
    }
  }

  return (
    <div className="container-fluid os-raise-bootstrap">
      <div className="row mb-3 align-items-center">
        <div className="col-1" >
          {problem}
        </div>
        <div className="col">
          <Formik
            initialValues={{
              response: ''
            }}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="d-flex align-items-center">
                  <Field id="response" size="10" name="response" className="os-form-control" placeholder="x=" disabled={isSubmitting || answeredCorrect} />
                  <button type="submit" className="mx-2 btn btn-outline-primary" disabled={isSubmitting || answeredCorrect}>Check</button>
                  <div className={answeredCorrect ? 'mx-3 text-success' : 'mx-3 text-primary'} >{feedback}</div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export const inputInteractiveDemo = (): void => {
  if (document.querySelector('.os-problems') === null) {
    return
  }
  const problems = document.querySelector('.os-problems') as HTMLElement
  problems.querySelectorAll('.os-problem-equation').forEach((elem: Element): void => {
    const htmlElem = elem as HTMLElement
    const solution = parseInt(htmlElem.dataset.solution as string)
    const problem = htmlElem.innerText
    htmlElem.removeAttribute('data-solution')

    createRoot(htmlElem).render(
      <React.StrictMode>
        <InteractiveProblem problem={problem} solution={solution} />
      </React.StrictMode>
    )
  })
}
