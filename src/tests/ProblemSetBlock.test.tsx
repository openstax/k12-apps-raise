import { parseProblemSetBlock } from '../lib/blocks'
import '@testing-library/jest-dom'

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

test('ProblemSetBlock renders with questions', async () => {})

test('parseProblemSetBlock applies question overrides and defaults', async () => {
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
