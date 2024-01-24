import { render, screen, fireEvent, act } from '@testing-library/react'
import { InputProblem, MAX_CHARACTER_INPUT_PROBLEM_LENGTH, buildClassName, detectAndTransform, evaluateMathComparator } from '../components/InputProblem'
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
      contentId={'c2c322d9-9297-4928-b763-ae581ce6bb47'}
      attemptsExhaustedResponse={''}
      answerResponses={[]}
      />
  )

  screen.getByText('Content')
  screen.getByRole('textbox')
  expect(document.querySelector('input')).not.toBeNull()
  await screen.findByText('Attempts left: Unlimited')
  expect(screen.getByRole('button').textContent).toBe('Submit')
})

test('InputProblem renders without contentId', async () => {
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
  await screen.findByText('Attempts left: Unlimited')
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
          retryLimit={1}
          solution={' Apple '}
          buttonText={'Submit'}
          comparator={'text'}
          attemptsExhaustedResponse={''}
          answerResponses={[]}
          />
  )

  await screen.findByText('Attempts left: 2/2')
  await act(async () => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Apple ' } })
    screen.getByRole('button').click()
  })
  await screen.findByText('Correct!')
  expect(screen.getByRole('textbox')).toBeDisabled()
  expect(screen.getByRole('button')).toBeDisabled()
  await screen.findByText('Attempts left: 2/2')

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
  await screen.findByText('Enter numeric values only')
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
  await screen.findByText('Enter numeric values only')
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
  await screen.findByText('Enter numeric values only')
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
          retryLimit={1}
          solution={' 5 '}
          buttonText={'Submit'}
          comparator={'integer'}
          attemptsExhaustedResponse={''}
          answerResponses={[]}
          />
  )

  await screen.findByText('Attempts left: 2/2')
  await act(async () => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '4' } })
    screen.getByRole('button').click()
  })
  await screen.findByText('Attempts left: 1/2')
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
  await screen.findByText('Attempts left: 4/4')
  await act(async () => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '4' } })
    screen.getByRole('button').click()
    screen.getByRole('button').click()
    screen.getByRole('button').click()
  })
  await screen.findByText('Attempts left: 1/4')

  await screen.findByText('Try again!')

  await act(async () => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '3' } })
    screen.getByRole('button').click()
  })
  await screen.findByText('Attempts left: 0/4')

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

test('InputProblem calls the onProblemAttempt handler', async () => {
  const problemAttemptedHandler = jest.fn()

  render(
          <InputProblem
          solvedCallback={() => {}}
          exhaustedCallback={() => {}}
          allowedRetryCallback={() => {}}
          content={'Content'}
          correctResponse={'Correct!'}
          encourageResponse={'Try again!'}
          retryLimit={1}
          solution={' 5 '}
          buttonText={'Submit'}
          comparator={'integer'}
          attemptsExhaustedResponse={''}
          contentId={'dataContentId'}
          answerResponses={[{ answer: '3', response: 'Almost There' }, { answer: '4', response: 'Even Closer' }]}
          onProblemAttempt={problemAttemptedHandler}
          />
  )
  await act(async () => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '3' } })
    screen.getByRole('button').click()
  })
  expect(problemAttemptedHandler).toBeCalledTimes(1)
  expect(problemAttemptedHandler).toHaveBeenCalledWith(
    '3',
    false,
    1,
    false,
    'dataContentId'
  )

  await act(async () => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '4' } })
    screen.getByRole('button').click()
  })
  expect(problemAttemptedHandler).toBeCalledTimes(2)
  expect(problemAttemptedHandler).toHaveBeenLastCalledWith(
    '4',
    false,
    2,
    true,
    'dataContentId'
  )
})

test('Test buildClassName', async () => {
  // If answer is incorrect and disabled is false
  const result = buildClassName(false, false, undefined)
  expect(result).toBe('os-form-control')

  // If answer is correct and disabled is true
  const correct = buildClassName(true, true, undefined)
  expect(correct).toBe('os-form-control os-correct-answer-choice os-disabled')

  // If answer is incorrect and disabled is true
  const incorrect = buildClassName(false, true, undefined)
  expect(incorrect).toBe('os-form-control os-wrong-answer-choice os-disabled')

  // If a validation error occurs
  const validationError = buildClassName(false, false, 'error')
  expect(validationError).toBe('os-form-control os-wrong-answer-choice')
})

test('Test detectAndTransform', async () => {
  // If a fraction and sqrt transformation is needed
  const input = 'x=\\frac12 + \\sqrt3'
  const expectedOutput = 'x=\\frac{1}{2} + \\sqrt{3}'
  let result = detectAndTransform(input)
  expect(result).toEqual(expectedOutput)

  // No transformation is needed
  const correctInput = 'x = \\frac{12}{2} + \\sqrt{9} + 4x'
  result = detectAndTransform(input)
  expect(correctInput).toEqual(correctInput)
})

test('Test evaluteMathComparator', async () => {
  // Fraction test
  expect(evaluateMathComparator('\\frac12', '\\frac{1}{2}')).toBe(true)

  // sqrt and nth root test
  expect(evaluateMathComparator('x=\\sqrt4', 'x=\\sqrt[2]{4}')).toBe(true)
  expect(evaluateMathComparator('x=\\sqrt4', 'x=\\sqrt[3]{4}')).toBe(false)

  // form test
  expect(evaluateMathComparator('y=\\frac12x-3', 'y+3=\\frac12x')).toBe(false)

  // test \lt \gt
  expect(evaluateMathComparator('x<\\frac{1}{3}', 'x\\lt\\frac{1}{3}')).toBe(true)
  expect(evaluateMathComparator('x>\\frac13', 'x\\gt\\frac{1}{3}')).toBe(true)
})
