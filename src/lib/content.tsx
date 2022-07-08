import React from 'react'
import { createRoot } from 'react-dom/client'
import { ContentLoader } from '../components/ContentLoader'
import { sendEvent } from './events'

const OS_RAISE_CONTENT_CLASS = 'os-raise-content'

export const renderContentElements = (): number => {
  const osContentItems = document.querySelectorAll(`.${OS_RAISE_CONTENT_CLASS}`)

  osContentItems.forEach((elem) => {
    const htmlElem = elem as HTMLElement
    const contentId = htmlElem.dataset.contentId
    const pipelineId = htmlElem.dataset.pipelineId

    if (contentId === undefined) {
      console.log('WARNING: Ignoring os-raise-content with missing UUID data attribute')
      return
    }

    if (htmlElem.hasChildNodes()) {
      console.log('WARNING: Found non-empty os-raise-content')
    }

    createRoot(htmlElem).render(
      <React.StrictMode>
        <ContentLoader contentId={contentId}/>
      </React.StrictMode>
    )
    sendEvent(pipelineId)
      .catch(err => console.error(err))
  })

  return osContentItems.length
}
