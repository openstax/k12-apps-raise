import { DropdownProblem } from './DropdownProblem'
import { EventControlledContent } from './EventControlledContent'
import { InputProblem } from './InputProblem'
import { MultiselectProblem } from './MultiselectProblem'

export interface ProblemData {
  type: string
  solution: string
  comparator?: string
  solutionOptions?: string
  correctResponse: string
  encourageResponse: string
  retryLimit: number
  buttonText: string
}

export const PROBLEM_TYPE_INPUT = 'input'
export const PROBLEM_TYPE_DROPDOWN = 'dropdown'
export const PROBLEM_TYPE_MULTISELECT = 'multiselect'

interface ProblemSetBlockProps {
  waitForEvent?: string
  fireSuccessEvent?: string
  fireLearningOpportunityEvent?: string
  problems: ProblemData[]
}

export const ProblemSetBlock = ({ waitForEvent, fireSuccessEvent, fireLearningOpportunityEvent, problems }: ProblemSetBlockProps): JSX.Element => {
  const children: JSX.Element[] = []

  problems.forEach((prob, indx) => {
    if (prob.type === PROBLEM_TYPE_INPUT) {
      children.push(<InputProblem key={indx}/>)
    }
    if (prob.type === PROBLEM_TYPE_DROPDOWN) {
      children.push(<DropdownProblem key={indx}/>)
    }
    if (prob.type === PROBLEM_TYPE_MULTISELECT) {
      children.push(<MultiselectProblem key={indx}/>)
    }
  })

  return (
    <EventControlledContent waitForEvent={waitForEvent}>
      {children}
    </EventControlledContent>
  )
}
