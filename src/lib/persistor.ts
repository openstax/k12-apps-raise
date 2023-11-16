import { MoodleApi, type PersistorGetResponse } from '../moodleapi'
import { ENV } from './env'
import { getCurrentContext } from './utils'

export interface Persistor {
  get: (dataKey: string, prefetchKey?: string) => Promise<string | null>
  put: (dataKey: string, dataValue: string, prefetchKey?: string) => Promise<void>
}

type CacheData = Record<string, Promise<PersistorGetResponse> | PersistorGetResponse>
const cache: CacheData = {}
export const getMoodlePersistor = (): Persistor | undefined => {
  const { courseId, host, moodleWWWRoot, moodleSessKey } = getCurrentContext()

  if (courseId === undefined || moodleWWWRoot === undefined || moodleSessKey === undefined || host === undefined ||
     !ENV.OS_RAISE_ENABLE_MOODLE_PERSISTOR_HOSTS.includes(host)) {
    return undefined
  }

  const moodleApi = new MoodleApi(moodleWWWRoot, moodleSessKey)
  return {
    get: async (dataKey: string, prefetchKey?: string): Promise<string | null> => {
      if (prefetchKey != null && cache[prefetchKey] !== undefined) {
        const data = await cache[prefetchKey]
        const foundItem = data.find((item) => item.dataKey === dataKey)
        return foundItem !== undefined ? foundItem.dataValue : null
      }

      let data: PersistorGetResponse = []
      let fetchData: Promise<PersistorGetResponse> | PersistorGetResponse = cache[prefetchKey ?? '']

      if (prefetchKey != null) {
        if (fetchData === undefined) {
          fetchData = cache[prefetchKey] = moodleApi.getData(courseId, dataKey, prefetchKey)
        }
      } else {
        fetchData = moodleApi.getData(courseId, dataKey, prefetchKey)
      }

      data = await fetchData

      const foundItem = data.find((item) => item.dataKey === dataKey)
      return foundItem !== undefined ? foundItem.dataValue : null
    },
    put: async (dataKey: string, dataValue: string, prefetchKey?: string): Promise<void> => {
      await moodleApi.putData(courseId, dataKey, dataValue, prefetchKey)
    }
  }
}
