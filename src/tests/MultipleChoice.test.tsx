import { render, screen, act } from '@testing-library/react'
import { MultipleChoiceProblem, buildClassName } from '../components/MultipleChoiceProblem'
import '@testing-library/jest-dom'

test('MultipleChoiceProblem renders', async () => {
  render(
    <MultipleChoiceProblem
    solutionOptions={'["Option 1", "Option 2", "Option 3"]'}
    solvedCallback={() => {}}
    exhaustedCallback={() => {}}
    allowedRetryCallback={() => {}}
    content={'<p>Problem text</p>'}
    correctResponse={''}
    encourageResponse={''}
    retryLimit={0}
    solution={''}
    buttonText={'Check'}
    contentId={'c2c322d9-9297-4928-b763-ae581ce6bb47'}
    attemptsExhaustedResponse={''}
    answerResponses={[]}
    />
  )

  screen.getByText('Problem text')
  screen.getByText('Option 1')
  screen.getByText('Option 2')
  screen.getByText('Option 3')
  expect(screen.getByRole('button')).toHaveTextContent('Check')
})

test('MultipleChoiceProblem renders without contentId', async () => {
  render(
    <MultipleChoiceProblem
    solutionOptions={'["Option 1", "Option 2", "Option 3"]'}
    solvedCallback={() => {}}
    exhaustedCallback={() => {}}
    allowedRetryCallback={() => {}}
    content={'<p>Problem text</p>'}
    correctResponse={''}
    encourageResponse={''}
    retryLimit={0}
    solution={''}
    buttonText={'Check'}
    attemptsExhaustedResponse={''}
    answerResponses={[]}
    />
  )

  screen.getByText('Problem text')
  screen.getByText('Option 1')
  screen.getByText('Option 2')
  screen.getByText('Option 3')
  expect(screen.getByRole('button')).toHaveTextContent('Check')
})

test('MultipleChoiceProblem shows message if user does not select an option', async () => {
  render(
    <MultipleChoiceProblem
    solutionOptions={'["Option 1", "Option 2", "Option 3"]'}
    solvedCallback={() => {}}
    exhaustedCallback={() => {}}
    allowedRetryCallback={() => {}}
    content={'<p>Problem text</p>'}
    correctResponse={''}
    encourageResponse={''}
    retryLimit={0}
    solution={''}
    buttonText={'Check'}
    attemptsExhaustedResponse={''}
    answerResponses={[]}
    />
  )

  await act(async () => {
    screen.getByRole('button').click()
  })
  await screen.findByText('Please select an answer')
})

test('DropdownProblem shows correct response, invokes callback, and disables self on check with match', async () => {
  const solvedHandler = jest.fn()
  const exhaustedHandler = jest.fn()
  const allowedRetryHandler = jest.fn()

  render(
    <MultipleChoiceProblem
    solutionOptions={'["Option 1", "Option 2", "Option 3"]'}
    solvedCallback={solvedHandler}
    exhaustedCallback={exhaustedHandler}
    allowedRetryCallback={allowedRetryHandler}
    content={'<p>Problem text</p>'}
    correctResponse={'<p>Great job!</p>'}
    encourageResponse={''}
    retryLimit={0}
    solution={'Option 2'}
    buttonText={'Check'}
    attemptsExhaustedResponse={''}
    answerResponses={[]}
    />
  )
  await screen.findByText('Attempts left: Unlimited')

  await act(async () => {
    screen.getByText('Option 2').click()
    screen.getByRole('button').click()
  })
  await screen.findByText('Great job!')
  expect(solvedHandler).toHaveBeenCalledTimes(1)
  expect(exhaustedHandler).toHaveBeenCalledTimes(0)
  expect(allowedRetryHandler).toHaveBeenCalledTimes(0)
  expect(screen.getByLabelText('Option 1')).toBeDisabled()
  expect(screen.getByRole('button')).toBeDisabled()
})

