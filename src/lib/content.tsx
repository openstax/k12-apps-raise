import React from 'react'
import { createRoot } from 'react-dom/client'
import { ContentLoader } from '../components/ContentLoader'
import { EventManager, createContentLoadFailedV1, createContentLoadV1Event } from './events'

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

    createRoot(htmlElem).render(
      <React.StrictMode>
        <ContentLoader contentId={contentId} onContentLoad={(contentID: string, variant: string) => { EventManager.getInstance().queueEvent(createContentLoadV1Event(contentID, variant)) }}
          onContentLoadFailure={(error: string) => { EventManager.getInstance().queueEvent(createContentLoadFailedV1(error, contentId)) }} />
      </React.StrictMode>
    )
  })

  return osContentItems.length
}
