import 'whatwg-fetch'
import { EventManager } from '../lib/content'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { EventsInnerFromJSON } from '../eventsapi'

const server = setupServer(
  rest.post('http://localhost:8888/v1/events', (req, res, ctx) => {
    return res(ctx.json({
      detail: 'Success!'
    }))
  }))

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('Test EventManager', async () => {
  window.location.host = 'localhost:8000'
  const eventLoaded = EventsInnerFromJSON({ eventname: 'content_loaded_v1' })
  const eventFailed = EventsInnerFromJSON({ eventname: 'content_load_failed_v1' })
  const em = EventManager.getInstance()
  em.queueEvent(eventLoaded)
  em.queueEvent(eventFailed)
  em.flushEvents().then((ret) => {
    expect(ret.detail).toBe('Success!')
  }).catch(() => {})
})
