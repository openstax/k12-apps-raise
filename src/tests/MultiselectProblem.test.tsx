import { fireEvent, render, screen, act } from '@testing-library/react'
import { MultiselectProblem, buildClassName } from '../components/MultiselectProblem'
import '@testing-library/jest-dom'

test('MultiselectProblem renders', async () => {
  render(
    <MultiselectProblem
    solutionOptions={'["Option 1", "Option 2", "Option 3"]'}
    solvedCallback={() => {}}
    exhaustedCallback={() => {}}
    allowedRetryCallback={() => {}}
    content={'<p>Question Content</p>'}
    correctResponse={''}
    encourageResponse={''}
    retryLimit={0}
    solution={'[]'}
    buttonText={'Check'}
    contentId={'c2c322d9-9297-4928-b763-ae581ce6bb47'}
    attemptsExhaustedResponse={''}
    answerResponses={[]}
    />
  )
  screen.getByText('Question Content')
  screen.getByText('Option 1')
  screen.getByText('Option 2')
  screen.getByText('Option 3')
  expect(screen.getByRole('button')).toHaveTextContent('Check')
})

test('MultiselectProblem renders without contentId', async () => {
  render(
    <MultiselectProblem
    solutionOptions={'["Option 1", "Option 2", "Option 3"]'}
    solvedCallback={() => {}}
    exhaustedCallback={() => {}}
    allowedRetryCallback={() => {}}
    content={'<p>Question Content</p>'}
    correctResponse={''}
    encourageResponse={''}
    retryLimit={0}
    solution={'[]'}
    buttonText={'Check'}
    attemptsExhaustedResponse={''}
    answerResponses={[]}
    />
  )
  screen.getByText('Question Content')
  screen.getByText('Option 1')
  screen.getByText('Option 2')
  screen.getByText('Option 3')
  expect(screen.getByRole('button')).toHaveTextContent('Check')
})

