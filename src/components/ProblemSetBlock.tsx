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
  return (<></>)
}
