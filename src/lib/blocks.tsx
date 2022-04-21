
import React from 'react'
import { createRoot } from 'react-dom/client'
import { ContentBlock } from '../components/ContentBlock'
import { CTABlock } from '../components/CTABlock'

const OS_RAISE_IB_CTA_CLASS = 'os-raise-ib-cta'
const CTA_CONTENT_CLASS = 'os-raise-ib-cta-content'
const CTA_PROMPT_CLASS = 'os-raise-ib-cta-prompt'
const OS_RAISE_IB_CONTENT_CLASS = 'os-raise-ib-content'

export const blockifyElement = (element: HTMLElement): JSX.Element => {
  if (element.classList.contains(OS_RAISE_IB_CTA_CLASS)) {
    const maybeCTABlock = parseCTABlock(element)
    if (maybeCTABlock !== null) {
      return maybeCTABlock
    }
  }

  if (element.classList.contains(OS_RAISE_IB_CONTENT_CLASS)) {
    const mayeContentOnlyBlock = parseContentOnlyBlock(element)
    if (mayeContentOnlyBlock !== null) {
      return mayeContentOnlyBlock
    }
  }

  return <ContentBlock content={element.outerHTML} />
}

const parseCTABlock = (element: HTMLElement): JSX.Element | null => {
  if (!element.classList.contains(OS_RAISE_IB_CTA_CLASS)) {
    return null
  }

  const contentElem = element.querySelector(`.${CTA_CONTENT_CLASS}`)
  const promptElem = element.querySelector(`.${CTA_PROMPT_CLASS}`)
  const buttonText = element.dataset.buttonText ?? 'Next'
  const fireEvent = element.dataset.fireEvent
  const waitForEvent = element.dataset.waitForEvent

  if (contentElem === null || promptElem === null) {
    console.error('CTABlock content string or prompt is null')
    return null
  }

  const contentInnerHTML = contentElem.innerHTML
  const promptInnerHTML = promptElem.innerHTML

  return <CTABlock
    contentString={contentInnerHTML}
    contentPrompt={promptInnerHTML}
    buttonText={buttonText}
    fireEvent={fireEvent}
    waitForEvent={waitForEvent}
  />
}

const parseContentOnlyBlock = (element: HTMLElement): JSX.Element | null => {
  if (!element.classList.contains(OS_RAISE_IB_CONTENT_CLASS)) {
    return null
  }

  const waitForEvent = element.dataset.waitForEvent
  const htmlContent = element.innerHTML

  return <ContentBlock content={htmlContent} waitForEvent={waitForEvent} />
}

export const renderCTABlocks = (element: HTMLElement): void => {
  const ctaItems = element.querySelectorAll(`.${OS_RAISE_IB_CTA_CLASS}`)

  ctaItems.forEach(elem => {
    const htmlElem = elem as HTMLElement
    const maybeCTABlock = parseCTABlock(htmlElem)

    if (maybeCTABlock === null) {
      return
    }

    htmlElem.innerHTML = ''

    createRoot(htmlElem).render(
      <React.StrictMode>
        {maybeCTABlock}
      </React.StrictMode>
    )
  })
}

export const renderContentOnlyBlocks = (element: HTMLElement): void => {
  const ctaItems = element.querySelectorAll(`.${OS_RAISE_IB_CONTENT_CLASS}`)

  ctaItems.forEach(elem => {
    const htmlElem = elem as HTMLElement
    const maybeContentOnlyBlock = parseContentOnlyBlock(htmlElem)

    if (maybeContentOnlyBlock === null) {
      return
    }

    htmlElem.innerHTML = ''

    createRoot(htmlElem).render(
      <React.StrictMode>
        {maybeContentOnlyBlock}
      </React.StrictMode>
    )
  })
}
