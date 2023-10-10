import { MoodleApi } from '../moodleapi'
import { getCurrentContext } from './utils'

export interface Persistor {
  get: (key: string) => Promise<string | null>
  put: (key: string, value: string) => Promise<void>
}

export const getMoodlePersistor = (): Persistor | undefined => {
  const { courseId } = getCurrentContext()

  if (courseId === undefined || window.M === undefined) {
    return undefined
  }

  const moodleApi = new MoodleApi(window.M.cfg.wwwroot, window.M.cfg.sesskey)
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
