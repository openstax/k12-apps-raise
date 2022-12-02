import 'whatwg-fetch'
import { MoodleApi } from '../moodleapi'
import { setupServer } from 'msw/node'
import { rest } from 'msw'

const server = setupServer(
  rest.post('http://moodle/lib/ajax/service.php?sesskey=12345&info=local_raise_get_user', (req, res, ctx) => {
    return res(ctx.json([{
      data: {
        uuid: 'uuid',
        jwt: 'jwt'
      }

    }]))
  }))

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('Test getuser', async () => {
  const moodleApi = new MoodleApi('http://moodle', '12345')
  const res = await moodleApi.getUser()
  expect(res.uuid === 'uuid')
  expect(res.jwt === 'jwt')
})
