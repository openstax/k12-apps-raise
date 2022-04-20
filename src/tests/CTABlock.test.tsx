import { fireEvent, render, screen } from '@testing-library/react'
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
      <CTABlock buttonText="Click me!" contentString={'<p>String</p>'} contentPrompt={'<p>Prompt</p>'} firesEvent={'Event'}/>
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
      <CTABlock buttonText="Click me!" contentString={'<p>String</p>'} contentPrompt={'<p>Prompt</p>'} firesEvent={'Event'}/>
    </div>
  )

  fireEvent.click(screen.getByText('Click me!'))
  const queryList = Array.from(screen.getByTestId('cta-block').querySelectorAll('p'))

  expect(screen.getByTestId('cta-block')).not.toHaveTextContent('Click me!')
  expect(queryList.length === 1)
  expect(queryList[0]).toHaveTextContent('String')
})
