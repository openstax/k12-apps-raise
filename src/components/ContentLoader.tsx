import { useEffect, useState } from 'react'
import { blockifyHTML } from '../lib/blocks'
import { ENV } from '../lib/env'

export interface ContentResponse {
  id: string
  content: Array<{variant: string, html: string}>
}

enum FetchStatus {
  Unfetched,
  FetchSuccess,
  FetchFailure
}

interface ContentLoaderProps {
  contentId: string
}

export const ContentLoader = ({ contentId }: ContentLoaderProps): JSX.Element => {
  const [children, setChildren] = useState<JSX.Element[]>([])
  const [fetchStatus, setFetchStatus] = useState<Number>(FetchStatus.Unfetched)

  const fetchContent = async (): Promise<void> => {
    const request = new Request(`${ENV.OS_RAISE_CONTENT_URL_PREFIX}/${contentId}.json`)

    try {
      const response = await fetch(request)
      const data = await response.json() as ContentResponse
      const htmlContent = data.content[0].html

      setChildren(blockifyHTML(htmlContent))
      setFetchStatus(FetchStatus.FetchSuccess)
    } catch {
      setFetchStatus(FetchStatus.FetchFailure)
    }
  }

  useEffect(() => {
    fetchContent().catch(() => {})
  }, [])

  if (fetchStatus === FetchStatus.FetchSuccess) {
    return (
      <>
        {children}
      </>
    )
  }
  // TODO (k12-94): Render appropriate content for other fetchStatus states
  // so users are aware content is loading or fails to do so
  return (
    <></>
  )
}
