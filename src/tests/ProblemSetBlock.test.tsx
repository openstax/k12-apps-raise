import { render, screen, fireEvent } from '@testing-library/react'
import { OS_RAISE_IB_EVENT_PREFIX, parseProblemSetBlock } from '../lib/blocks'
import '@testing-library/jest-dom'
import { ProblemData, ProblemSetBlock } from '../components/ProblemSetBlock'

jest.mock('../components/DropdownProblem', () => {
  return {
    DropdownProblem: () => (<p>Mock dropdown problem</p>)
  }
})

jest.mock('../components/MultiselectProblem', () => {
  return {
    MultiselectProblem: () => (<p>Mock multiselect problem</p>)
  }
})

jest.mock('../components/InputProblem', () => {
  return {
    InputProblem: () => (<p>Mock input problem</p>)
  }
})

const testProblems: ProblemData[] = [
  {
    type: 'input',
    solution: 'red',
    correctResponse: '',
    encourageResponse: '',
    retryLimit: 0,
    buttonText: 'Check',
    comparator: 'text'
  },
  {
    type: 'dropdown',
    solution: 'red',
    solutionOptions: '["red", "blue"]',
    correctResponse: '',
    encourageResponse: '',
    retryLimit: 0,
    buttonText: 'Check'
  },
  {
    type: 'multiselect',
    solution: '["red"]',
    solutionOptions: '["red", "blue"]',
    correctResponse: '',
    encourageResponse: '',
    retryLimit: 0,
    buttonText: 'Check'
  }
]

test('ProblemSetBlock renders with questions', async () => {
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
    generatedProblemSetBlock as JSX.Element
  )

  expect(screen.queryByText('Mock input problem')).toBeNull()
  fireEvent(document, new CustomEvent(`${OS_RAISE_IB_EVENT_PREFIX}-event1`))
  screen.getByText('Mock input problem')
})
