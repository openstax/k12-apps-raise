import { render, screen, fireEvent, act } from '@testing-library/react'
import { OS_RAISE_IB_EVENT_PREFIX, parseProblemSetBlock } from '../lib/blocks'
import { vi, test, expect, afterEach } from 'vitest'

import {
  type BaseProblemProps,
  type ProblemData,
  ProblemSetBlock
} from '../components/ProblemSetBlock'
import { ContentLoadedContext } from '../lib/contexts'
import { queueIbPsetProblemAttemptedV1Event } from '../lib/events'

vi.mock('../lib/events.ts', () => ({
  queueIbPsetProblemAttemptedV1Event: vi.fn(async () => {})
}))

vi.mock('../lib/env.ts', () => ({
  default: {}
}))

vi.mock('../components/DropdownProblem', () => {
  return {
    DropdownProblem: ({ solvedCallback, exhaustedCallback, allowedRetryCallback }: BaseProblemProps) => (
      <>
        <p>Mock dropdown problem</p>
        <button onClick={solvedCallback}>Solve Dropdown</button>
        <button onClick={exhaustedCallback}>Exhaust Dropdown</button>
        <button onClick={allowedRetryCallback}>Retry Dropdown</button>
      </>
    )
  }
})

vi.mock('../components/MultiselectProblem', () => {
  return {
    MultiselectProblem: ({ solvedCallback, exhaustedCallback, allowedRetryCallback }: BaseProblemProps) => (
      <>
        <p>Mock multiselect problem</p>
        <button onClick={solvedCallback}>Solve Multiselect</button>
        <button onClick={exhaustedCallback}>Exhaust Multiselect</button>
        <button onClick={allowedRetryCallback}>Retry Multiselect</button>
      </>
    )
  }
})

vi.mock('../components/InputProblem', () => {
  return {
    InputProblem: ({ solvedCallback, exhaustedCallback, allowedRetryCallback, onProblemAttempt }: BaseProblemProps) => (
      <>
        <p>Mock input problem</p>
        <button onClick={solvedCallback}>Solve Input</button>
        <button onClick={exhaustedCallback}>Exhaust Input</button>
        <button onClick={allowedRetryCallback}>Retry Input</button>
        <button onClick={() => { onProblemAttempt?.('Response', false, 1, false, 'psetProblemContentIdValue') }}>Attempt Input</button>
      </>
    )
  }
})

afterEach(() => {
  vi.clearAllMocks()
})

const testProblems: ProblemData[] = [
  {
    type: 'input',
    content: '',
    solution: 'red',
    correctResponse: '',
    encourageResponse: '',
    retryLimit: 0,
    buttonText: 'Check',
    comparator: 'text',
    attemptsExhaustedResponse: 'No more attempts allowed',
    answerResponses: []
  },
  {
    type: 'dropdown',
    content: '',
    solution: 'red',
    solutionOptions: '["red", "blue"]',
    correctResponse: '',
    encourageResponse: '',
    retryLimit: 0,
    buttonText: 'Check',
    attemptsExhaustedResponse: 'No more attempts allowed',
    answerResponses: []
  },
  {
    type: 'multiselect',
    content: '',
    solution: '["red"]',
    solutionOptions: '["red", "blue"]',
    correctResponse: '',
    encourageResponse: '',
    retryLimit: 0,
    buttonText: 'Check',
    attemptsExhaustedResponse: 'No more attempts allowed',
    answerResponses: []
  }
]

test('ProblemSetBlock renders with questions', async () => {
  render(
    <ProblemSetBlock problems={testProblems} contentId={'c2c322d9-9297-4928-b763-ae581ce6bb47'}/>
  )

  screen.getByText('Mock input problem')
  screen.getByText('Mock dropdown problem')
  screen.getByText('Mock multiselect problem')
})

test('ProblemSetBlock renders without contentId', async () => {
  render(
    <ProblemSetBlock problems={testProblems}/>
  )

  screen.getByText('Mock input problem')
  screen.getByText('Mock dropdown problem')
  screen.getByText('Mock multiselect problem')
})

test('ProblemSetBlock does not render if waitForEvent does not fire', async () => {
  render(
    <ProblemSetBlock problems={testProblems} waitForEvent='someEvent' />
  )

  expect(screen.queryByText('Mock input problem')).toBeNull()
})

test('ProblemSetBlock does render if waitForEvent is fired', async () => {
  render(
    <ProblemSetBlock problems={testProblems} waitForEvent='someEvent' />
  )

  fireEvent(document, new CustomEvent('someEvent'))

  screen.getByText('Mock input problem')
})

