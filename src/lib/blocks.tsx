import React from 'react'
import { createRoot } from 'react-dom/client'
import { ContentBlock } from '../components/ContentBlock'
import { CTABlock } from '../components/CTABlock'

export const OS_RAISE_IB_EVENT_PREFIX = 'os-raise-ib-event'
export const OS_RAISE_IB_CONTENT_CLASS = 'os-raise-ib-content'
export const OS_RAISE_IB_CTA_CLASS = 'os-raise-ib-cta'
export const CTA_CONTENT_CLASS = 'os-raise-ib-cta-content'
export const CTA_PROMPT_CLASS = 'os-raise-ib-cta-prompt'

export const isInteractiveBlock = (element: HTMLElement): boolean => {
  return [
    OS_RAISE_IB_CONTENT_CLASS,
    OS_RAISE_IB_CTA_CLASS
  ].some(blockClass => element.classList.contains(blockClass))
}

export const blockifyHTML = (htmlContent: string): JSX.Element[] => {
  // Create a temporary element to build a DOM which can be used to parse /
  // create blocks
  const tmpDiv = document.createElement('div')
  tmpDiv.innerHTML = htmlContent

  let nonIBChildrenHTML = ''
  const childBlocks: JSX.Element[] = []
  let childIndx = 0

  const addChild = (component: JSX.Element): void => {
    const wrappedWithIndex = <div key={childIndx}>{component}</div>
    childBlocks.push(wrappedWithIndex)
    childIndx++
  }

  Array.from(tmpDiv.children).forEach((elem) => {
    const htmlElem = elem as HTMLElement
    if (!isInteractiveBlock(htmlElem)) {
      // Append this to current non-IB children HTML to consolidate adjacent
      // elements which are not interactive blocks
      nonIBChildrenHTML += elem.outerHTML
    } else {
      // Create a content-only block if any have been found to this point
      if (nonIBChildrenHTML !== '') {
        addChild(createNonwaitingContentBlock(nonIBChildrenHTML))
        nonIBChildrenHTML = ''
      }
      addChild(blockifyElement(htmlElem))
    }
  })

  // Catch any remaining non-IB children
  if (nonIBChildrenHTML !== '') {
    addChild(createNonwaitingContentBlock(nonIBChildrenHTML))
  }

  return childBlocks
}

const blockifyElement = (element: HTMLElement): JSX.Element => {
  if (element.classList.contains(OS_RAISE_IB_CTA_CLASS)) {
    const maybeCTABlock = parseCTABlock(element)
    if (maybeCTABlock !== null) {
      return maybeCTABlock
    }
  }

  if (element.classList.contains(OS_RAISE_IB_CONTENT_CLASS)) {
    const maybeContentOnlyBlock = parseContentOnlyBlock(element)
    if (maybeContentOnlyBlock !== null) {
      return maybeContentOnlyBlock
    }
  }

  return createNonwaitingContentBlock(element.outerHTML)
}

const namespaceEvent = (eventName: string | undefined): string | undefined => {
  if (eventName === undefined) {
    return undefined
  }

  return `${OS_RAISE_IB_EVENT_PREFIX}-${eventName}`
}

const createNonwaitingContentBlock = (content: string): JSX.Element => {
  return <ContentBlock content={content} />
}

export const parseCTABlock = (element: HTMLElement): JSX.Element | null => {
  if (!element.classList.contains(OS_RAISE_IB_CTA_CLASS)) {
    return null
  }

  const contentElem = element.querySelector(`.${CTA_CONTENT_CLASS}`)
  const promptElem = element.querySelector(`.${CTA_PROMPT_CLASS}`)
  const buttonText = element.dataset.buttonText ?? 'Next'
  const fireEvent = namespaceEvent(element.dataset.fireEvent)
  const waitForEvent = namespaceEvent(element.dataset.waitForEvent)

  if (contentElem === null || promptElem === null) {
    console.error('CTABlock content string or prompt is null')
    return null
  }

  const contentInnerHTML = contentElem.innerHTML
  const promptInnerHTML = promptElem.innerHTML

  return <CTABlock
    content={contentInnerHTML}
    prompt={promptInnerHTML}
    buttonText={buttonText}
    fireEvent={fireEvent}
    waitForEvent={waitForEvent}
  />
}

export const parseContentOnlyBlock = (element: HTMLElement): JSX.Element | null => {
  if (!element.classList.contains(OS_RAISE_IB_CONTENT_CLASS)) {
    return null
  }

  const waitForEvent = namespaceEvent(element.dataset.waitForEvent)
  const htmlContent = element.innerHTML

  return <ContentBlock content={htmlContent} waitForEvent={waitForEvent} />
}

const replaceElementWithBlock = (element: HTMLElement, component: JSX.Element): void => {
  element.innerHTML = ''

  createRoot(element).render(
    component
  )
}

export const renderCTABlocks = (element: HTMLElement): void => {
  const ctaItems = element.querySelectorAll(`.${OS_RAISE_IB_CTA_CLASS}`)

  ctaItems.forEach(elem => {
    const htmlElem = elem as HTMLElement
    const maybeCTABlock = parseCTABlock(htmlElem)

    if (maybeCTABlock === null) {
      return
    }
    replaceElementWithBlock(htmlElem, maybeCTABlock)
  })
}

export const renderContentOnlyBlocks = (element: HTMLElement): void => {
  const contentItems = element.querySelectorAll(`.${OS_RAISE_IB_CONTENT_CLASS}`)

  contentItems.forEach(elem => {
    const htmlElem = elem as HTMLElement
    const maybeContentOnlyBlock = parseContentOnlyBlock(htmlElem)

    if (maybeContentOnlyBlock === null) {
      return
    }
    replaceElementWithBlock(htmlElem, maybeContentOnlyBlock)
  })
}
