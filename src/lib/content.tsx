import React from 'react'
import { createRoot } from 'react-dom/client'
import { loadMathJax } from './math'
import { ContentLoader } from '../components/ContentLoader'

const OS_RAISE_CONTENT_CLASS = 'os-raise-content'

export const renderContentElements = async (): Promise<number> => {
  const osContentItems = document.querySelectorAll(`.${OS_RAISE_CONTENT_CLASS}`)
  const contentPromises: Array<Promise<void>> = []

  if (osContentItems.length !== 0) {
    // This is an optimization so we can proactively load MathJax in parallel
    // while loading content
    loadMathJax().catch(() => {})
  }

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

  return osContentItems.length
}
