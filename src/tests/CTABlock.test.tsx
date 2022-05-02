import { fireEvent, render, screen } from '@testing-library/react'
import { CTABlock } from '../components/CTABlock'
import { parseCTABlock, OS_RAISE_IB_EVENT_PREFIX } from '../lib/blocks'
import { mathifyElement } from '../lib/math'
import '@testing-library/jest-dom'

jest.mock('../lib/math.ts', () => ({
  mathifyElement: jest.fn()
}))

test('CTABlock renders', async () => {
  render(
    <CTABlock buttonText="Click me!" contentString={'<p>String</p>'} contentPrompt={'<p>Prompt</p>'}/>
  )

  screen.getByText('String')
  screen.getByText('Prompt')
  screen.getByText('Click me!')
  screen.getByRole('button')
})

test('CTABlock fires event', async () => {
  render(
      <CTABlock buttonText="Click me!" contentString={'<p>String</p>'} contentPrompt={'<p>Prompt</p>'} fireEvent={'Event'}/>
  )
  const eventHandler = jest.fn()

  document.addEventListener('Event', eventHandler)
  fireEvent.click(screen.getByText('Click me!'))
  expect(eventHandler).toHaveBeenCalled()
})

test('CTABlock button and prompt disappear on click', async () => {
  render(
      <CTABlock buttonText="Click me!" contentString={'<p>String</p>'} contentPrompt={'<p>Prompt</p>'} fireEvent={'Event'}/>
  )

  fireEvent.click(screen.getByText('Click me!'))
  expect(screen.queryByText('Click me!')).toBeNull()
  screen.getByText('String')
  expect(screen.queryByText('Prompt')).toBeNull()
})

test('CTABlock does not render if waitForEvent does not fire', async () => {
  render(
      <CTABlock buttonText="Click me!" contentString={'<p>String</p>'} contentPrompt={'<p>Prompt</p>'} waitForEvent={'waitForEvent'}/>
  )

  expect(screen.queryByText('String')).toBeNull()
  expect(screen.queryByText('Prompt')).toBeNull()
  expect(screen.queryByText('Click me!')).toBeNull()
})

test('CTABlock does render if waitForEvent is fired', async () => {
  render(
      <CTABlock buttonText="Click me!" contentString={'<p>String</p>'} contentPrompt={'<p>Prompt</p>'} waitForEvent={'waitForEvent'}/>
  )
  const renderEvent = new CustomEvent('waitForEvent')

  fireEvent(document, renderEvent)

  screen.queryByText('String')
  screen.queryByText('Prompt')
  screen.queryByText('Click me!')
})

test('CTABlock from parseCTABlock renders on namespaced event', async () => {
  const htmlContent = `<div class="os-raise-ib-cta" data-button-text="ButtonText" data-fire-event="eventnameX" data-wait-for-event="eventnameY" data-schema-version="1.0">
  <div class="os-raise-ib-cta-content"><p>Some Content</p></div>
  <div class="os-raise-ib-cta-prompt"><p>Prompt</p></div>`
  const divElem = document.createElement('div')
  divElem.innerHTML = htmlContent
  const generatedContentBlock = parseCTABlock(divElem.children[0] as HTMLElement)

  expect(generatedContentBlock).not.toBeNull()

  render(
    generatedContentBlock as JSX.Element
  )

  expect(screen.queryByText('String')).toBeNull()
  fireEvent(document, new CustomEvent(`${OS_RAISE_IB_EVENT_PREFIX}-eventnameY`))
  expect(screen.queryByText('String')).toBeNull()
})

test('CTABlock calls mathifyElement when rendered', async () => {
  render(
    <CTABlock contentString={'<p>String</p>'} contentPrompt={'<p>Prompt</p>'} buttonText={'<p>Click</p>'} fireEvent={'eventX'}/>
  )
  expect(mathifyElement).toBeCalled()
})
