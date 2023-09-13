export interface Persistor {
  get: (key: string) => Promise<string | null>
  put: (key: string, value: string) => Promise<void>
}

export const browserPersistor: Persistor = {
  get: async (key: string): Promise<string | null> => {
    return localStorage.getItem(key)
  },
  put: async (key: string, value: string) => {
    localStorage.setItem(key, value)
  }
}
