import 'whatwg-fetch'
import { EventManager } from '../lib/content'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { createContentLoadFailedV1, createContentLoadV1Event } from '../lib/content'
import {validate} from 'uuid'
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

// test('Test getuser', async () => {
//   const moodleApi = new MoodleApi('http://moodle', '12345')
//   const res = await moodleApi.getUser()
//   expect(res.uuid === 'uuid')
//   expect(res.jwt === 'jwt')
// })

// Replace with EventsManager Test
test('Test createContentLoadV1Event', async () => {
  let contentID = '1234'
  let variant = 'main'
  window.M = {
    cfg: {
      wwwroot: 'http://moodle',
      sesskey: '12345',
      courseId:'1'
    }
  } as any
  const contentLoaded = createContentLoadV1Event(contentID, variant)
  expect(contentLoaded.contentId).toBe('1234')
  expect(contentLoaded.eventname).toBe('content_loaded_v1')
  expect(contentLoaded.courseId).toBe(1)
  expect(validate(contentLoaded.impressionId)).toBe(true)
  expect(contentLoaded.sourceUri).toBe('http://localhost/')
  expect(contentLoaded.variant).toBe('main')

})

test('Test createContentLoadV1Event', async () => {
  let contentID = '1234'
  let variant = 'main'
  const error = 'error string'
  window.M = {
    cfg: {
      wwwroot: 'http://moodle',
      sesskey: '12345',
      courseId:'1'
    }
  } as any
  const contentLoaded = createContentLoadFailedV1(error, contentID)
  expect(contentLoaded.contentId).toBe('1234')
  expect(contentLoaded.eventname).toBe('content_load_failed_v1')
  expect(contentLoaded.courseId).toBe(1)
  expect(validate(contentLoaded.impressionId)).toBe(true)
  expect(contentLoaded.sourceUri).toBe('http://localhost/')
  expect(contentLoaded.error).toBe('error string')

})
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
