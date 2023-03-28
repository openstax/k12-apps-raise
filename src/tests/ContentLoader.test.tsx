import 'whatwg-fetch'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ContentLoader } from '../components/ContentLoader'

const server = setupServer(
  rest.get('http://contentapi/contents/version/test-content.json', (req, res, ctx) => {
    return res(ctx.json({
      content: [{ variant: 'main', html: '<p>Test content</p>' }]
    }))
  }),
  rest.get('http://contentapi/contents/version/test-content-404.json', (req, res, ctx) => {
    return res(ctx.status(404))
  }),
  rest.get('http://contentapi/contents/version/test-content-failure.json', (req, res, ctx) => {
    throw new Error('This is a fake network error')
  }),
  rest.get('http://contentapi/contents/version/test-nomain-content.json', (req, res, ctx) => {
    return res(ctx.json({
      content: [{ variant: 'nomain', html: '<p>Test content</p>' }]
    }))
  })
)

jest.mock('../lib/env.ts', () => ({
  ENV: {
    OS_RAISE_CONTENT_URL_PREFIX: 'http://contentapi/contents'
  }
}))

beforeAll(() => { server.listen() })
afterEach(() => { server.resetHandlers() })
afterAll(() => { server.close() })

test('content is fetched and rendered on success', async () => {
  render(
    <ContentLoader contentId='test-content' versionId='version'/>
  )
  await screen.findByText('Test content')
})

test('loading status is rendered while content is being fetched', async () => {
  render(
    <ContentLoader contentId='test-content' versionId='version'/>
  )
  await screen.findByRole('status')
})

test('error is displayed on response error when fetching content', async () => {
  render(
    <ContentLoader contentId='test-content-404' versionId='version'/>
  )
  await screen.findByText('There was an error loading content. Please try refreshing the page.')
})

test('error is displayed on network error when fetching content', async () => {
  render(
    <ContentLoader contentId='test-content-failure' versionId='version'/>
  )
  await screen.findByText('There was an error loading content. Please try refreshing the page.')
})

test('OnContentLoad is called', async () => {
  const mockOnLoad = jest.fn()
  const mockOnLoadFailed = jest.fn(() => {})
  render(
    <ContentLoader contentId='test-content' versionId='version' onContentLoad={mockOnLoad} onContentLoadFailure={mockOnLoadFailed}/>
  )

  await waitFor(() => { expect(mockOnLoad.mock.calls.length).toBe(1) })
  await waitFor(() => { expect(mockOnLoadFailed.mock.calls.length).toBe(0) })
  expect(mockOnLoad.mock.calls[0][0]).toBe('test-content')
  expect(mockOnLoad.mock.calls[0][1]).toBe('main')
})

test('OnContentLadFailed is called when error loading content', async () => {
  const mockOnLoad = jest.fn()
  const mockOnLoadFailed = jest.fn()
  render(
    <ContentLoader contentId='test-content-failure' versionId='version' onContentLoad={mockOnLoad} onContentLoadFailure={mockOnLoadFailed}/>
  )
  await waitFor(() => { expect(mockOnLoad.mock.calls.length).toBe(0) })
  await waitFor(() => { expect(mockOnLoadFailed.mock.calls.length).toBe(1) })
  expect(mockOnLoadFailed.mock.calls[0][0]).toBe('test-content-failure')
  expect(mockOnLoadFailed.mock.calls[0][1]).toBe('TypeError: Network request failed')
})

test('OnContentLadFailed is called when there is a 404 error', async () => {
  const mockOnLoad = jest.fn()
  const mockOnLoadFailed = jest.fn()
  render(
    <ContentLoader contentId='test-content-404' versionId='version' onContentLoad={mockOnLoad} onContentLoadFailure={mockOnLoadFailed}/>
  )
  await waitFor(() => { expect(mockOnLoad.mock.calls.length).toBe(0) })
  await waitFor(() => { expect(mockOnLoadFailed.mock.calls.length).toBe(1) })
  expect(mockOnLoadFailed.mock.calls[0][0]).toBe('test-content-404')
  expect(mockOnLoadFailed.mock.calls[0][1]).toBe('Error: Request for content returned 404')
})

test('OnContentLadFailed is called when variant cannot be found', async () => {
  const mockOnLoad = jest.fn()
  const mockOnLoadFailed = jest.fn()
  render(
    <ContentLoader contentId='test-nomain-content' versionId='version' onContentLoad={mockOnLoad} onContentLoadFailure={mockOnLoadFailed}/>
  )
  await waitFor(() => { expect(mockOnLoad.mock.calls.length).toBe(0) })
  await waitFor(() => { expect(mockOnLoadFailed.mock.calls.length).toBe(1) })
  expect(mockOnLoadFailed.mock.calls[0][0]).toBe('test-nomain-content')
  expect(mockOnLoadFailed.mock.calls[0][1]).toBe('Error: Could not resolve content variant')
})
