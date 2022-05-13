import { fireEvent, render, screen, act } from '@testing-library/react'
import { MultiselectProblem } from '../components/MultiselectProblem'
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
    />
  )

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
    />
  )

  await act(async () => {
    fireEvent.click(screen.getByLabelText('Option 1'))
    screen.getByRole('button').click()
    screen.getByRole('button').click()
    screen.getByRole('button').click()
  })
  await screen.findByText('Try again!')
  expect(solvedHandler).toBeCalledTimes(0)
  expect(exhaustedHandler).toBeCalledTimes(0)
  expect(allowedRetryHandler).toBeCalledTimes(3)

  await act(async () => {
    fireEvent.click(screen.getByLabelText('Option 2'))
    screen.getByRole('button').click()
  })
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
