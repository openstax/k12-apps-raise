import { MoodleApi } from '../moodleapi'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { vi, test, expect, beforeAll, afterEach, afterAll} from 'vitest'

const server = setupServer(
  http.post('http://moodle/lib/ajax/service.php', () => {
    return HttpResponse.json([{
      data: {
        uuid: 'uuid',
        jwt: 'jwt'
      }
    }])
  }),
  http.post('http://moodletwo/lib/ajax/service.php', () => {
    return HttpResponse.json([{
      data: ['student']
    }])
  })
)

beforeAll(() => { server.listen() })
afterEach(() => { server.resetHandlers() })
afterAll(() => { server.close() })

test('Test getuser', async () => {
  const moodleApi = new MoodleApi('http://moodle', '12345')
  const res = await moodleApi.getUser()
  expect(res.uuid === 'uuid')
  expect(res.jwt === 'jwt')
})

test('Test getUserRoles', async () => {
  const moodleApi = new MoodleApi('http://moodletwo', '67890')
  const res = await moodleApi.getUserRoles(2)
  expect(res.length === 1)
  expect(res[0] === 'student')
})
