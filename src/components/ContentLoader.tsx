import { useEffect, useState } from 'react'
import { getVariant } from '../lib/utils'
import { blockifyHTML } from '../lib/blocks'
import { ENV } from '../lib/env'
import { ContentLoadedContext } from '../lib/contexts'

export interface ContentResponse {
  id: string
  content: ContentVariant[]
}

export interface ContentVariant {
  variant: string
  html: string
}

enum FetchStatus {
  Unfetched,
  FetchSuccess,
  FetchFailure
}

interface ContentLoaderProps {
  contentId: string
  versionId: string
  onContentLoad?: (contentId: string, variant: string) => void
  onContentLoadFailure?: (contentId: string, error?: string) => void
}

export const ContentLoader = ({ contentId, versionId, onContentLoad, onContentLoadFailure }: ContentLoaderProps): JSX.Element => {
  const [children, setChildren] = useState<JSX.Element[]>([])
  const [variant, setVariant] = useState('')
  const [fetchStatus, setFetchStatus] = useState<number>(FetchStatus.Unfetched)

  const fetchContent = async (): Promise<void> => {
    const request = new Request(`${ENV.OS_RAISE_CONTENT_URL_PREFIX}/${versionId}/${contentId}.json`)

    try {
      const response = await fetch(request)
      if (!response.ok) {
        throw new Error(`Request for content returned ${response.status}`)
      }
      const data = await response.json() as ContentResponse
      const selectedVariant = getVariant(data.content)

      if (selectedVariant === undefined) {
        throw new Error('Could not resolve content variant')
      }

      if (onContentLoad !== undefined) {
        onContentLoad(contentId, selectedVariant.variant)
      }

      setChildren(blockifyHTML(selectedVariant.html))
      setVariant(selectedVariant.variant)
      setFetchStatus(FetchStatus.FetchSuccess)
    } catch (error) {
      if (onContentLoadFailure !== undefined) {
        onContentLoadFailure(contentId, String(error))
      }
      setFetchStatus(FetchStatus.FetchFailure)
    }
  }

  useEffect(() => {
    fetchContent().catch(() => { })
  }, [])

  if (fetchStatus === FetchStatus.FetchSuccess) {
    return (
      <ContentLoadedContext.Provider value={{ variant, contentId }}>
        {children}
      </ContentLoadedContext.Provider>
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
