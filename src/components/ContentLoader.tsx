import { useEffect, useState } from 'react'
import { blockifyHTML } from '../lib/blocks'
import { ENV } from '../lib/env'

interface ContentResponse {
  id: string
  content: Array<{ variant: string, html: string }>
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
      if (!response.ok) {
        setFetchStatus(FetchStatus.FetchFailure)
        return
      }

      const data = await response.json() as ContentResponse
      const htmlContent = data.content[0].html

      setChildren(blockifyHTML(htmlContent))
      setFetchStatus(FetchStatus.FetchSuccess)
    } catch {
      setFetchStatus(FetchStatus.FetchFailure)
    }
  }

  useEffect(() => {
    fetchContent().catch(() => { })
  }, [])

  if (fetchStatus === FetchStatus.FetchSuccess) {
    return (
      <>
        {children}
      </>
    )
  }

  if (fetchStatus === FetchStatus.FetchFailure) {
    return (
      <div className="os-raise-bootstrap">
        <div className="text-center">
          <span className="text-danger">There was an error loading content. Please try refreshing the page.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="os-raise-bootstrap">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  )
}
