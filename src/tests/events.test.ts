import { setupServer } from 'msw/node'
import { http, HttpResponse, matchRequestUrl } from 'msw'
import {
  queueContentLoadFailedV1Event,
  queueContentLoadedV1Event,
  queueIbPsetProblemAttemptedV1Event,
  queueIbInputSubmittedV1Event
} from '../lib/events'
import { validate } from 'uuid'
import { vi, beforeAll, afterAll, afterEach, test, expect } from 'vitest'
const server = setupServer(
  http.post('http://localhost:8888/v1/events', () => {
    return HttpResponse.json({
      detail: 'Success!'
    })
  }),
  http.post('http://moodle/lib/ajax/service.php', () => {
    return HttpResponse.json([{
      data: {
        uuid: 'uuid',
        jwt: 'jwt'
      }
    }])
  })
)

async function waitForRequest(method: string, url: string): Promise<Request> {
  let targetRequestId = ''
  return await new Promise<Request>((resolve, reject) => {
    server.events.on('request:start', ({ request, requestId }) => {
      const matchesMethod = request.method.toLowerCase() === method.toLowerCase()
      const matchesUrl = matchRequestUrl(new URL(request.url), url).matches
      if (matchesMethod && matchesUrl) {
        targetRequestId = requestId
      }
    })
    server.events.on('request:match', ({ request, requestId }) => {
      if (requestId === targetRequestId) {
        resolve(request)
      }
    })
    server.events.on('request:unhandled', ({ request, requestId }) => {
      if (requestId === targetRequestId) {
        reject(
          new Error(`The ${request.method} ${(new URL(request.url)).href} request was unhandled.`)
        )
      }
    })
  })
}

vi.mock('../lib/env.ts', () => ({
  ENV: {
    OS_RAISE_EVENTSAPI_URL_MAP: { 'localhost:3000': 'http://localhost:8888' },
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

afterEach(() => { server.resetHandlers() })
afterAll(() => { server.close() })

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
  expect(validate(jsonData[0].impression_id as string)).toBe(true)
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
  expect(validate(jsonData[0].impression_id as string)).toBe(true)
  expect(jsonData[0].course_id).toBe(1)
})

test('Test queueIbPsetProblemAttemptedV1Event', async () => {
  const pendingRequest = waitForRequest('POST', 'http://localhost:8888/v1/events')
  await queueIbPsetProblemAttemptedV1Event(
    1,
    '1234',
    'variant',
    'input',
    'this is the response',
    true,
    1,
    false,
    'abcd1',
    'efgh2'
  )
  const req = await pendingRequest
  const jsonData = await req.json()
  expect(jsonData[0].timestamp).toBe(1)
  expect(jsonData[0].content_id).toBe('1234')
  expect(jsonData[0].variant).toBe('variant')
  expect(jsonData[0].problem_type).toBe('input')
  expect(jsonData[0].response).toBe('this is the response')
  expect(jsonData[0].correct).toBe(true)
  expect(jsonData[0].attempt).toBe(1)
  expect(jsonData[0].final_attempt).toBe(false)
  expect(jsonData[0].pset_content_id).toBe('abcd1')
  expect(jsonData[0].pset_problem_content_id).toBe('efgh2')
  expect(jsonData[0].eventname).toBe('ib_pset_problem_attempted_v1')
  expect(validate(jsonData[0].impression_id as string)).toBe(true)
  expect(jsonData[0].course_id).toBe(1)
})

test('Test queueIbInputSubmittedV1Event', async () => {
  const pendingRequest = waitForRequest('POST', 'http://localhost:8888/v1/events')
  await queueIbInputSubmittedV1Event(
    1,
    'content-id',
    'variant',
    'this is the response',
    'input-content-id'
  )
  const req = await pendingRequest
  const jsonData = await req.json()
  expect(jsonData[0].timestamp).toBe(1)
  expect(jsonData[0].content_id).toBe('content-id')
  expect(jsonData[0].variant).toBe('variant')
  expect(jsonData[0].response).toBe('this is the response')
  expect(jsonData[0].input_content_id).toBe('input-content-id')
  expect(jsonData[0].eventname).toBe('ib_input_submitted_v1')
  expect(validate(jsonData[0].impression_id as string)).toBe(true)
  expect(jsonData[0].course_id).toBe(1)
})

test('Test timer resets itself after flushing', async () => {
  await queueContentLoadFailedV1Event(1, '1234', 'error')
  await waitForRequest('POST', 'http://localhost:8888/v1/events')
  await queueContentLoadFailedV1Event(1, '12345', 'error2')
  await waitForRequest('POST', 'http://localhost:8888/v1/events')
})
