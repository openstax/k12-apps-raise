
import React from 'react'
import { createRoot } from 'react-dom/client'
import { ContentBlock } from '../components/ContentBlock'
import { CTABlock } from '../components/CTABlock'

const OS_RAISE_IB_CTA_CLASS = 'os-raise-ib-cta'
const CONTENT_CLASS = 'os-raise-ib-cta-content'
const PROMPT_CLASS = 'os-raise-ib-cta-prompt'
const OS_RAISE_IB_CONTENT_CLASS = 'os-raise-ib-content'

export const renderCTABlocks = async (element: HTMLElement): Promise<void> => {
  const ctaItems = element.querySelectorAll(`.${OS_RAISE_IB_CTA_CLASS}`)

  ctaItems.forEach(elem => {
    const htmlElem = elem as HTMLElement
    const contentString = htmlElem.querySelector(`.${CONTENT_CLASS}`)
    const contentPrompt = htmlElem.querySelector(`.${PROMPT_CLASS}`)
    const buttonText = htmlElem.dataset.buttonText ?? 'Next'
    const fireEvent = htmlElem.dataset.fireEvent
    const waitForEvent = htmlElem.dataset.waitForEvent

    if (contentString === null || contentPrompt === null) {
      console.error('Content string or prompt is null')
      return
    }

    createRoot(htmlElem).render(
        <React.StrictMode>
            <CTABlock contentString={contentString.innerHTML} contentPrompt={contentPrompt.innerHTML} buttonText={buttonText} fireEvent={fireEvent} waitForEvent={waitForEvent} />
        </React.StrictMode>
    )
  })
}

export const renderContentOnlyBlocks = async (element: HTMLElement): Promise<void> => {
  const ctaItems = element.querySelectorAll(`.${OS_RAISE_IB_CONTENT_CLASS}`)

  ctaItems.forEach(elem => {
    const htmlElem = elem as HTMLElement
    const waitForEvent = htmlElem.dataset.waitForEvent

    createRoot(htmlElem).render(
        <React.StrictMode>
            <ContentBlock content={htmlElem.innerHTML} waitForEvent={waitForEvent} />
        </React.StrictMode>
    )
  })
}
