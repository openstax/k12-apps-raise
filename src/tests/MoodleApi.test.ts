import { MoodleApi } from '../moodleapi'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

const server = setupServer(
  http.post('http://moodle/lib/ajax/service.php', () => {
    return HttpResponse.json([{
      data: {
        uuid: 'uuid',
        jwt: 'jwt'
      }
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
