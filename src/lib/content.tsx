import React from 'react'
import { createRoot } from 'react-dom/client'
import { ContentLoader } from '../components/ContentLoader'
import { EventManager, createContentLoadFailedV1Event, createContentLoadedV1Event } from './events'

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

    const contentLoadCallback = (contentId: string, variant: string): void => {
      const event = createContentLoadedV1Event(contentId, variant)
      if (event !== null) {
        EventManager.getInstance().queueEvent(event)
      }
    }
    const contentLoadFailedCallback = (contentId: string, error?: string): void => {
      const event = createContentLoadFailedV1Event(contentId, error)
      if (event !== null) {
        EventManager.getInstance().queueEvent(event)
      }
    }

    createRoot(htmlElem).render(
      <React.StrictMode>
        <ContentLoader
          contentId={contentId}
          onContentLoad={contentLoadCallback}
          onContentLoadFailure={contentLoadFailedCallback} />
      </React.StrictMode>
    )
  })

  return osContentItems.length
}