test('MultipleChoiceProblem shows encourage response and invokes callback on check with no match and retries remaining', async () => {
  const solvedHandler = jest.fn()
  const exhaustedHandler = jest.fn()
  const allowedRetryHandler = jest.fn()

  render(
    <MultipleChoiceProblem
    solutionOptions={'["Option 1", "Option 2", "Option 3"]'}
    solvedCallback={solvedHandler}
    exhaustedCallback={exhaustedHandler}
    allowedRetryCallback={allowedRetryHandler}
    content={'<p>Problem text</p>'}
    correctResponse={''}
    encourageResponse={'<p>Try again!</p>'}
    retryLimit={0}
    solution={'Option 2'}
    buttonText={'Check'}
    attemptsExhaustedResponse={''}
    answerResponses={[]}
    />
  )

  await act(async () => {
    screen.getByText('Option 1').click()
    screen.getByRole('button').click()
  })
  await screen.findByText('Try again!')
  expect(solvedHandler).toHaveBeenCalledTimes(0)
  expect(exhaustedHandler).toHaveBeenCalledTimes(0)
  expect(allowedRetryHandler).toHaveBeenCalledTimes(1)
})

test('MultipleChoiceProblem clears encourage response when user changes answer', async () => {
  render(
    <MultipleChoiceProblem
    solutionOptions={'["Option 1", "Option 2", "Option 3"]'}
    solvedCallback={() => {}}
    exhaustedCallback={() => {}}
    allowedRetryCallback={() => {}}
    content={'<p>Problem text</p>'}
    correctResponse={''}
    encourageResponse={'<p>Try again!</p>'}
    retryLimit={0}
    solution={'Option 2'}
    buttonText={'Check'}
    attemptsExhaustedResponse={''}
    answerResponses={[]}
    />
  )

  await act(async () => {
    screen.getByText('Option 1').click()
    screen.getByRole('button').click()
  })
  await screen.findByText('Try again!')
  await act(async () => {
    screen.getByText('Option 2').click()
  })
  expect(screen.queryByText('Try again!')).toBeNull()
})

test('MultipleChoiceProblem exhausts and disables itself after configured number of retries', async () => {
  const solvedHandler = jest.fn()
  const exhaustedHandler = jest.fn()
  const allowedRetryHandler = jest.fn()

  render(
    <MultipleChoiceProblem
    solutionOptions={'["Option 1", "Option 2", "Option 3"]'}
    solvedCallback={solvedHandler}
    exhaustedCallback={exhaustedHandler}
    allowedRetryCallback={allowedRetryHandler}
    content={'<p>Problem text</p>'}
    correctResponse={''}
    encourageResponse={'<p>Try again!</p>'}
    retryLimit={3}
    solution={'Option 2'}
    buttonText={'Check'}
    attemptsExhaustedResponse={'No more attempts allowed'}
    answerResponses={[]}
    />
  )
  await screen.findByText('Attempts left: 4/4')

  await act(async () => {
    screen.getByText('Option 1').click()
    screen.getByRole('button').click()
    screen.getByRole('button').click()
    screen.getByRole('button').click()
  })
  await screen.findByText('Attempts left: 1/4')

  await screen.findByText('Try again!')
  expect(solvedHandler).toHaveBeenCalledTimes(0)
  expect(exhaustedHandler).toHaveBeenCalledTimes(0)
  expect(allowedRetryHandler).toHaveBeenCalledTimes(3)

  await act(async () => {
    screen.getByText('Option 1').click()
    screen.getByRole('button').click()
  })
  await screen.findByText('Attempts left: 0/4')

  expect(screen.queryByText('Try again!')).toBeNull()
  expect(solvedHandler).toHaveBeenCalledTimes(0)
  expect(exhaustedHandler).toHaveBeenCalledTimes(1)
  expect(allowedRetryHandler).toHaveBeenCalledTimes(3)
  expect(screen.getByLabelText('Option 2')).toBeDisabled()
  expect(screen.getByRole('button')).toBeDisabled()
  screen.getByText('No more attempts allowed')
})

