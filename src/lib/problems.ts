import type { AnswerSpecificResponse } from '../components/ProblemSetBlock'

export const determineFeedback: <T extends string | string[]>(
  userResponse: T,
  encourageResponse: string,
  answerResponses: AnswerSpecificResponse[],
  comparator: (input: T, answer: string) => boolean
) => string = (userResponse, encourageResponse, answerResponses, comparator) => {
  let response: string | undefined

  answerResponses.forEach(val => {
    if (comparator(userResponse, val.answer)) {
      response = val.response
    }
  })

  return response ?? encourageResponse
}

export const retriesRemaining = (retryLimit: number, retries: number): boolean => {
  return retries !== retryLimit
}
