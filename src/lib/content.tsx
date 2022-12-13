import React from 'react'
import { createRoot } from 'react-dom/client'
import { ContentLoader } from '../components/ContentLoader'
import { queueContentLoadedV1Event, queueContentLoadFailedV1Event } from './events'

const OS_RAISE_CONTENT_CLASS = 'os-raise-content'

export const renderContentElements = (): number => {
  const osContentItems = document.querySelectorAll(`.${OS_RAISE_CONTENT_CLASS}`)

  osContentItems.forEach((elem) => {
    const htmlElem = elem as HTMLElement
    const contentId = htmlElem.dataset.contentId

    if (contentId === undefined) {
      console.log('WARNING: Ignoring os-raise-content with missing UUID data attribute')
      return
    }

    if (htmlElem.hasChildNodes()) {
      console.log('WARNING: Found non-empty os-raise-content')
    }

    const contentLoadedCallback = (contentId: string, variant: string): void => {
      queueContentLoadedV1Event(Date.now(), contentId, variant).catch((err) => {
        console.error(err)
      })
    }

    const contentLoadFailedCallback = (contentId: string, error?: string): void => {
      queueContentLoadFailedV1Event(Date.now(), contentId, error).catch((err) => {
        console.error(err)
      })
    }

    createRoot(htmlElem).render(
      <React.StrictMode>
        <ContentLoader
          contentId={contentId}
          onContentLoad={contentLoadedCallback}
          onContentLoadFailure={contentLoadFailedCallback} />
      </React.StrictMode>
    )
  })

  return osContentItems.length
}
