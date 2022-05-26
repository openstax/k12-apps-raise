import { AnswerSpecificResponse } from '../components/ProblemSetBlock'

export const determineFeedback = (userResponse: string | string[], encourageResponse: string, answerResponses: AnswerSpecificResponse[], comparator: ((input: string, answer: string) => boolean) | ((input: string[], answer: string) => boolean)): string => {
  let response
  answerResponses.forEach(val => {
    if (comparator(userResponse as any, val.answer)) {
      response = val.response
    }
  })
  return response === undefined ? encourageResponse : response
}
