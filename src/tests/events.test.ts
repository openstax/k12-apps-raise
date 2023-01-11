import 'whatwg-fetch'
import { setupServer } from 'msw/node'
import { rest, MockedRequest, matchRequestUrl } from 'msw'
import { queueContentLoadFailedV1Event, queueContentLoadedV1Event } from '../lib/events'
import { validate } from 'uuid'

const server = setupServer(
  rest.post('http://localhost:8888/v1/events', (req, res, ctx) => {
    return res(ctx.json({
      detail: 'Success!'
    }))
  }),
  rest.post('http://moodle/lib/ajax/service.php', (req, res, ctx) => {
    return res(ctx.json([{
      data: {
        uuid: 'uuid',
        jwt: 'jwt'
      }

    }]))
  })
)

async function waitForRequest(method: string, url: string): Promise<MockedRequest> {
  let requestId = ''
  return await new Promise<MockedRequest>((resolve, reject) => {
    server.events.on('request:start', (req) => {
      const matchesMethod = req.method.toLowerCase() === method.toLowerCase()
      const matchesUrl = matchRequestUrl(req.url, url).matches
      if (matchesMethod && matchesUrl) {
        requestId = req.id
      }
    })
    server.events.on('request:match', (req) => {
      if (req.id === requestId) {
        resolve(req)
      }
    })
    server.events.on('request:unhandled', (req) => {
      if (req.id === requestId) {
        reject(
          new Error(`The ${req.method} ${req.url.href} request was unhandled.`)
        )
      }
    })
  })
}

jest.mock('../lib/env.ts', () => ({
  ENV: {
    OS_RAISE_EVENTSAPI_URL_MAP: { localhost: 'http://localhost:8888' },
    EVENT_FLUSH_PERIOD: 1
  }
}))

beforeAll(() => {
  window.M = {
    cfg: {
      wwwroot: 'http://moodle',
      sesskey: '12345',
      courseId: 1
    }
  }
  server.listen()
})

afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// NOTE (Hack): Due to the internal implementation of the events module, this test
// case should run first (it will otherwise pass but not exercise / validate
// the desired code path)
test('Simultaneous requests result in a single EventManager instance', async () => {
  const pendingRequest = waitForRequest('POST', 'http://localhost:8888/v1/events')
  void queueContentLoadedV1Event(1, '1234', 'main')
  void queueContentLoadedV1Event(1, '1235', 'main')
  const req = await pendingRequest
  const jsonData = await req.json()
  expect(jsonData.length).toBe(2)
})

test('Test queueContentLoadedV1Event', async () => {
  const pendingRequest = waitForRequest('POST', 'http://localhost:8888/v1/events')
  await queueContentLoadedV1Event(1, '1234', 'main')
  const req = await pendingRequest
  const jsonData = await req.json()
  expect(jsonData[0].content_id).toBe('1234')
  expect(jsonData[0].eventname).toBe('content_loaded_v1')
  expect(jsonData[0].variant).toBe('main')
  expect(validate(jsonData[0].impression_id)).toBe(true)
  expect(jsonData[0].course_id).toBe(1)
})

test('Test queueContentLoadFailedV1Event', async () => {
  const pendingRequest = waitForRequest('POST', 'http://localhost:8888/v1/events')
  await queueContentLoadFailedV1Event(1, '1234', 'error')
  const req = await pendingRequest
  const jsonData = await req.json()
  expect(jsonData[0].content_id).toBe('1234')
  expect(jsonData[0].eventname).toBe('content_load_failed_v1')
  expect(jsonData[0].error).toBe('error')
  expect(validate(jsonData[0].impression_id)).toBe(true)
  expect(jsonData[0].course_id).toBe(1)
})

test('Test timer resets itself after flushing', async () => {
  await queueContentLoadFailedV1Event(1, '1234', 'error')
  await waitForRequest('POST', 'http://localhost:8888/v1/events')
  await queueContentLoadFailedV1Event(1, '12345', 'error2')
  await waitForRequest('POST', 'http://localhost:8888/v1/events')
})
