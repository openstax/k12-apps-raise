import { render, screen, fireEvent, act } from '@testing-library/react'
import { InputProblem, MAX_CHARACTER_INPUT_PROBLEM_LENGTH } from '../components/InputProblem'
import '@testing-library/jest-dom'

test('InputProblem renders with content, input and button', async () => {
  render(
        <InputProblem
      solvedCallback={() => { } }
      exhaustedCallback={() => { } }
      allowedRetryCallback={() => { } }
      content={'Content'}
      correctResponse={''}
      encourageResponse={''}
      retryLimit={0}
      solution={' 5 '}
      buttonText={'Submit'}
      comparator={'integer'}
      attemptsExhaustedResponse={''}
      answerResponses={[]}
      />
  )

  screen.getByText('Content')
  screen.getByRole('textbox')
  expect(document.querySelector('input')).not.toBeNull()
  expect(screen.getByRole('button').textContent).toBe('Submit')
})

test('Text InputProblem button click with correct answer should evaluate to correct', async () => {
  const solvedHandler = jest.fn()
  const exhaustedHandler = jest.fn()
  const allowedRetryHandler = jest.fn()

  render(
          <InputProblem
          solvedCallback={solvedHandler}
          exhaustedCallback={exhaustedHandler}
          allowedRetryCallback={allowedRetryHandler}
          content={'Content'}
          correctResponse={'Correct!'}
          encourageResponse={''}
          retryLimit={0}
          solution={' Apple '}
          buttonText={'Submit'}
          comparator={'text'}
          attemptsExhaustedResponse={''}
          answerResponses={[]}
          />
  )

  await act(async () => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Apple ' } })
    screen.getByRole('button').click()
  })
  await screen.findByText('Correct!')
  expect(screen.getByRole('textbox')).toBeDisabled()
  expect(screen.getByRole('button')).toBeDisabled()
  expect(solvedHandler).toBeCalledTimes(1)
  expect(exhaustedHandler).toBeCalledTimes(0)
  expect(allowedRetryHandler).toBeCalledTimes(0)
})

test('InputProblem button click with no input should show warning', async () => {
  render(
          <InputProblem
          solvedCallback={() => {}}
          exhaustedCallback={() => {}}
          allowedRetryCallback={() => {}}
          content={'Content'}
          correctResponse={''}
          encourageResponse={''}
          retryLimit={0}
          solution={' 5 '}
          buttonText={'Submit'}
          comparator={'integer'}
          attemptsExhaustedResponse={''}
          answerResponses={[]}
          />
  )
  await act(async () => {
    screen.getByRole('button').click()
  })
  await screen.findByText('Please provide an Integer')
})
test('InputProblem textbox is expecting float but got text.', async () => {
  render(
          <InputProblem
          solvedCallback={() => {}}
          exhaustedCallback={() => {}}
          allowedRetryCallback={() => {}}
          content={'Content'}
          correctResponse={''}
          encourageResponse={''}
          retryLimit={0}
          solution={' 5 '}
          buttonText={'Submit'}
          comparator={'float'}
          attemptsExhaustedResponse={''}
          answerResponses={[]}
          />
  )
  await act(async () => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Wrong input' } })
    screen.getByRole('button').click()
  })
  await screen.findByText('Please provide a number')
})

test('InputProblem textbox is expecting Integer but input was text.', async () => {
  render(
          <InputProblem
          solvedCallback={() => {}}
          exhaustedCallback={() => {}}
          allowedRetryCallback={() => {}}
          content={'Content'}
          correctResponse={''}
          encourageResponse={''}
          retryLimit={0}
          solution={' 5 '}
          buttonText={'Submit'}
          comparator={'integer'}
          attemptsExhaustedResponse={''}
          answerResponses={[]}
          />
  )
  await act(async () => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Wrong input!' } })
    screen.getByRole('button').click()
  })
  await screen.findByText('Please provide an Integer')
})

test('InputProblem string text was too long', async () => {
  render(
          <InputProblem
          solvedCallback={() => {}}
          exhaustedCallback={() => {}}
          allowedRetryCallback={() => {}}
          content={'Content'}
          correctResponse={''}
          encourageResponse={''}
          retryLimit={0}
          solution={' a '}
          buttonText={'Submit'}
          comparator={'string'}
          attemptsExhaustedResponse={''}
          answerResponses={[]}
          />
  )
  await act(async () => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'a'.repeat(MAX_CHARACTER_INPUT_PROBLEM_LENGTH + 1) } })
    screen.getByRole('button').click()
  })
  await screen.findByText('Input is too long')
})

