import 'whatwg-fetch'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ContentLoader } from '../components/ContentLoader'

const server = setupServer(
  rest.get('http://contentapi/contents/test-content.json', (req, res, ctx) => {
    return res(ctx.json({
      content: [{ html: '<p>Test content</p>' }]
    }))
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
  const contentPromise = new Promise<void>((resolve) => {
    render(
      <div data-testid="content">
        <ContentLoader contentId='test-content' contentLoadedCallback={resolve} />
      </div>
    )
  })

  await waitFor(async () => await contentPromise)

  expect(screen.getByTestId('content')).toHaveTextContent('Test content')
})
