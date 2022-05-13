import { render, screen, fireEvent, act } from '@testing-library/react'
import { InputProblem } from '../components/InputProblem'
import '@testing-library/jest-dom'

test('InputProblem renders with content, textarea and button', async () => {
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
        />
  )

  screen.getByText('Content')
  screen.getByRole('textbox')
  expect(document.querySelector('textarea')).not.toBeNull()
  expect(screen.getByRole('button').textContent).toBe('Submit')
})

test('InputProblem shows warning if no input in textbox', async () => {
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
          comparitor={'integer'}
          />
  )
  await act(async () => {
    screen.getByRole('button').click()
  })
  await screen.findByText('Please provide an Integer')
})

test('Correct answer to Integer InputProblem should evalute to correct', async () => {
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
          solution={' 5 '}
          buttonText={'Submit'}
          comparitor={'integer'}
          />
  )
  await act(async () => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: ' 5' } })
    screen.getByRole('button').click()
  })
  await screen.findByText('Correct!')
  expect(solvedHandler).toBeCalledTimes(1)
  expect(exhaustedHandler).toBeCalledTimes(0)
  expect(allowedRetryHandler).toBeCalledTimes(0)
})

test(' Text InputProblem button click with correct answer should evaluate to correct', async () => {
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
          comparitor={'text'}
          />
  )
  await act(async () => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Apple ' } })
    screen.getByRole('button').click()
  })
  await screen.findByText('Correct!')
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
          comparitor={'integer'}
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
          comparitor={'float'}
          />
  )
  await act(async () => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Wrong input' } })
    screen.getByRole('button').click()
  })
  await screen.findByText('Please provide an number')
})

test('InputProblem textbox is expecting int but input is text.', async () => {
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
          comparitor={'integer'}
          />
  )
  await act(async () => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'HAHAHAHA' } })
    screen.getByRole('button').click()
  })
  await screen.findByText('Please provide an Integer')
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
          comparitor={'integer'}
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

test('Limit, encourageResponse, and exaustedCallback test', async () => {
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
          comparitor={'integer'}
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
  expect(solvedHandler).toBeCalledTimes(0)
  expect(exhaustedHandler).toBeCalledTimes(1)
  expect(allowedRetryHandler).toBeCalledTimes(3)
})

test('Correct answer after retry. ', async () => {
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
          retryLimit={2}
          solution={' 5 '}
          buttonText={'Submit'}
          comparitor={'integer'}
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
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '5' } })
    screen.getByRole('button').click()
  })

  await screen.findByText('Correct!')
  expect(solvedHandler).toBeCalledTimes(1)
  expect(exhaustedHandler).toBeCalledTimes(0)
  expect(allowedRetryHandler).toBeCalledTimes(3)
})
