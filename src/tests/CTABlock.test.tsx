import { fireEvent, render, screen, act } from '@testing-library/react'
import { CTABlock } from '../components/CTABlock'
import '@testing-library/jest-dom'

test('CTABlock renders', async () => {
  render(
    <div data-testid="cta-block">
      <CTABlock buttonText="Click me!" contentString={'<p>String</p>'} contentPrompt={'<p>Prompt</p>'}/>
    </div>
  )
  const queryList = Array.from(screen.getByTestId('cta-block').querySelectorAll('p'))

  expect(screen.getByTestId('cta-block').querySelector('button')).not.toBeNull()
  expect(screen.getByTestId('cta-block')).toHaveTextContent('Click me!')
  expect(queryList[0]).toHaveTextContent('String')
  expect(queryList[1]).toHaveTextContent('Prompt')
})

test('CTABlock fires event', async () => {
  render(
    <div data-testid="cta-block">
      <CTABlock buttonText="Click me!" contentString={'<p>String</p>'} contentPrompt={'<p>Prompt</p>'} fireEvent={'Event'}/>
    </div>
  )
  const eventHandler = jest.fn()

  document.addEventListener('Event', eventHandler)
  fireEvent.click(screen.getByText('Click me!'))
  expect(eventHandler).toHaveBeenCalled()
})

test('CTABlock button prompt disappear', async () => {
  render(
    <div data-testid="cta-block">
      <CTABlock buttonText="Click me!" contentString={'<p>String</p>'} contentPrompt={'<p>Prompt</p>'} fireEvent={'Event'}/>
    </div>
  )

  fireEvent.click(screen.getByText('Click me!'))
  const queryList = Array.from(screen.getByTestId('cta-block').querySelectorAll('p'))

  expect(screen.getByTestId('cta-block')).not.toHaveTextContent('Click me!')
  expect(queryList.length === 1)
  expect(queryList[0]).toHaveTextContent('String')
})

test('CTABlock does not render if waitForEvent does not fire', async () => {
  render(
    <div data-testid="cta-block">
      <CTABlock buttonText="Click me!" contentString={'<p>String</p>'} contentPrompt={'<p>Prompt</p>'} waitForEvent={'waitForEvent'}/>
    </div>
  )
  const queryList = Array.from(screen.getByTestId('cta-block').querySelectorAll('p'))

  expect(screen.getByTestId('cta-block').querySelector('button')).toBeNull()
  expect(queryList.length === 0)
})

test('CTABlock does render if waitForEvent is fired', async () => {
  render(
    <div data-testid="cta-block">
      <CTABlock buttonText="Click me!" contentString={'<p>String</p>'} contentPrompt={'<p>Prompt</p>'} waitForEvent={'waitForEvent'}/>
    </div>
  )
  const clickEvent = new CustomEvent('waitForEvent')

  fireEvent(document, clickEvent)

  const queryList = Array.from(screen.getByTestId('cta-block').querySelectorAll('p'))

  expect(screen.getByTestId('cta-block').querySelector('button')).not.toBeNull()
  expect(screen.getByTestId('cta-block')).toHaveTextContent('Click me!')
  expect(queryList[0]).toHaveTextContent('String')
  expect(queryList[1]).toHaveTextContent('Prompt')
})