test('InputProblem button click with wrong answer should evaluate to incorrect', async () => {
  const solvedHandler = jest.fn()
  const exhaustedHandler = jest.fn()
  const allowedRetryHandler = jest.fn()

  render(
          <InputProblem
          solvedCallback={solvedHandler}
          exhaustedCallback={exhaustedHandler}
          allowedRetryCallback={allowedRetryHandler}
          content={'Content'}
          correctResponse={''}
          encourageResponse={'Try again!'}
          retryLimit={0}
          solution={' 5 '}
          buttonText={'Submit'}
          comparator={'integer'}
          attemptsExhaustedResponse={''}
          answerResponses={[]}
          />
  )
  await act(async () => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '4' } })
    screen.getByRole('button').click()
  })
  await screen.findByText('Try again!')
  expect(solvedHandler).toBeCalledTimes(0)
  expect(exhaustedHandler).toBeCalledTimes(0)
  expect(allowedRetryHandler).toBeCalledTimes(1)
})

test('Retry limit, encourageResponse, and exausted callback test', async () => {
  const solvedHandler = jest.fn()
  const exhaustedHandler = jest.fn()
  const allowedRetryHandler = jest.fn()

  render(
          <InputProblem
          solvedCallback={solvedHandler}
          exhaustedCallback={exhaustedHandler}
          allowedRetryCallback={allowedRetryHandler}
          content={'Content'}
          correctResponse={'Correct!'}
          encourageResponse={'Try again!'}
          retryLimit={3}
          solution={' 5 '}
          buttonText={'Submit'}
          comparator={'integer'}
          attemptsExhaustedResponse={'No more attempts allowed'}
          answerResponses={[]}
          />
  )
  await act(async () => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '4' } })
    screen.getByRole('button').click()
    screen.getByRole('button').click()
    screen.getByRole('button').click()
  })
  await screen.findByText('Try again!')

  await act(async () => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '3' } })
    screen.getByRole('button').click()
  })

  await screen.findByText('No more attempts allowed')
  expect(screen.getByRole('textbox')).toBeDisabled()
  expect(screen.getByRole('button')).toBeDisabled()

  expect(solvedHandler).toBeCalledTimes(0)
  expect(exhaustedHandler).toBeCalledTimes(1)
  expect(allowedRetryHandler).toBeCalledTimes(3)
})

test('InputProblem renders answer specific content', async () => {
  const solvedHandler = jest.fn()
  const exhaustedHandler = jest.fn()
  const allowedRetryHandler = jest.fn()

  render(
          <InputProblem
          solvedCallback={solvedHandler}
          exhaustedCallback={exhaustedHandler}
          allowedRetryCallback={allowedRetryHandler}
          content={'Content'}
          correctResponse={'Correct!'}
          encourageResponse={'Try again!'}
          retryLimit={3}
          solution={' 5 '}
          buttonText={'Submit'}
          comparator={'integer'}
          attemptsExhaustedResponse={''}
          answerResponses={[{ answer: '3', response: 'Almost There' }, { answer: '4', response: 'Even Closer' }]}
          />
  )
  await act(async () => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '2' } })
    screen.getByRole('button').click()
  })
  await screen.findByText('Try again!')
  await act(async () => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '3' } })
    screen.getByRole('button').click()
  })
  await screen.findByText('Almost There')
  await act(async () => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '4' } })
    screen.getByRole('button').click()
  })
  await screen.findByText('Even Closer')
  await act(async () => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '5' } })
    screen.getByRole('button').click()
  })
  await screen.findByText('Correct!')
})

test('InputProblem renders answer specific content only on button click', async () => {
  const solvedHandler = jest.fn()
  const exhaustedHandler = jest.fn()
  const allowedRetryHandler = jest.fn()

  render(
          <InputProblem
          solvedCallback={solvedHandler}
          exhaustedCallback={exhaustedHandler}
          allowedRetryCallback={allowedRetryHandler}
          content={'Content'}
          correctResponse={'Correct!'}
          encourageResponse={'Try again!'}
          retryLimit={3}
          solution={' 5 '}
          buttonText={'Submit'}
          comparator={'integer'}
          attemptsExhaustedResponse={''}
          answerResponses={[{ answer: '3', response: 'Almost There' }, { answer: '4', response: 'Even Closer' }]}
          />
  )
  await act(async () => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '3' } })
    screen.getByRole('button').click()
  })
  await screen.findByText('Almost There')
  await act(async () => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '4' } })
  })
  expect(screen.queryByText('Almost There')).toBeNull()
  await act(async () => {
    screen.getByRole('button').click()
  })
  await screen.findByText('Even Closer')
})
