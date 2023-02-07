import { ContentBlock } from '../components/ContentBlock'
import { CTABlock } from '../components/CTABlock'
import { DesmosBlock } from '../components/DesmosBlock'
import {
  AnswerSpecificResponse, NO_MORE_ATTEMPTS_MESSAGE, ProblemData, ProblemSetBlock, PROBLEM_TYPE_DROPDOWN,
  PROBLEM_TYPE_INPUT, PROBLEM_TYPE_MULTIPLECHOICE, PROBLEM_TYPE_MULTISELECT
} from '../components/ProblemSetBlock'
import { UserInputBlock } from '../components/UserInputBlock'

export const OS_RAISE_IB_EVENT_PREFIX = 'os-raise-ib-event'
export const OS_RAISE_IB_CONTENT_CLASS = 'os-raise-ib-content'
export const OS_RAISE_IB_CTA_CLASS = 'os-raise-ib-cta'
export const CTA_CONTENT_CLASS = 'os-raise-ib-cta-content'
export const CTA_PROMPT_CLASS = 'os-raise-ib-cta-prompt'
export const OS_RAISE_IB_INPUT_CLASS = 'os-raise-ib-input'
export const OS_RAISE_IB_DESMOS_CLASS = 'os-raise-ib-desmos-gc'
const INPUT_CONTENT_CLASS = 'os-raise-ib-input-content'
const INPUT_PROMPT_CLASS = 'os-raise-ib-input-prompt'
const INPUT_ACK_CLASS = 'os-raise-ib-input-ack'
export const OS_RAISE_IB_PSET_CLASS = 'os-raise-ib-pset'
const PSET_PROBLEM_CLASS = 'os-raise-ib-pset-problem'
const PSET_CORRECT_RESPONSE_CLASS = 'os-raise-ib-pset-correct-response'
const PSET_ENCOURAGE_RESPONSE_CLASS = 'os-raise-ib-pset-encourage-response'
const PSET_PROBLEM_CONTENT_CLASS = 'os-raise-ib-pset-problem-content'
const PSET_ATTEMPTS_EXHAUSTED_CLASS = 'os-raise-ib-pset-attempts-exhausted-response'

export const isInteractiveBlock = (element: HTMLElement): boolean => {
  return [
    OS_RAISE_IB_CONTENT_CLASS,
    OS_RAISE_IB_CTA_CLASS,
    OS_RAISE_IB_INPUT_CLASS,
    OS_RAISE_IB_PSET_CLASS,
    OS_RAISE_IB_DESMOS_CLASS
  ].some(blockClass => element.classList.contains(blockClass))
}

export const blockifyHTML = (htmlContent: string): JSX.Element[] => {
  // Create a temporary element to build a DOM which can be used to parse /
  // create blocks
  const tmpDiv = document.createElement('div')
  tmpDiv.innerHTML = htmlContent

  let nonIBChildrenHTML = ''
  const childBlocks: JSX.Element[] = []
  let childIndx = 0

  const addChild = (component: JSX.Element): void => {
    const wrappedWithIndex = <div key={childIndx}>{component}</div>
    childBlocks.push(wrappedWithIndex)
    childIndx++
  }

  Array.from(tmpDiv.children).forEach((elem) => {
    const htmlElem = elem as HTMLElement
    if (!isInteractiveBlock(htmlElem)) {
      // Append this to current non-IB children HTML to consolidate adjacent
      // elements which are not interactive blocks
      nonIBChildrenHTML += elem.outerHTML
    } else {
      // Create a content-only block if any have been found to this point
      if (nonIBChildrenHTML !== '') {
        addChild(createNonwaitingContentBlock(nonIBChildrenHTML))
        nonIBChildrenHTML = ''
      }
      addChild(blockifyElement(htmlElem))
    }
  })

  // Catch any remaining non-IB children
  if (nonIBChildrenHTML !== '') {
    addChild(createNonwaitingContentBlock(nonIBChildrenHTML))
  }

  return childBlocks
}

const blockifyElement = (element: HTMLElement): JSX.Element => {
  if (element.classList.contains(OS_RAISE_IB_CTA_CLASS)) {
    const maybeCTABlock = parseCTABlock(element)
    if (maybeCTABlock !== null) {
      return maybeCTABlock
    }
  }

  if (element.classList.contains(OS_RAISE_IB_CONTENT_CLASS)) {
    const maybeContentOnlyBlock = parseContentOnlyBlock(element)
    if (maybeContentOnlyBlock !== null) {
      return maybeContentOnlyBlock
    }
  }

  if (element.classList.contains(OS_RAISE_IB_INPUT_CLASS)) {
    const maybeUserInputBlock = parseUserInputBlock(element)
    if (maybeUserInputBlock !== null) {
      return maybeUserInputBlock
    }
  }

  if (element.classList.contains(OS_RAISE_IB_PSET_CLASS)) {
    const maybeProblemSetBlock = parseProblemSetBlock(element)
    if (maybeProblemSetBlock !== null) {
      return maybeProblemSetBlock
    }
  }

  if (element.classList.contains(OS_RAISE_IB_DESMOS_CLASS)) {
    const maybeDesmosBlock = parseDesmosBlock(element)
    if (maybeDesmosBlock !== null) {
      return maybeDesmosBlock
    }
  }

  return createNonwaitingContentBlock(element.outerHTML)
}

