import { render, screen, fireEvent, act } from '@testing-library/react'
import { UserInputBlock, MAX_CHARACTER_INPUT_BLOCK_LENGTH } from '../components/UserInputBlock'
import { parseUserInputBlock, OS_RAISE_IB_EVENT_PREFIX } from '../lib/blocks'
import '@testing-library/jest-dom'
import { ContentLoadedContext } from '../lib/contexts'
import { queueIbInputSubmittedV1Event } from '../lib/events'

jest.mock('../lib/env.ts', () => {})

jest.mock('../lib/events.ts', () => ({
  queueIbInputSubmittedV1Event: jest.fn(async () => {})
}))

afterEach(() => {
  jest.clearAllMocks()
})

test('UserInputBlock renders with content, prompt, and form as textarea', async () => {
  render(
    <UserInputBlock contentId={'c2c322d9-9297-4928-b763-ae581ce6bb47'} content="<p>Content text</p>" prompt="<p>Prompt text</p>" ack="<p>Ack text</p>" buttonText="Submit"/>
  )

  screen.getByText('Content text')
  screen.getByText('Prompt text')
  screen.getByRole('textbox')
  expect(document.querySelector('textarea')).not.toBeNull()
  expect(screen.getByRole('button').textContent).toBe('Submit')
})

test('UserInputBlock renders without contentId', async () => {
  render(
    <UserInputBlock content="<p>Content text</p>" prompt="<p>Prompt text</p>" ack="<p>Ack text</p>" buttonText="Submit"/>
  )

  screen.getByText('Content text')
  screen.getByText('Prompt text')
  screen.getByRole('textbox')
  expect(document.querySelector('textarea')).not.toBeNull()
  expect(screen.getByRole('button').textContent).toBe('Submit')
})

test('UserInputBlock allows setting custom button text', async () => {
  render(
    <UserInputBlock content="<p>Content text</p>" prompt="<p>Prompt text</p>" ack="<p>Ack text</p>" buttonText="CustomButtonText"/>
  )
  expect(screen.getByRole('button').textContent).toBe('CustomButtonText')
})

test('UserInputBlock does not render if waitForEvent does not fire', async () => {
  render(
    <UserInputBlock content="<p>Content text</p>" prompt="<p>Prompt text</p>" ack="<p>Ack text</p>" buttonText="CustomButtonText" waitForEvent='someEvent'/>
  )

  expect(screen.queryByText('Content text')).toBeNull()
  expect(screen.queryByText('Prompt text')).toBeNull()
  expect(screen.queryByRole('textbox')).toBeNull()
  expect(screen.queryByRole('button')).toBeNull()
})

test('UserInputBlock does render if waitForEvent is fired', async () => {
  render(
    <UserInputBlock content="<p>Content text</p>" prompt="<p>Prompt text</p>" ack="<p>Ack text</p>" buttonText="CustomButtonText" waitForEvent='someEvent'/>
  )

  fireEvent(document, new CustomEvent('someEvent'))

  screen.getByText('Content text')
  screen.getByText('Prompt text')
  screen.getByRole('textbox')
  screen.getByRole('button')
})

test('UserInputBlock disables, removes and, adds expected content on valid submission', async () => {
  render(
    <UserInputBlock content="<p>Content text</p>" prompt="<p>Prompt text</p>" ack="<p>Ack text</p>" buttonText="CustomButtonText"/>
  )

  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Input text' } })
  await act(async () => {
    screen.getByRole('button').click()
  })

  screen.getByText('Ack text')
  expect(screen.queryByRole('textbox')).toBeDisabled()
  expect(screen.queryByRole('button')).toBeDisabled()
})

test('UserInputBlock requires non-empty input', async () => {
  render(
    <UserInputBlock content="<p>Content text</p>" prompt="<p>Prompt text</p>" ack="<p>Ack text</p>" buttonText="CustomButtonText"/>
  )

  await act(async () => {
    screen.getByRole('button').click()
  })

  screen.getByText('Content text')
  screen.getByText('Prompt text')
  screen.getByRole('textbox')
  screen.getByRole('button')
  screen.getByText('Please provide valid input')

  await act(async () => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '   ' } })
    screen.getByRole('button').click()
  })

  screen.getByText('Please provide valid input')

  await act(async () => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'S' } })
  })
  expect(screen.queryByText('Please provide valid input')).toBeNull()
})

