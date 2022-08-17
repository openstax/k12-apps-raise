import { useEffect, useState } from 'react'
import { DropdownProblem } from './DropdownProblem'
import { EventControlledContent } from './EventControlledContent'
import { InputProblem } from './InputProblem'
import { MultipleChoiceProblem } from './MultipleChoiceProblem'
import { MultiselectProblem } from './MultiselectProblem'

export interface ProblemData {
  type: string
  solution: string
  comparator?: string
  solutionOptions?: string
  content: string
  correctResponse: string
  encourageResponse: string
  retryLimit: number
  buttonText: string
  attemptsExhaustedResponse: string
  answerResponses: AnswerSpecificResponse[]
}

export interface AnswerSpecificResponse {
  answer: string
  response: string
}

export interface BaseProblemProps {
  solvedCallback: () => void
  exhaustedCallback: () => void
  allowedRetryCallback: () => void
  content: string
  correctResponse: string
  encourageResponse: string
  retryLimit: number
  solution: string
  buttonText: string
  attemptsExhaustedResponse: string
  answerResponses: AnswerSpecificResponse[]
}

export const NO_MORE_ATTEMPTS_MESSAGE = 'No more attempts allowed'
export const PROBLEM_TYPE_INPUT = 'input'
export const PROBLEM_TYPE_DROPDOWN = 'dropdown'
export const PROBLEM_TYPE_MULTISELECT = 'multiselect'
export const PROBLEM_TYPE_MULTIPLECHOICE = 'multiplechoice'

interface ProblemResult {
  solved: boolean
  exhausted: boolean
  attempts: number
}

interface ProblemSetBlockProps {
  waitForEvent?: string
  fireSuccessEvent?: string
  fireLearningOpportunityEvent?: string
  problems: ProblemData[]
}

export const ProblemSetBlock = ({ waitForEvent, fireSuccessEvent, fireLearningOpportunityEvent, problems }: ProblemSetBlockProps): JSX.Element => {
  const generateInitialProblemResults = (): Map<number, ProblemResult> => {
    const initProblems = new Map<number, ProblemResult>()
    problems.forEach((_, indx) => {
      initProblems.set(indx, { solved: false, exhausted: false, attempts: 0 })
    })
    return initProblems
  }
  const [problemResults, setProblemResults] = useState<Map<number, ProblemResult>>(generateInitialProblemResults())
  const children: JSX.Element[] = []

  useEffect(() => {
    // As a placeholder: We'll fire successEvent if all problems are solved or learningOpportunityEvent if all problems
    // are either solved or exhausted
    const solvedCount = Array.from(problemResults.values()).reduce((acc, prob) => (prob.solved ? acc + 1 : acc), 0)
    const exhaustedCount = Array.from(problemResults.values()).reduce((acc, prob) => (prob.exhausted ? acc + 1 : acc), 0)

    if (fireSuccessEvent !== undefined && solvedCount === problems.length) {
      const psetEvent = new CustomEvent(fireSuccessEvent)
      document.dispatchEvent(psetEvent)
    }

    if (fireLearningOpportunityEvent !== undefined && (solvedCount + exhaustedCount) === problems.length && solvedCount !== problems.length) {
      const psetEvent = new CustomEvent(fireLearningOpportunityEvent)
      document.dispatchEvent(psetEvent)
    }
  }, [problemResults])

  const callbackFactory = (problemNumber: number, reducer: (prevResult: ProblemResult) => ProblemResult): () => void => {
    return () => {
      setProblemResults(prevProblemResults => {
        const prevResult = prevProblemResults.get(problemNumber)
        if (prevResult !== undefined) {
          prevProblemResults.set(problemNumber, reducer(prevResult))
        }
        return new Map(prevProblemResults)
      })
    }
  }

  const solvedCallbackFactory = (problemNumber: number): () => void => {
    return callbackFactory(problemNumber, prevResult => ({ ...prevResult, ...{ attempts: prevResult.attempts + 1, solved: true } }))
  }

  const exhaustedCallbackFactory = (problemNumber: number): () => void => {
    return callbackFactory(problemNumber, prevResult => ({ ...prevResult, ...{ attempts: prevResult.attempts + 1, exhausted: true } }))
  }

  const allowedRetryCallbackFactory = (problemNumber: number): () => void => {
    return callbackFactory(problemNumber, prevResult => ({ ...prevResult, ...{ attempts: prevResult.attempts + 1 } }))
  }

  problems.forEach((prob, indx) => {
    const sharedProps = {
      key: indx,
      solvedCallback: solvedCallbackFactory(indx),
      exhaustedCallback: exhaustedCallbackFactory(indx),
      allowedRetryCallback: allowedRetryCallbackFactory(indx),
      solution: prob.solution,
      retryLimit: prob.retryLimit,
      content: prob.content,
      correctResponse: prob.correctResponse,
      encourageResponse: prob.encourageResponse,
      buttonText: prob.buttonText,
      attemptsExhaustedResponse: prob.attemptsExhaustedResponse,
      answerResponses: prob.answerResponses
    }
    if (prob.type === PROBLEM_TYPE_INPUT) {
      children.push(<InputProblem
        comparator={prob.comparator as string}
        {...sharedProps}
      />)
    }
    if (prob.type === PROBLEM_TYPE_DROPDOWN) {
      children.push(<DropdownProblem
        solutionOptions={prob.solutionOptions as string}
        {...sharedProps}
      />)
    }
    if (prob.type === PROBLEM_TYPE_MULTISELECT) {
      children.push(<MultiselectProblem
        solutionOptions={prob.solutionOptions as string}
        {...sharedProps}
      />)
    }
    if (prob.type === PROBLEM_TYPE_MULTIPLECHOICE) {
      children.push(<MultipleChoiceProblem
        solutionOptions={prob.solutionOptions as string}
        {...sharedProps}
      />)
    }
  })

  return (
    <EventControlledContent waitForEvent={waitForEvent}>
      <div className="os-raise-bootstrap">
        <div className="mb-3">
          {children}
        </div>
      </div>
    </EventControlledContent>
  )
}
