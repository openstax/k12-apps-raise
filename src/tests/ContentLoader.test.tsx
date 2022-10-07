import 'whatwg-fetch'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ContentLoader, ContentVariant } from '../components/ContentLoader'

const MOCK_CONTENTS = [
  { variant: 'main', html: '<p>Test content</p>' },
  { variant: 'variant1', html: '<p>Variant content</p>' }
]

const server = setupServer(
  rest.get('http://contentapi/contents/test-content.json', (req, res, ctx) => {
    return res(ctx.json({
      content: MOCK_CONTENTS
    }))
  }),
  rest.get('http://contentapi/contents/test-content-404.json', (req, res, ctx) => {
    return res(ctx.status(404))
  }),
  rest.get('http://contentapi/contents/test-content-failure.json', (req, res, ctx) => {
    throw new Error('This is a fake network error')
  })
)

jest.mock('../lib/env.ts', () => ({
  ENV: {
    OS_RAISE_CONTENT_URL_PREFIX: 'http://contentapi/contents'
  }
}))

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('content is fetched and rendered on success', async () => {
  render(
    <ContentLoader contentId='test-content'/>
  )
  await screen.findByText('Test content')
})

test('variant content is fetched and rendered on success', async () => {
  jest.mock('../lib/utils', () => ({
    getVariant: jest.fn(x => '<p>Variant content</p>')
  }))

  render(
    <ContentLoader contentId='test-content'/>
  )
  await screen.findByText('Variant content')
})

test('loading status is rendered while content is being fetched', async () => {
  render(
    <ContentLoader contentId='test-content'/>
  )
  await screen.findByRole('status')
})

test('error is displayed on response error when fetching content', async () => {
  render(
    <ContentLoader contentId='test-content-404'/>
  )
  await screen.findByText('There was an error loading content. Please try refreshing the page.')
})

test('error is displayed on network error when fetching content', async () => {
  render(
    <ContentLoader contentId='test-content-failure'/>
  )
  await screen.findByText('There was an error loading content. Please try refreshing the page.')
})