test('UserInputBlock input isnt over the max length', async () => {
  render(
    <UserInputBlock content="<p>Content text</p>" prompt="<p>Prompt text</p>" ack="<p>Ack text</p>" buttonText="CustomButtonText"/>
  )

  await act(async () => {
    screen.getByRole('button').click()
  })

  screen.getByText('Content text')
  screen.getByText('Prompt text')
  screen.getByRole('textbox')
  screen.getByRole('button')
  screen.getByText('Please provide valid input')

  await act(async () => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'a'.repeat(MAX_CHARACTER_INPUT_BLOCK_LENGTH + 1) } })
  })

  screen.getByText('Input is too long')

  await act(async () => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'S' } })
  })
  expect(screen.queryByText('Input is too long')).toBeNull()
})

test('UserInputBlock from parseUserInputBlock renders on namespaced event', async () => {
  const htmlContent = `
  <div class="os-raise-ib-input" data-wait-for-event="event1" data-schema-version="1.0">
    <div class="os-raise-ib-input-content">
      <p>Content text</p>
    </div>
    <div class="os-raise-ib-input-prompt"></div>
    <div class="os-raise-ib-input-ack"></div>
  </div>
  `
  const divElem = document.createElement('div')
  divElem.innerHTML = htmlContent
  const generatedContentBlock = parseUserInputBlock(divElem.children[0] as HTMLElement)

  expect(generatedContentBlock).not.toBeNull()

  render(
    generatedContentBlock as JSX.Element
  )

  expect(screen.queryByText('Content text')).toBeNull()
  fireEvent(document, new CustomEvent(`${OS_RAISE_IB_EVENT_PREFIX}-event1`))
  screen.getByText('Content text')
})

test('UserInputBlock from parseUserInputBlock fires namespaced event on valid submission', async () => {
  const htmlContent = `
  <div class="os-raise-ib-input" data-fire-event="event1" data-schema-version="1.0">
    <div class="os-raise-ib-input-content"></div>
    <div class="os-raise-ib-input-prompt"></div>
    <div class="os-raise-ib-input-ack"></div>
  </div>
  `
  const divElem = document.createElement('div')
  divElem.innerHTML = htmlContent
  const generatedContentBlock = parseUserInputBlock(divElem.children[0] as HTMLElement)

  expect(generatedContentBlock).not.toBeNull()

  render(
    generatedContentBlock as JSX.Element
  )

  const eventHandler = jest.fn()
  document.addEventListener(`${OS_RAISE_IB_EVENT_PREFIX}-event1`, eventHandler)

  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Input text' } })
  await act(async () => {
    screen.getByRole('button').click()
  })

  expect(eventHandler).toHaveBeenCalled()
})

test('UserInputBlock calls onInputSumbitted callback', async () => {
  const htmlContent = `
  <div class="os-raise-ib-input" data-content-id="1234" data-schema-version="1.0">
    <div class="os-raise-ib-input-content"></div>
    <div class="os-raise-ib-input-prompt"></div>
    <div class="os-raise-ib-input-ack"></div>
  </div>
  `
  const divElem = document.createElement('div')
  divElem.innerHTML = htmlContent
  const generatedContentBlock = parseUserInputBlock(divElem.children[0] as HTMLElement)

  Date.now = jest.fn(() => 12345)

  expect(generatedContentBlock).not.toBeNull()

  render(
    <ContentLoadedContext.Provider value={{ variant: 'testvariant', contentId: 'contentLoadedId' }}>
      {generatedContentBlock as JSX.Element}
    </ContentLoadedContext.Provider>
  )

  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Input text' } })
  await act(async () => {
    screen.getByRole('button').click()
  })

  expect(queueIbInputSubmittedV1Event).toHaveBeenCalled()
  expect(queueIbInputSubmittedV1Event).toHaveBeenCalledWith(
    12345,
    'contentLoadedId',
    'testvariant',
    'Input text',
    '1234'
  )
})

test('UserInputBlock does not call onInputSumbitted on default context', async () => {
  const htmlContent = `
  <div class="os-raise-ib-input" data-content-id="1234" data-schema-version="1.0">
    <div class="os-raise-ib-input-content"></div>
    <div class="os-raise-ib-input-prompt"></div>
    <div class="os-raise-ib-input-ack"></div>
  </div>
  `
  const divElem = document.createElement('div')
  divElem.innerHTML = htmlContent
  const generatedContentBlock = parseUserInputBlock(divElem.children[0] as HTMLElement)

  Date.now = jest.fn(() => 12345)

  expect(generatedContentBlock).not.toBeNull()

  render(
    generatedContentBlock as JSX.Element
  )

  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Input text' } })
  await act(async () => {
    screen.getByRole('button').click()
  })

  expect(queueIbInputSubmittedV1Event).not.toHaveBeenCalled()
})