test('parseProblemSetBlock applies question overrides and defaults', async () => {
  const psetContent = `
  <div class="os-raise-ib-pset" data-schema-version="1.0">
    <div class="os-raise-ib-pset-problem" data-problem-type="input" data-solution="42" data-problem-comparator="integer">
      <div class="os-raise-ib-pset-problem-content">
        <p>Input problem content</p>
      </div>
      <div class="os-raise-ib-pset-correct-response">
        <p>Input problem correct response</p>
      </div>
      <div class="os-raise-ib-pset-encourage-response">
        <p>Input problem encourage response</p>
      </div>
    </div>
    <div class="os-raise-ib-pset-problem" data-problem-type="dropdown" data-solution="red" data-solution-options='["red", "blue", "green"]'>
      <div class="os-raise-ib-pset-problem-content">
        <p>Dropdown problem content</p>
      </div>
    </div>
    <div class="os-raise-ib-pset-problem" data-problem-type="multiselect" data-solution='["red", "blue"]' data-solution-options='["red", "blue", "green"]'>
      <div class="os-raise-ib-pset-problem-content">
        <p>Multiselect problem content</p>
      </div>
    </div>
    <div class="os-raise-ib-pset-correct-response">
      <p>Generic correct response</p>
    </div>
    <div class="os-raise-ib-pset-encourage-response">
      <p>Generic encouragement response</p>
    </div>
  </div>
  `
  const divElem = document.createElement('div')
  divElem.innerHTML = psetContent
  const generatedProblemSetBlock = parseProblemSetBlock(divElem.children[0] as HTMLElement)

  expect(generatedProblemSetBlock).not.toBeNull()

  expect(generatedProblemSetBlock?.props.problems[0].correctResponse).toMatch('Input problem correct response')
  expect(generatedProblemSetBlock?.props.problems[0].encourageResponse).toMatch('Input problem encourage response')
  expect(generatedProblemSetBlock?.props.problems[0].retryLimit).toBe(0)
  expect(generatedProblemSetBlock?.props.problems[0].buttonText).toBe('Check')
  expect(generatedProblemSetBlock?.props.problems[1].correctResponse).toMatch('Generic correct response')
  expect(generatedProblemSetBlock?.props.problems[1].encourageResponse).toMatch('Generic encouragement response')
})

test('ProblemSetBlock from parseUserInputBlock renders on namespaced event', async () => {
  const psetContent = `
  <div class="os-raise-ib-pset" data-wait-for-event="event1" data-schema-version="1.0">
    <div class="os-raise-ib-pset-problem" data-problem-type="input" data-solution="42" data-problem-comparator="integer">
      <div class="os-raise-ib-pset-problem-content">
        <p>Input problem content</p>
      </div>
    </div>
    <div class="os-raise-ib-pset-correct-response">
      <p>Generic correct response</p>
    </div>
    <div class="os-raise-ib-pset-encourage-response">
      <p>Generic encouragement response</p>
    </div>
  </div>
  `
  const divElem = document.createElement('div')
  divElem.innerHTML = psetContent
  const generatedProblemSetBlock = parseProblemSetBlock(divElem.children[0] as HTMLElement)

  expect(generatedProblemSetBlock).not.toBeNull()

  render(
    generatedProblemSetBlock ?? <></>
  )

  expect(screen.queryByText('Mock input problem')).toBeNull()
  fireEvent(document, new CustomEvent(`${OS_RAISE_IB_EVENT_PREFIX}-event1`))
  screen.getByText('Mock input problem')
})

