import { MoodleApi } from '../moodleapi'
import { ENV } from './env'
import { getCurrentContext } from './utils'

export interface Persistor {
  get: (key: string) => Promise<string | null>
  put: (key: string, value: string) => Promise<void>
}

export const getMoodlePersistor = (): Persistor | undefined => {
  const { courseId, host, moodleWWWRoot, moodleSessKey } = getCurrentContext()

  if (courseId === undefined || moodleWWWRoot === undefined || moodleSessKey === undefined || host === undefined ||
     !ENV.OS_RAISE_ENABLE_MOODLE_PERSISTOR_HOSTS.includes(host)) {
    return undefined
  }

  const moodleApi = new MoodleApi(moodleWWWRoot, moodleSessKey)
  return {
    get: async (key: string): Promise<string | null> => {
      const data = await moodleApi.getData(courseId, key)
      return data.value
    },
    put: async (key: string, value: string): Promise<void> => {
      await moodleApi.putData(courseId, key, value)
    }
  }
}