test('MultipleChoiceProblem renders answer specific responses', async () => {
  render(
    <MultipleChoiceProblem
    solutionOptions={'["Option 1", "Option 2", "Option 3"]'}
    solvedCallback={() => {}}
    exhaustedCallback={() => {}}
    allowedRetryCallback={() => {}}
    content={'<p>Problem text</p>'}
    correctResponse={''}
    encourageResponse={'<p>Try again!</p>'}
    retryLimit={0}
    solution={'Option 2'}
    buttonText={'Check'}
    attemptsExhaustedResponse={''}
    answerResponses={[{ answer: 'Option 1', response: 'Almost There' }, { answer: 'Option 3', response: 'Even Closer' }]}
    />
  )

  await act(async () => {
    screen.getByText('Option 1').click()
    screen.getByRole('button').click()
  })
  await screen.findByText('Almost There')
  expect(screen.queryByText('Try again!')).toBeNull()
  await act(async () => {
    screen.getByText('Option 3').click()
    screen.getByRole('button').click()
  })
  await screen.findByText('Even Closer')
  expect(screen.queryByText('Try again!')).toBeNull()
  expect(screen.queryByText('Almost There')).toBeNull()
})

test('MultipleChoiceProblem renders answer specific responses only on button clicks', async () => {
  render(
    <MultipleChoiceProblem
    solutionOptions={'["Option 1", "Option 2", "Option 3"]'}
    solvedCallback={() => {}}
    exhaustedCallback={() => {}}
    allowedRetryCallback={() => {}}
    content={'<p>Problem text</p>'}
    correctResponse={''}
    encourageResponse={'<p>Try again!</p>'}
    retryLimit={0}
    solution={'Option 2'}
    buttonText={'Check'}
    attemptsExhaustedResponse={''}
    answerResponses={[{ answer: 'Option 1', response: 'Almost There' }, { answer: 'Option 3', response: 'Even Closer' }]}
    />
  )

  await act(async () => {
    screen.getByText('Option 1').click()
    screen.getByRole('button').click()
  })
  await screen.findByText('Almost There')
  await act(async () => {
    screen.getByText('Option 3').click()
  })
  expect(screen.queryByText('Almost There')).toBeNull()
})

test('MultipleChoiceProblem calls the onProblemAttempt handler', async () => {
  const problemAttemptedHandler = jest.fn()
  render(
    <MultipleChoiceProblem
    solutionOptions={'["Option 1", "Option 2", "Option 3"]'}
    solvedCallback={() => {}}
    exhaustedCallback={() => {}}
    allowedRetryCallback={() => {}}
    content={'<p>Problem text</p>'}
    correctResponse={''}
    encourageResponse={'<p>Try again!</p>'}
    retryLimit={1}
    solution={'Option 2'}
    buttonText={'Check'}
    attemptsExhaustedResponse={''}
    contentId={'dataContentId'}
    answerResponses={[{ answer: 'Option 1', response: 'Almost There' }, { answer: 'Option 3', response: 'Even Closer' }]}
    onProblemAttempt={problemAttemptedHandler}
    />
  )
  await screen.findByText('Attempts left: 2/2')

  await act(async () => {
    screen.getByText('Option 1').click()
    screen.getByRole('button').click()
  })
  await screen.findByText('Attempts left: 1/2')

  expect(problemAttemptedHandler).toHaveBeenCalledTimes(1)
  expect(problemAttemptedHandler).toHaveBeenCalledWith(
    'Option 1',
    false,
    1,
    false,
    'dataContentId'
  )
  await act(async () => {
    screen.getByText('Option 3').click()
    screen.getByRole('button').click()
  })
  expect(problemAttemptedHandler).toHaveBeenCalledTimes(2)
  expect(problemAttemptedHandler).toHaveBeenLastCalledWith(
    'Option 3',
    false,
    2,
    true,
    'dataContentId'
  )
})

test('returns the correct className string', () => {
  const val = 'A'
  let solution = 'A'
  const response = 'A'
  const showAnswers = true

  let className = buildClassName(val, solution, response, showAnswers)

  expect(className).toEqual('os-form-check os-default-answer-choice os-correct-answer-choice os-disabled os-selected-answer-choice')

  solution = 'B'

  className = buildClassName(val, solution, response, showAnswers)

  expect(className).toEqual('os-form-check os-default-answer-choice os-wrong-answer-choice os-disabled os-selected-answer-choice')
})