test('ProblemSetBlock from parseUserInputBlock fires namespaced success event', async () => {
  const psetContent = `
  <div class="os-raise-ib-pset" data-fire-success-event="event1" data-fire-learning-opportunity-event="event2" data-schema-version="1.0">
    <div class="os-raise-ib-pset-problem" data-problem-type="input" data-solution="42" data-problem-comparator="integer">
      <div class="os-raise-ib-pset-problem-content">
        <p>Input problem content</p>
      </div>
    </div>
    <div class="os-raise-ib-pset-problem" data-problem-type="dropdown" data-solution="red" data-solution-options='["red", "blue", "green"]'>
      <div class="os-raise-ib-pset-problem-content">
        <p>Dropdown problem content</p>
      </div>
    </div>
    <div class="os-raise-ib-pset-problem" data-problem-type="multiselect" data-solution='["red", "blue"]' data-solution-options='["red", "blue", "green"]'>
      <div class="os-raise-ib-pset-problem-content">
        <p>Multiselect problem content</p>
      </div>
    </div>
    <div class="os-raise-ib-pset-correct-response">
      <p>Generic correct response</p>
    </div>
    <div class="os-raise-ib-pset-encourage-response">
      <p>Generic encouragement response</p>
    </div>
  </div>
  `
  const divElem = document.createElement('div')
  divElem.innerHTML = psetContent
  const generatedProblemSetBlock = parseProblemSetBlock(divElem.children[0] as HTMLElement)

  expect(generatedProblemSetBlock).not.toBeNull()

  render(
    generatedProblemSetBlock ?? <></>
  )

  const successHandler = vi.fn()
  const learningOppHandler = vi.fn()
  document.addEventListener(`${OS_RAISE_IB_EVENT_PREFIX}-event1`, successHandler)
  document.addEventListener(`${OS_RAISE_IB_EVENT_PREFIX}-event2`, learningOppHandler)

  await act(async () => {
    screen.getByText('Solve Input').click()
    screen.getByText('Solve Multiselect').click()
    screen.getByText('Solve Dropdown').click()
  })

  expect(successHandler).toHaveBeenCalledTimes(1)
  expect(learningOppHandler).toHaveBeenCalledTimes(0)
})

test('ProblemSetBlock from parseUserInputBlock fires namespaced learning opportunity event', async () => {
  const psetContent = `
  <div class="os-raise-ib-pset" data-fire-success-event="event1" data-fire-learning-opportunity-event="event2" data-schema-version="1.0">
    <div class="os-raise-ib-pset-problem" data-problem-type="input" data-solution="42" data-problem-comparator="integer">
      <div class="os-raise-ib-pset-problem-content">
        <p>Input problem content</p>
      </div>
    </div>
    <div class="os-raise-ib-pset-problem" data-problem-type="dropdown" data-solution="red" data-solution-options='["red", "blue", "green"]'>
      <div class="os-raise-ib-pset-problem-content">
        <p>Dropdown problem content</p>
      </div>
    </div>
    <div class="os-raise-ib-pset-problem" data-problem-type="multiselect" data-solution='["red", "blue"]' data-solution-options='["red", "blue", "green"]'>
      <div class="os-raise-ib-pset-problem-content">
        <p>Multiselect problem content</p>
      </div>
    </div>
    <div class="os-raise-ib-pset-correct-response">
      <p>Generic correct response</p>
    </div>
    <div class="os-raise-ib-pset-encourage-response">
      <p>Generic encouragement response</p>
    </div>
  </div>
  `
  const divElem = document.createElement('div')
  divElem.innerHTML = psetContent
  const generatedProblemSetBlock = parseProblemSetBlock(divElem.children[0] as HTMLElement)

  expect(generatedProblemSetBlock).not.toBeNull()

  render(
    generatedProblemSetBlock ?? <></>
  )

  const successHandler = vi.fn()
  const learningOppHandler = vi.fn()
  document.addEventListener(`${OS_RAISE_IB_EVENT_PREFIX}-event1`, successHandler)
  document.addEventListener(`${OS_RAISE_IB_EVENT_PREFIX}-event2`, learningOppHandler)

  await act(async () => {
    screen.getByText('Solve Input').click()
    screen.getByText('Exhaust Multiselect').click()
    screen.getByText('Exhaust Dropdown').click()
  })

  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(learningOppHandler).toHaveBeenCalledTimes(1)
})

test('parseProblemSetBlock applies answer specific overrides and defaults', async () => {
  const psetContent = `
  <div class="os-raise-ib-pset" data-schema-version="1.0">
    <div class="os-raise-ib-pset-problem" data-problem-type="input" data-solution="42" data-problem-comparator="integer">
      <div class="os-raise-ib-pset-problem-content">
        <p>Input problem content</p>
      </div>
      <div class="os-raise-ib-pset-encourage-response" data-answer='41'>
        <p>Answer override encourage response</p>
      </div>
      <div class="os-raise-ib-pset-encourage-response" data-answer='40'>
        <p>Answer override encourage response 2</p>
      </div>
    </div>
    <div class="os-raise-ib-pset-problem" data-problem-type="dropdown" data-solution="red" data-solution-options='["red", "blue", "green"]'>
      <div class="os-raise-ib-pset-problem-content">
        <p>Dropdown problem content</p>
      </div>
    </div>
    <div class="os-raise-ib-pset-problem" data-problem-type="multiselect" data-solution='["red", "blue"]' data-solution-options='["red", "blue", "green"]'>
      <div class="os-raise-ib-pset-problem-content">
        <p>Multiselect problem content</p>
      </div>
    </div>
    <div class="os-raise-ib-pset-correct-response">
      <p>Generic correct response</p>
    </div>
    <div class="os-raise-ib-pset-encourage-response">
      <p>Generic encouragement response</p>
    </div>
  </div>
  `
  const divElem = document.createElement('div')
  divElem.innerHTML = psetContent
  const generatedProblemSetBlock = parseProblemSetBlock(divElem.children[0] as HTMLElement)

  expect(generatedProblemSetBlock).not.toBeNull()

  expect(generatedProblemSetBlock?.props.problems[0].answerResponses[0].response).toMatch('Answer override encourage response')
  expect(generatedProblemSetBlock?.props.problems[0].answerResponses[1].response).toMatch('Answer override encourage response 2')
  expect(generatedProblemSetBlock?.props.problems[0].retryLimit).toBe(0)
  expect(generatedProblemSetBlock?.props.problems[0].buttonText).toBe('Check')
  expect(generatedProblemSetBlock?.props.problems[1].correctResponse).toMatch('Generic correct response')
  expect(generatedProblemSetBlock?.props.problems[1].encourageResponse).toMatch('Generic encouragement response')
})