test('Multiselect shows message if user does not select an option', async () => {
  render(
    <MultiselectProblem
    solutionOptions={'["Option 1", "Option 2", "Option 3"]'}
    solvedCallback={() => {}}
    exhaustedCallback={() => {}}
    allowedRetryCallback={() => {}}
    content={'<p>Problem text</p>'}
    correctResponse={''}
    encourageResponse={''}
    retryLimit={0}
    solution={'[]'}
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

test('Multiselect shows correct response, invokes callback, and disables self on check with match', async () => {
  const solvedHandler = jest.fn()
  const exhaustedHandler = jest.fn()
  const allowedRetryHandler = jest.fn()

  render(
    <MultiselectProblem
    solutionOptions={'["Option 1", "Option 2", "Option 3"]'}
    solvedCallback={solvedHandler}
    exhaustedCallback={exhaustedHandler}
    allowedRetryCallback={allowedRetryHandler}
    content={'<p>Problem text</p>'}
    correctResponse={'<p>Great job!</p>'}
    encourageResponse={''}
    retryLimit={0}
    solution={'["Option 2", "Option 3"]'}
    buttonText={'Check'}
    attemptsExhaustedResponse={''}
    answerResponses={[]}
    />
  )

  await act(async () => {
    fireEvent.click(screen.getByLabelText('Option 2'))
    fireEvent.click(screen.getByLabelText('Option 3'))
    screen.getByRole('button').click()
  })
  await screen.findByText('Great job!')
  expect(solvedHandler).toBeCalledTimes(1)
  expect(exhaustedHandler).toBeCalledTimes(0)
  expect(allowedRetryHandler).toBeCalledTimes(0)
  expect(screen.getByDisplayValue('Option 1')).toHaveAttribute('disabled')
  expect(screen.getByDisplayValue('Option 2')).toHaveAttribute('disabled')
  expect(screen.getByDisplayValue('Option 3')).toHaveAttribute('disabled')
  expect(screen.getByRole('button')).toBeDisabled()
})

test('Multiselect shows incorrect response, then check is unclicked, and correct response is triggered', async () => {
  const solvedHandler = jest.fn()
  const exhaustedHandler = jest.fn()
  const allowedRetryHandler = jest.fn()

  render(
    <MultiselectProblem
    solutionOptions={'["Option 1", "Option 2", "Option 3"]'}
    solvedCallback={solvedHandler}
    exhaustedCallback={exhaustedHandler}
    allowedRetryCallback={allowedRetryHandler}
    content={'<p>Problem text</p>'}
    correctResponse={'<p>Great job!</p>'}
    encourageResponse={'<p>Try again!'}
    retryLimit={0}
    solution={'["Option 2", "Option 3"]'}
    buttonText={'Check'}
    attemptsExhaustedResponse={''}
    answerResponses={[]}
    />
  )

  await act(async () => {
    fireEvent.click(screen.getByLabelText('Option 1'))
    fireEvent.click(screen.getByLabelText('Option 2'))
    fireEvent.click(screen.getByLabelText('Option 3'))
    screen.getByRole('button').click()
  })
  await screen.findByText('Try again!')
  expect(solvedHandler).toBeCalledTimes(0)
  expect(exhaustedHandler).toBeCalledTimes(0)
  expect(allowedRetryHandler).toBeCalledTimes(1)
  await act(async () => {
    fireEvent.click(screen.getByLabelText('Option 1'))
    screen.getByRole('button').click()
  })
  await screen.findByText('Great job!')
  expect(solvedHandler).toBeCalledTimes(1)
  expect(exhaustedHandler).toBeCalledTimes(0)
  expect(allowedRetryHandler).toBeCalledTimes(1)
  expect(screen.getByDisplayValue('Option 1')).toHaveAttribute('disabled')
  expect(screen.getByDisplayValue('Option 2')).toHaveAttribute('disabled')
  expect(screen.getByDisplayValue('Option 3')).toHaveAttribute('disabled')
  expect(screen.getByRole('button')).toBeDisabled()
})

test('MultiselectProblem shows encourage response and invokes callback on check with no match and retries remaining', async () => {
  const solvedHandler = jest.fn()
  const exhaustedHandler = jest.fn()
  const allowedRetryHandler = jest.fn()

  render(
    <MultiselectProblem
    solutionOptions={'["Option 1", "Option 2", "Option 3"]'}
    solvedCallback={solvedHandler}
    exhaustedCallback={exhaustedHandler}
    allowedRetryCallback={allowedRetryHandler}
    content={'<p>Problem text</p>'}
    correctResponse={''}
    encourageResponse={'<p>Try again!</p>'}
    retryLimit={0}
    solution={'["Option "]'}
    buttonText={'Check'}
    attemptsExhaustedResponse={''}
    answerResponses={[]}
    />
  )
  await screen.findByText('Attempts left: Unlimited')
  await act(async () => {
    fireEvent.click(screen.getByLabelText('Option 2'))
    screen.getByRole('button').click()
  })
  await screen.findByText('Try again!')
  expect(solvedHandler).toBeCalledTimes(0)
  expect(exhaustedHandler).toBeCalledTimes(0)
  expect(allowedRetryHandler).toBeCalledTimes(1)
})

test('MultiselectProblem clears encourage response when user changes answer', async () => {
  render(
    <MultiselectProblem
    solutionOptions={'["Option 1", "Option 2", "Option 3"]'}
    solvedCallback={() => {}}
    exhaustedCallback={() => {}}
    allowedRetryCallback={() => {}}
    content={'<p>Problem text</p>'}
    correctResponse={''}
    encourageResponse={'<p>Try again!</p>'}
    retryLimit={0}
    solution={'["Option 2"]'}
    buttonText={'Check'}
    attemptsExhaustedResponse={''}
    answerResponses={[]}
    />
  )

  await act(async () => {
    fireEvent.click(screen.getByLabelText('Option 1'))
    screen.getByRole('button').click()
  })
  await screen.findByText('Try again!')
  await act(async () => {
    fireEvent.click(screen.getByLabelText('Option 2'))
  })
  expect(screen.queryByText('Try again!')).toBeNull()
})

test('MultiselectProblem exhausts and disables itself after configured number of retries', async () => {
  const solvedHandler = jest.fn()
  const exhaustedHandler = jest.fn()
  const allowedRetryHandler = jest.fn()

  render(
    <MultiselectProblem
    solutionOptions={'["Option 1", "Option 2", "Option 3"]'}
    solvedCallback={solvedHandler}
    exhaustedCallback={exhaustedHandler}
    allowedRetryCallback={allowedRetryHandler}
    content={'<p>Problem text</p>'}
    correctResponse={''}
    encourageResponse={'<p>Try again!</p>'}
    retryLimit={3}
    solution={'["Option 2"]'}
    buttonText={'Check'}
    attemptsExhaustedResponse={'No more attempts allowed'}
    answerResponses={[]}
    />
  )
  await screen.findByText('Attempts left: 4/4')

  await act(async () => {
    fireEvent.click(screen.getByLabelText('Option 1'))
    screen.getByRole('button').click()
    screen.getByRole('button').click()
    screen.getByRole('button').click()
  })
  await screen.findByText('Attempts left: 1/4')
  await screen.findByText('Try again!')
  expect(solvedHandler).toBeCalledTimes(0)
  expect(exhaustedHandler).toBeCalledTimes(0)
  expect(allowedRetryHandler).toBeCalledTimes(3)

  await act(async () => {
    fireEvent.click(screen.getByLabelText('Option 2'))
    screen.getByRole('button').click()
  })
  await screen.findByText('Attempts left: 0/4')

  expect(screen.queryByText('Try again!')).toBeNull()
  expect(solvedHandler).toBeCalledTimes(0)
  expect(exhaustedHandler).toBeCalledTimes(1)
  expect(allowedRetryHandler).toBeCalledTimes(3)
  expect(screen.getByDisplayValue('Option 1')).toHaveAttribute('disabled')
  expect(screen.getByDisplayValue('Option 2')).toHaveAttribute('disabled')
  expect(screen.getByDisplayValue('Option 3')).toHaveAttribute('disabled')
  expect(screen.getByRole('button')).toBeDisabled()
  screen.getByText('No more attempts allowed')
})

test('MultiselectProblem renders answer specific responses', async () => {
  const solvedHandler = jest.fn()
  const exhaustedHandler = jest.fn()
  const allowedRetryHandler = jest.fn()

  render(
    <MultiselectProblem
    solutionOptions={'["Option 1", "Option 2", "Option 3"]'}
    solvedCallback={solvedHandler}
    exhaustedCallback={exhaustedHandler}
    allowedRetryCallback={allowedRetryHandler}
    content={'<p>Problem text</p>'}
    correctResponse={'<p>Correct</p>'}
    encourageResponse={'<p>Try again!</p>'}
    retryLimit={3}
    solution={'["Option 2"]'}
    buttonText={'Check'}
    attemptsExhaustedResponse={''}
    answerResponses={[{ answer: '["Option 1"]', response: 'Almost There' }, { answer: '["Option 3", "Option 1"]', response: 'Even Closer' }]}
    />
  )
  await screen.findByText('Attempts left: 4/4')

  await act(async () => {
    fireEvent.click(screen.getByLabelText('Option 1'))
    screen.getByRole('button').click()
  })
  await screen.findByText('Attempts left: 3/4')

  await screen.findByText('Almost There')
  expect(screen.queryByText('Try again!')).toBeNull()

  await act(async () => {
    fireEvent.click(screen.getByLabelText('Option 3'))
    screen.getByRole('button').click()
  })
  await screen.findByText('Attempts left: 2/4')

  await screen.findByText('Even Closer')
  expect(screen.queryByText('Almost')).toBeNull()
  await act(async () => {
    fireEvent.click(screen.getByLabelText('Option 3'))
    fireEvent.click(screen.getByLabelText('Option 2'))
    fireEvent.click(screen.getByLabelText('Option 1'))
    screen.getByRole('button').click()
  })
  await screen.findByText('Correct')
  await screen.findByText('Attempts left: 2/4')
})

test('MultiselectProblem renders answer specific responses only on submit', async () => {
  const solvedHandler = jest.fn()
  const exhaustedHandler = jest.fn()
  const allowedRetryHandler = jest.fn()

  render(
    <MultiselectProblem
    solutionOptions={'["Option 1", "Option 2", "Option 3"]'}
    solvedCallback={solvedHandler}
    exhaustedCallback={exhaustedHandler}
    allowedRetryCallback={allowedRetryHandler}
    content={'<p>Problem text</p>'}
    correctResponse={'<p>Correct</p>'}
    encourageResponse={'<p>Try again!</p>'}
    retryLimit={3}
    solution={'["Option 2"]'}
    buttonText={'Check'}
    attemptsExhaustedResponse={''}
    answerResponses={[{ answer: '["Option 1"]', response: 'Almost There' }, { answer: '["Option 3", "Option 1"]', response: 'Even Closer' }]}
    />
  )

  await act(async () => {
    fireEvent.click(screen.getByLabelText('Option 1'))
  })
  expect(screen.queryByText('Almost There')).toBeNull()
  await act(async () => {
    screen.getByRole('button').click()
  })
  await screen.findByText('Almost There')
  await act(async () => {
    fireEvent.click(screen.getByLabelText('Option 3'))
  })
  expect(screen.queryByText('Almost There')).toBeNull()
  expect(screen.queryByText('Even Closer')).toBeNull()
})

test('multiselect calls the onProblemAttempt handler', async () => {
  const problemAttemptedHandler = jest.fn()

  render(
    <MultiselectProblem
    solutionOptions={'["Option 1", "Option 2", "Option 3"]'}
    solvedCallback={() => {}}
    exhaustedCallback={() => {}}
    allowedRetryCallback={() => {}}
    content={'<p>Problem text</p>'}
    correctResponse={'<p>Correct</p>'}
    encourageResponse={'<p>Try again!</p>'}
    retryLimit={1}
    solution={'["Option 2"]'}
    buttonText={'Check'}
    attemptsExhaustedResponse={''}
    answerResponses={[{ answer: '["Option 1"]', response: 'Almost There' }, { answer: '["Option 3", "Option 1"]', response: 'Even Closer' }]}
    contentId={'dataContentId'}
    onProblemAttempt={problemAttemptedHandler}
          />
  )
  await act(async () => {
    fireEvent.click(screen.getByLabelText('Option 1'))
    screen.getByRole('button').click()
  })
  expect(problemAttemptedHandler).toBeCalledTimes(1)
  expect(problemAttemptedHandler).toHaveBeenCalledWith(
    ['Option 1'],
    false,
    1,
    false,
    'dataContentId'
  )

  await act(async () => {
    fireEvent.click(screen.getByLabelText('Option 2'))
    screen.getByRole('button').click()
  })
  expect(problemAttemptedHandler).toBeCalledTimes(2)
  expect(problemAttemptedHandler).toHaveBeenLastCalledWith(
    ['Option 1', 'Option 2'],
    false,
    2,
    true,
    'dataContentId'
  )
})

test('returns the correct className string', () => {
  const solutionArray = ['A', 'B']
  const showAnswers = true
  let val = 'B'
  let values = { response: ['A', 'B'] }
  const expectedCorrectClassName =
    'os-default-answer-choice os-correct-answer-choice os-no-box-shadow os-selected-answer-choice os-form-check'
  const expectedIncorrectClassName =
    'os-default-answer-choice os-wrong-answer-choice os-no-box-shadow os-selected-answer-choice os-form-check'

  const correctAnswerClassName = buildClassName(solutionArray, showAnswers, val, values)

  expect(correctAnswerClassName).toBe(expectedCorrectClassName)
  val = 'C'
  values = { response: ['A', 'B', 'C'] }
  const incorrectAnswerClassName = buildClassName(solutionArray, showAnswers, val, values)
  expect(incorrectAnswerClassName).toBe(expectedIncorrectClassName)
})