const namespaceEvent = (eventName: string | undefined): string | undefined => {
  if (eventName === undefined) {
    return undefined
  }

  return `${OS_RAISE_IB_EVENT_PREFIX}-${eventName}`
}

const createNonwaitingContentBlock = (content: string): JSX.Element => {
  return <ContentBlock content={content} />
}

export const parseCTABlock = (element: HTMLElement): JSX.Element | null => {
  if (!element.classList.contains(OS_RAISE_IB_CTA_CLASS)) {
    return null
  }

  const contentElem = element.querySelector(`.${CTA_CONTENT_CLASS}`)
  const promptElem = element.querySelector(`.${CTA_PROMPT_CLASS}`)
  const buttonText = element.dataset.buttonText ?? 'Next'
  const fireEvent = namespaceEvent(element.dataset.fireEvent)
  const waitForEvent = namespaceEvent(element.dataset.waitForEvent)

  if (contentElem === null || promptElem === null) {
    console.error('CTABlock content string or prompt is null')
    return null
  }

  const contentInnerHTML = contentElem.innerHTML
  const promptInnerHTML = promptElem.innerHTML

  return <CTABlock
    content={contentInnerHTML}
    prompt={promptInnerHTML}
    buttonText={buttonText}
    fireEvent={fireEvent}
    waitForEvent={waitForEvent}
  />
}

export const parseContentOnlyBlock = (element: HTMLElement): JSX.Element | null => {
  if (!element.classList.contains(OS_RAISE_IB_CONTENT_CLASS)) {
    return null
  }

  const waitForEvent = namespaceEvent(element.dataset.waitForEvent)
  const htmlContent = element.innerHTML

  return <ContentBlock content={htmlContent} waitForEvent={waitForEvent} />
}

export const parseUserInputBlock = (element: HTMLElement): JSX.Element | null => {
  if (!element.classList.contains(OS_RAISE_IB_INPUT_CLASS)) {
    return null
  }

  const maybeButtonText = element.dataset.buttonText
  const waitForEvent = namespaceEvent(element.dataset.waitForEvent)
  const fireEvent = namespaceEvent(element.dataset.fireEvent)
  const contentId = element.dataset.contentId
  const contentElem = element.querySelector(`.${INPUT_CONTENT_CLASS}`)
  const promptElem = element.querySelector(`.${INPUT_PROMPT_CLASS}`)
  const ackElem = element.querySelector(`.${INPUT_ACK_CLASS}`)

  if (contentElem === null || promptElem === null || ackElem === null) {
    console.error('UserInputBlock missing expected content')
    return null
  }

  const contentInnerHTML = contentElem.innerHTML
  const promptInnerHTML = promptElem.innerHTML
  const ackInnerHTML = ackElem.innerHTML

  return <UserInputBlock
    content={contentInnerHTML}
    prompt={promptInnerHTML}
    ack={ackInnerHTML}
    buttonText={maybeButtonText ?? 'Submit'}
    waitForEvent={waitForEvent}
    fireEvent={fireEvent}
    contentId={contentId}
  />
}