test('parseProblemSetBlock applies attempts exhausted response overrides', async () => {
  const psetContent = `
  <div class="os-raise-ib-pset" data-schema-version="1.0">
    <div class="os-raise-ib-pset-problem" data-problem-type="input" data-solution="42" data-problem-comparator="integer">
      <div class="os-raise-ib-pset-problem-content">
        <p>Input problem content</p>
      </div>
      <div class='os-raise-ib-pset-attempts-exhausted-response'>
        <p>The answer is 42 </p>
      </div>
    </div>
    <div class="os-raise-ib-pset-problem" data-problem-type="dropdown" data-solution="red" data-solution-options='["red", "blue", "green"]'>
      <div class="os-raise-ib-pset-problem-content">
        <p>Dropdown problem content</p>
      </div>
    </div>
    <div class="os-raise-ib-pset-problem" data-problem-type="multiselect" data-solution='["red", "blue"]' data-solution-options='["red", "blue", "green"]'>
      <div class="os-raise-ib-pset-problem-content">
        <p>Multiselect problem content</p>
      </div>
    </div>
    <div class="os-raise-ib-pset-correct-response">
      <p>Generic correct response</p>
    </div>
    <div class="os-raise-ib-pset-encourage-response">
      <p>Generic encouragement response</p>
    </div>
  </div>
  `
  const divElem = document.createElement('div')
  divElem.innerHTML = psetContent
  const generatedProblemSetBlock = parseProblemSetBlock(divElem.children[0] as HTMLElement)

  expect(generatedProblemSetBlock).not.toBeNull()

  expect(generatedProblemSetBlock?.props.problems[0].attemptsExhaustedResponse).toMatch('The answer is 42')
  expect(generatedProblemSetBlock?.props.problems[1].attemptsExhaustedResponse).toMatch('No more attempts allowed')
  expect(generatedProblemSetBlock?.props.problems[2].attemptsExhaustedResponse).toMatch('No more attempts allowed')
  expect(generatedProblemSetBlock?.props.problems[0].retryLimit).toBe(0)
  expect(generatedProblemSetBlock?.props.problems[0].buttonText).toBe('Check')
  expect(generatedProblemSetBlock?.props.problems[1].correctResponse).toMatch('Generic correct response')
  expect(generatedProblemSetBlock?.props.problems[1].encourageResponse).toMatch('Generic encouragement response')
})

test('ProblemSetBlock calls the onProblemAttempt handler', async () => {
  const psetContent = `
  <div class="os-raise-ib-pset" data-content-id="pset-content-1" data-schema-version="1.0">
    <div class="os-raise-ib-pset-problem" data-problem-type="input" data-solution="42" data-problem-comparator="integer">
      <div class="os-raise-ib-pset-problem-content">
        <p>Input problem content</p>
      </div>
      <div class="os-raise-ib-pset-correct-response">
        <p>Input problem correct response</p>
      </div>
      <div class="os-raise-ib-pset-encourage-response">
        <p>Input problem encourage response</p>
      </div>
    </div>
    <div class="os-raise-ib-pset-correct-response">
      <p>Generic correct response</p>
    </div>
    <div class="os-raise-ib-pset-encourage-response">
      <p>Generic encouragement response</p>
    </div>
  </div>
  `
  const divElem = document.createElement('div')
  divElem.innerHTML = psetContent
  const generatedProblemSetBlock = parseProblemSetBlock(divElem.children[0] as HTMLElement)

  Date.now = vi.fn(() => 12345)

  render(
    <ContentLoadedContext.Provider value={{ variant: 'testvariant', contentId: 'contentLoadedId' }}>
      {generatedProblemSetBlock ?? <></>}
    </ContentLoadedContext.Provider>
  )

  await act(async () => {
    screen.getByText('Attempt Input').click()
  })

  expect(queueIbPsetProblemAttemptedV1Event).toHaveBeenCalled()
  expect(queueIbPsetProblemAttemptedV1Event).toHaveBeenCalledWith(
    12345,
    'contentLoadedId',
    'testvariant',
    'input',
    'Response',
    false,
    1,
    false,
    'pset-content-1',
    'psetProblemContentIdValue'
  )
})

