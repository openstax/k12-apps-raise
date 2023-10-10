import { createContext } from 'react'

export const ContentLoadedContext = createContext<{ variant: string | undefined, contentId: string | undefined }>({ variant: undefined, contentId: undefined })
