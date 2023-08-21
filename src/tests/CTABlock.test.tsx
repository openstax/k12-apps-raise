import { fireEvent, render, screen } from '@testing-library/react'
import { CTABlock } from '../components/CTABlock'
import { parseCTABlock, OS_RAISE_IB_EVENT_PREFIX } from '../lib/blocks'
import { mathifyElement } from '../lib/math'
import '@testing-library/jest-dom'
import { setupServer } from 'msw/node'
import 'whatwg-fetch'
import { rest } from 'msw'

const server = setupServer(
  rest.get('http://contentapi/contents/version/glossary-tooltip.json', async (req, res, ctx) => {
    return await res(ctx.json({
      content: [{ term: 'absolute value', definition: 'The distance between a number and \\( 0 \\) on the number line.' }]
    }))
  }))

beforeAll(() => { server.listen() })
afterEach(() => { server.resetHandlers() })
afterAll(() => { server.close() })

jest.mock('../lib/math.ts', () => ({
  mathifyElement: jest.fn()
}))

jest.mock('../lib/env.ts', () => {})

test('CTABlock renders', async () => {
  render(
    <CTABlock buttonText="Click me!" content={'<p>String</p>'} prompt={'<p>Prompt</p>'}/>
  )

  screen.getByText('String')
  screen.getByText('Prompt')
  screen.getByText('Click me!')
  screen.getByRole('button')
})

test('CTABlock fires event', async () => {
  render(
      <CTABlock buttonText="Click me!" content={'<p>String</p>'} prompt={'<p>Prompt</p>'} fireEvent={'Event'}/>
  )
  const eventHandler = jest.fn()

  document.addEventListener('Event', eventHandler)
  fireEvent.click(screen.getByText('Click me!'))
  expect(eventHandler).toHaveBeenCalled()
})

test('CTABlock button disappears on click, prompt remains', async () => {
  render(
      <CTABlock buttonText="Click me!" content={'<p>String</p>'} prompt={'<p>Prompt</p>'} fireEvent={'Event'}/>
  )

  fireEvent.click(screen.getByText('Click me!'))
  expect(screen.queryByText('Click me!')).toBeNull()
  screen.getByText('String')
  expect(screen.queryByText('Prompt'))
})

test('CTABlock does not render if waitForEvent does not fire', async () => {
  render(
      <CTABlock buttonText="Click me!" content={'<p>String</p>'} prompt={'<p>Prompt</p>'} waitForEvent={'waitForEvent'}/>
  )

  expect(screen.queryByText('String')).toBeNull()
  expect(screen.queryByText('Prompt')).toBeNull()
  expect(screen.queryByText('Click me!')).toBeNull()
})

test('CTABlock does render if waitForEvent is fired', async () => {
  render(
      <CTABlock buttonText="Click me!" content={'<p>String</p>'} prompt={'<p>Prompt</p>'} waitForEvent={'waitForEvent'}/>
  )
  const renderEvent = new CustomEvent('waitForEvent')

  fireEvent(document, renderEvent)

  screen.queryByText('String')
  screen.queryByText('Prompt')
  screen.queryByText('Click me!')
})

test('CTABlock from parseCTABlock renders on namespaced event', async () => {
  const htmlContent = `<div class="os-raise-ib-cta" data-button-text="ButtonText" data-wait-for-event="eventnameY" data-schema-version="1.0">
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

test('CTABlock from parse CTABlock fires namespaced event on click', async () => {
  const htmlContent = `<div class="os-raise-ib-cta" data-button-text="ButtonText" data-fire-event="eventnameX" data-schema-version="1.0">
  <div class="os-raise-ib-cta-content"><p>Some Content</p></div>
  <div class="os-raise-ib-cta-prompt"><p>Prompt</p></div>`
  const divElem = document.createElement('div')
  divElem.innerHTML = htmlContent
  const generatedContentBlock = parseCTABlock(divElem.children[0] as HTMLElement)

  render(
    generatedContentBlock as JSX.Element
  )
  const eventHandler = jest.fn()
  document.addEventListener(`${OS_RAISE_IB_EVENT_PREFIX}-eventnameX`, eventHandler)
  fireEvent.click(screen.getByText('ButtonText'))
  expect(eventHandler).toHaveBeenCalled()
})

test('CTABlock calls mathifyElement when rendered', async () => {
  render(
    <CTABlock content={'<p>String</p>'} prompt={'<p>Prompt</p>'} buttonText={'<p>Click</p>'} fireEvent={'eventX'}/>
  )
  expect(mathifyElement).toBeCalled()
})