test('ProblemSetBlock does not call the onProblemAttempt handler on default context', async () => {
  const psetContent = `
  <div class="os-raise-ib-pset" data-content-id="pset-content-1" data-schema-version="1.0">
    <div class="os-raise-ib-pset-problem" data-problem-type="input" data-solution="42" data-problem-comparator="integer">
      <div class="os-raise-ib-pset-problem-content">
        <p>Input problem content</p>
      </div>
      <div class="os-raise-ib-pset-correct-response">
        <p>Input problem correct response</p>
      </div>
      <div class="os-raise-ib-pset-encourage-response">
        <p>Input problem encourage response</p>
      </div>
    </div>
    <div class="os-raise-ib-pset-correct-response">
      <p>Generic correct response</p>
    </div>
    <div class="os-raise-ib-pset-encourage-response">
      <p>Generic encouragement response</p>
    </div>
  </div>
  `
  const divElem = document.createElement('div')
  divElem.innerHTML = psetContent
  const generatedProblemSetBlock = parseProblemSetBlock(divElem.children[0] as HTMLElement)

  Date.now = vi.fn(() => 12345)

  render(
    generatedProblemSetBlock ?? <></>
  )

  await act(async () => {
    screen.getByText('Attempt Input').click()
  })

  expect(queueIbPsetProblemAttemptedV1Event).not.toHaveBeenCalled()
})

test('Problem level retry limits populate', async () => {
  const psetContent = `
  <div class="os-raise-ib-pset" data-retry-limit="1" data-schema-version="1.0">
    <div class="os-raise-ib-pset-problem" data-retry-limit="2" data-problem-type="input" data-solution="42" data-problem-comparator="integer">
      <div class="os-raise-ib-pset-problem-content">
        <p>Input problem content</p>
      </div>
      <div class='os-raise-ib-pset-attempts-exhausted-response'>
        <p>The answer is 42 </p>
      </div>
    </div>
    <div class="os-raise-ib-pset-problem" data-retry-limit="3" data-problem-type="dropdown" data-solution="red" data-solution-options='["red", "blue", "green"]'>
      <div class="os-raise-ib-pset-problem-content">
        <p>Dropdown problem content</p>
      </div>
    </div>
    <div class="os-raise-ib-pset-problem" data-retry-limit="4" data-problem-type="multiselect" data-solution='["red", "blue"]' data-solution-options='["red", "blue", "green"]'>
      <div class="os-raise-ib-pset-problem-content">
        <p>Multiselect problem content</p>
      </div>
    </div>
    <div class="os-raise-ib-pset-problem" data-problem-type="multiselect" data-solution='["red", "blue"]' data-solution-options='["red", "blue", "green"]'>
      <div class="os-raise-ib-pset-problem-content">
        <p>Multiselect problem content</p>
      </div>
    </div>
    <div class="os-raise-ib-pset-correct-response">
      <p>Generic correct response</p>
    </div>
    <div class="os-raise-ib-pset-encourage-response">
      <p>Generic encouragement response</p>
    </div>
  </div>
  `

  const divElem = document.createElement('div')
  divElem.innerHTML = psetContent
  const generatedProblemSetBlock = parseProblemSetBlock(divElem.children[0] as HTMLElement)

  expect(generatedProblemSetBlock).not.toBeNull()
  expect(generatedProblemSetBlock?.props.problems[0].problemRetryLimit).toBe(2)
  expect(generatedProblemSetBlock?.props.problems[1].problemRetryLimit).toBe(3)
  expect(generatedProblemSetBlock?.props.problems[2].problemRetryLimit).toBe(4)
  expect(generatedProblemSetBlock?.props.problems[3].problemRetryLimit).toBe(undefined)
  expect(generatedProblemSetBlock?.props.problems[3].retryLimit).toBe(1)
})
