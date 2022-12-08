import { useEffect, useState } from 'react'
import { getVariant, getVariantName } from '../lib/utils'
import { blockifyHTML } from '../lib/blocks'
import { ENV } from '../lib/env'

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
  onContentLoad?: (contentID: string, variant: string) => void
  onContentLoadFailure?: (contentID: string, errorMessage?: string) => void
}

export const ContentLoader = ({ contentId, onContentLoad, onContentLoadFailure }: ContentLoaderProps): JSX.Element => {
  const [children, setChildren] = useState<JSX.Element[]>([])
  const [fetchStatus, setFetchStatus] = useState<Number>(FetchStatus.Unfetched)
  const [variantName, setVariantName] = useState<string>('')

  const fetchContent = async (): Promise<void> => {
    const request = new Request(`${ENV.OS_RAISE_CONTENT_URL_PREFIX}/${contentId}.json`)

    try {
      console.log('creating request')
      const response = await fetch(request)
      console.log('request sent')
      if (!response.ok) {
        setFetchStatus(FetchStatus.FetchFailure)
        return
      }
      if (onContentLoad !== undefined) {
        onContentLoad(contentId, variantName)
      }
      console.log('Just Sent OnContentLoad')
      const data = await response.json() as ContentResponse
      const htmlContent = getVariant(data.content)
      setVariantName(getVariantName())
      if (htmlContent === undefined) {
        setFetchStatus(FetchStatus.FetchFailure)
        return
      }
      setChildren(blockifyHTML(htmlContent))
      setFetchStatus(FetchStatus.FetchSuccess)
    } catch {
      if (onContentLoadFailure !== undefined) {
        onContentLoadFailure(contentId, 'Fetch failure')
      }
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
