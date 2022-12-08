import 'whatwg-fetch'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ContentLoader } from '../components/ContentLoader'

const server = setupServer(
  rest.get('http://contentapi/contents/test-content.json', (req, res, ctx) => {
    return res(ctx.json({
      content: [{ variant: 'main', html: '<p>Test content</p>' }]
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

const mockOnLoad = jest.fn((contentID: string, variant: string) => {
  console.log('call!')
})
// eslint-disable-next-line n/handle-callback-err
const mockOnLoadFailed = jest.fn((error: string, contentID: string) => {})

beforeAll(() => {
  server.listen()
  window.M = {
    cfg: {
      courseId: 5
    }
  } as any
  const oldWindowLocation = window.location
  delete ? window.location
  // window.location.host = 'localhost:8000'
  // console.log(window.location.host)
})

afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('content is fetched and rendered on success', async () => {
  render(
    <ContentLoader contentId='test-content' onContentLoad={mockOnLoad} onContentLoadFailure={mockOnLoadFailed}/>
  )
  await screen.findByText('Test content')
})

test('loading status is rendered while content is being fetched', async () => {
  render(
    <ContentLoader contentId='test-content' onContentLoad={mockOnLoad} onContentLoadFailure={mockOnLoadFailed}/>
  )
  await screen.findByRole('status')
})

test('error is displayed on response error when fetching content', async () => {
  render(
    <ContentLoader contentId='test-content-404' onContentLoad={mockOnLoad} onContentLoadFailure={mockOnLoadFailed}/>
  )
  await screen.findByText('There was an error loading content. Please try refreshing the page.')
})

test('error is displayed on network error when fetching content', async () => {
  render(
    <ContentLoader contentId='test-content-failure' onContentLoad={mockOnLoad} onContentLoadFailure={mockOnLoadFailed}/>
  )
  await screen.findByText('There was an error loading content. Please try refreshing the page.')
})

test('OnContentLoad is called', async () => {
  render(
    <ContentLoader contentId='test-content' onContentLoad={mockOnLoad} onContentLoadFailure={mockOnLoadFailed}/>
  )
  // expect(mockOnLoad.mock.calls.length).toBe(1)
  // expect(mockOnLoadFailed.mock.calls.length).toBe(0)
  await waitFor(() => expect(mockOnLoad.mock.calls.length).toBe(1))
  await waitFor(() => expect(mockOnLoadFailed.mock.calls.length).toBe(0))
})

test('OnContentLadFailed is called when error loading content', async () => {
  render(
    <ContentLoader contentId='test-content-failure' onContentLoad={mockOnLoad} onContentLoadFailure={mockOnLoadFailed}/>
  )
  // expect(mockOnLoad.mock.calls.length).toBe(0)
  // expect(mockOnLoadFailed.mock.calls.length).toBe(1)
  await waitFor(() => expect(mockOnLoad.mock.calls.length).toBe(0))
  await waitFor(() => expect(mockOnLoadFailed.mock.calls.length).toBe(1))
})
