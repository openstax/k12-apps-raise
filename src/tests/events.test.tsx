import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { createContentLoadFailedV1Event, createContentLoadedV1Event, EventManager } from '../lib/events'
import { validate } from 'uuid'
import { EventsInnerFromJSON } from '../eventsapi'

const server = setupServer(
  rest.post('http://localhost:8888/v1/events', (req, res, ctx) => {
    return res(ctx.json({
      detail: 'Success!'
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

test('Test createContentLoadV1Event', async () => {
  const contentID = '1234'
  const variant = 'main'
  window.M = {
    cfg: {
      wwwroot: 'http://moodle',
      sesskey: '12345',
      courseId: '1'
    }
  } as any
  const contentLoaded = createContentLoadedV1Event(contentID, variant)
  if (contentLoaded === null) {
    throw new Error('Invalid event creation')
  }
  expect(contentLoaded.contentId).toBe('1234')
  expect(contentLoaded.eventname).toBe('content_loaded_v1')
  expect(contentLoaded.courseId).toBe(1)
  expect(validate(contentLoaded.impressionId)).toBe(true)
  expect(contentLoaded.sourceUri).toBe('http://localhost/')
  expect(contentLoaded.variant).toBe('main')
})

test('Test createContentLoadV1Event', async () => {
  const contentID = '1234'
  const error = 'error string'
  window.M = {
    cfg: {
      wwwroot: 'http://moodle',
      sesskey: '12345',
      courseId: '1'
    }
  } as any
  const contentLoaded = createContentLoadFailedV1Event(contentID, error)
  if (contentLoaded === null) {
    throw new Error('Invalid event creation')
  }
  expect(contentLoaded.contentId).toBe('1234')
  expect(contentLoaded.eventname).toBe('content_load_failed_v1')
  expect(contentLoaded.courseId).toBe(1)
  expect(validate(contentLoaded.impressionId)).toBe(true)
  expect(contentLoaded.sourceUri).toBe('http://localhost/')
  expect(contentLoaded.error).toBe('error string')
})

test('Test EventManager', async () => {
  const eventLoaded = EventsInnerFromJSON({ eventname: 'content_loaded_v1' })
  const eventFailed = EventsInnerFromJSON({ eventname: 'content_load_failed_v1' })
  const em = EventManager.getInstance()
  em.queueEvent(eventLoaded)
  em.queueEvent(eventFailed)
  expect(em.flushEvents())
})
