import { useEffect, useState } from 'react'
import { ENV } from '../lib/env'

interface ContentResponse {
  id: string
  content: Array<{variant: string, html: string}>
}

enum FetchStatus {
  Unfetched,
  FetchSuccess,
  FetchFailure
}

export const ContentLoader = ({ contentId, contentLoadedCallback }: { contentId: string, contentLoadedCallback: () => void }): JSX.Element => {
  const [innerHTMLContent, setInnerHTMLContent] = useState<string>('')
  const [fetchStatus, setFetchStatus] = useState<Number>(FetchStatus.Unfetched)

  const fetchContent = async (): Promise<void> => {
    const request = new Request(`${ENV.OS_RAISE_CONTENT_URL_PREFIX}/${contentId}.json`)

    try {
      const response = await fetch(request)
      const data = await response.json() as ContentResponse
      const htmlContent = data.content[0].html

      setInnerHTMLContent(htmlContent)
      setFetchStatus(FetchStatus.FetchSuccess)
    } catch {
      setFetchStatus(FetchStatus.FetchFailure)
    }
  }

  useEffect(() => {
    fetchContent().catch(() => {})
  }, [])

  useEffect(() => {
    if (fetchStatus !== FetchStatus.Unfetched) {
      // Invoke callback if fetch succeeded or failed
      contentLoadedCallback()
    }
  }, [fetchStatus])

  if (fetchStatus === FetchStatus.FetchSuccess) {
    return (
      <div dangerouslySetInnerHTML={{ __html: innerHTMLContent }} />
    )
  }
  // TODO (k12-94): Render appropriate content for other fetchStatus states
  // so users are aware content is loading or fails to do so
  return (
    <></>
  )
}