import React from 'react'
import { createRoot } from 'react-dom/client'
import { mathifyElement } from './utils'
import { ContentLoader } from '../components/ContentLoader'

const OS_RAISE_CONTENT_CLASS = 'os-raise-content'

export const renderContentElements = async (): Promise<void> => {
  const osContentItems = document.querySelectorAll(`.${OS_RAISE_CONTENT_CLASS}`)
  const contentPromises: Array<Promise<void>> = []

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

    mathifyElement(elem).catch((error) => {
      console.error(error)
    })

    const contentPromise = new Promise<void>((resolve) => {
      createRoot(htmlElem).render(
        <React.StrictMode>
          <ContentLoader contentId={contentId} contentLoadedCallback={resolve}/>
        </React.StrictMode>
      )
    })
    contentPromises.push(contentPromise)
  })

  await Promise.all(contentPromises)
}