export const parseProblemSetBlock = (element: HTMLElement): JSX.Element | null => {
  if (!element.classList.contains(OS_RAISE_IB_PSET_CLASS)) {
    return null
  }

  const fireSuccessEvent = namespaceEvent(element.dataset.fireSuccessEvent)
  const fireLearningOpportunityEvent = namespaceEvent(element.dataset.fireLearningOpportunityEvent)
  const waitForEvent = namespaceEvent(element.dataset.waitForEvent)
  const contentId = element.dataset.contentId
  const maybeRetryLimit = element.dataset.retryLimit
  const maybeButtonText = element.dataset.buttonText
  const psetCorrectResponseElem = element.querySelector(`:scope > .${PSET_CORRECT_RESPONSE_CLASS}`)
  const psetEncourageResponseElem = element.querySelector(`:scope > .${PSET_ENCOURAGE_RESPONSE_CLASS}`)
  const psetProblemElems = element.querySelectorAll(`.${PSET_PROBLEM_CLASS}`)
  const problems: ProblemData[] = []

  if (psetCorrectResponseElem === null || psetEncourageResponseElem === null || psetProblemElems.length === 0) {
    console.error('ProblemSetBlock missing expected content')
    return null
  }

  const findEncouragementOverride = (htmlElem: HTMLElement): HTMLElement | null => {
    const elems: NodeListOf<HTMLElement> = htmlElem.querySelectorAll(`.${PSET_ENCOURAGE_RESPONSE_CLASS}`)
    const allEncouragements = Array.from(elems).filter(element => element.dataset.answer === undefined)
    return allEncouragements.length > 0 ? allEncouragements[0] : null
  }
  const findAnswerSpecificOverride = (htmlElem: HTMLElement): HTMLElement[] => {
    const elems: NodeListOf<HTMLElement> = htmlElem.querySelectorAll(`.${PSET_ENCOURAGE_RESPONSE_CLASS}`)
    const allEncouragements = Array.from(elems).filter(element => element.dataset.answer !== undefined)
    return allEncouragements
  }

  const buildAnswerSpecificOverridesObject = (responses: HTMLElement[]): AnswerSpecificResponse[] => {
    return responses.map(elem => ({ answer: elem.dataset.answer as string, response: elem.innerHTML }))
  }

  psetProblemElems.forEach(prob => {
    const htmlElem = prob as HTMLElement
    const problemType = htmlElem.dataset.problemType
    const contentId = htmlElem.dataset.contentId
    const solution = htmlElem.dataset.solution
    const problemComparator = htmlElem.dataset.problemComparator
    const solutionOptions = htmlElem.dataset.solutionOptions
    const maybeCorrectResponseOverride = htmlElem.querySelector(`.${PSET_CORRECT_RESPONSE_CLASS}`)
    const maybeEncourageResponseOverride = findEncouragementOverride(htmlElem)
    const maybeProblemContent = htmlElem.querySelector(`.${PSET_PROBLEM_CONTENT_CLASS}`)
    const maybeAnswerSpecificResponses = findAnswerSpecificOverride(htmlElem)
    const maybeAttemptsExhaustedResponse = htmlElem.querySelector(`.${PSET_ATTEMPTS_EXHAUSTED_CLASS}`)

    if (problemType === undefined ||
      solution === undefined ||
      maybeProblemContent === null ||
      (problemType === PROBLEM_TYPE_INPUT && problemComparator === undefined) ||
      (problemType === PROBLEM_TYPE_DROPDOWN && solutionOptions === undefined) ||
      (problemType === PROBLEM_TYPE_MULTISELECT && solutionOptions === undefined) ||
      (problemType === PROBLEM_TYPE_MULTIPLECHOICE && solutionOptions === undefined)) {
      console.error('Ignoring incorrectly defined problem')
      return
    }

    problems.push({
      type: problemType,
      content: maybeProblemContent.innerHTML,
      contentId,
      solution,
      comparator: htmlElem.dataset.problemComparator,
      solutionOptions,
      buttonText: maybeButtonText ?? 'Check',
      retryLimit: maybeRetryLimit === undefined ? 0 : parseInt(maybeRetryLimit),
      correctResponse: (maybeCorrectResponseOverride === null) ? psetCorrectResponseElem.innerHTML : maybeCorrectResponseOverride.innerHTML,
      encourageResponse: (maybeEncourageResponseOverride === null) ? psetEncourageResponseElem.innerHTML : maybeEncourageResponseOverride.innerHTML,
      answerResponses: buildAnswerSpecificOverridesObject(maybeAnswerSpecificResponses),
      attemptsExhaustedResponse: (maybeAttemptsExhaustedResponse === null) ? NO_MORE_ATTEMPTS_MESSAGE : maybeAttemptsExhaustedResponse.innerHTML
    })
  })

  return <ProblemSetBlock
    problems={problems}
    fireSuccessEvent={fireSuccessEvent}
    fireLearningOpportunityEvent={fireLearningOpportunityEvent}
    waitForEvent={waitForEvent}
    contentId={contentId}
  />
}

export const parseDesmosBlock = (element: HTMLElement): JSX.Element | null => {
  if (!element.classList.contains(OS_RAISE_IB_DESMOS_CLASS)) {
    return null
  }
  const waitForEvent = namespaceEvent(element.dataset.waitForEvent)
  const width = element.dataset.width
  const height = element.dataset.height
  const equations = element.dataset.equations
  const disableExpressions = element.dataset.disableExpressions !== undefined
  const scaleTop = element.dataset.top
  const scaleBottom = element.dataset.bottom
  const scaleLeft = element.dataset.left
  const scaleRight = element.dataset.right
  const tables = element.dataset.tables
  return <DesmosBlock width={width ?? '500'} height={height ?? '400'}
          waitForEvent={waitForEvent} equations={equations ?? '[]'}
          disableExpressions={disableExpressions} scaleTop={scaleTop ?? '10'}
          scaleBottom={scaleBottom ?? '-10'} scaleRight={scaleRight ?? '10'}
          scaleLeft={scaleLeft ?? '-10'} tables={tables ?? '[]'}

  />
}
