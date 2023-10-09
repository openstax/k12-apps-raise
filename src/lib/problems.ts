import type { AnswerSpecificResponse } from '../components/ProblemSetBlock'

export const determineFeedback = (encourageResponse: string, answerResponses: AnswerSpecificResponse[]): string => {
  let response
  answerResponses.forEach(val => {
      response = val.response
  })
  return response ?? encourageResponse
}

export const retriesRemaining = (retryLimit: number, retries: number): boolean => {
  return (retryLimit === 0 || retries !== retryLimit)
}
