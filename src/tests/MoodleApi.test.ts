import 'whatwg-fetch'
import { MoodleApi } from '../moodleapi'
import { setupServer } from 'msw/node'
import { rest } from 'msw'

const server = setupServer(
  rest.post('http://moodle/lib/ajax/service.php', async (req, res, ctx) => {
    const requestBody = await req.json()
    const methodname = requestBody[0].methodname

    if (methodname === 'local_raise_get_user') {
      return await res(ctx.json([{
        data: {
          uuid: 'uuid',
          jwt: 'jwt'
        }
      }]))
    } else if (methodname === 'local_persist_get') {
      const courseId = requestBody[0].args.courseid
      const key = requestBody[0].args.key
      if (courseId === 1 && key === 'testKey') {
        return await res(ctx.json([{
          data: {
            value: 'testValue'
          }
        }]))
      }
    } else if (methodname === 'local_persist_put') {
      const courseId = requestBody[0].args.courseid
      const key = requestBody[0].args.key
      const value = requestBody[0].args.value
      if (courseId === 1 && key === 'testKey' && value === 'testValue') {
        return await res(ctx.json([{
          data: {
            success: true
          }
        }]))
      }
    }
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

test('Test getData', async () => {
  const moodleApi = new MoodleApi('http://moodle', '12345')
  const courseId = 1
  const key = 'testKey'
  const response = await moodleApi.getData(courseId, key)
  expect(response.value).toBe('testValue')
})

test('Test putData', async () => {
  const moodleApi = new MoodleApi('http://moodle', '12345')
  const courseId = 1
  const key = 'testKey'
  const value = 'testValue'
  await expect(moodleApi.putData(courseId, key, value)).resolves.toEqual(undefined)
})
