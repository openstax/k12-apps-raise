import React from 'react'
import { createRoot } from 'react-dom/client'
import { TooltipBlock } from '../components/TooltipBlock'
import glossary from '../../data/glossary-tooltip.json'

const OS_RAISE_IB_TOOLTIP_CLASS = 'os-raise-ib-tooltip'

const glossaryLookup = (key: string): string | undefined => {
  const glossaryMap = new Map<string, string>(Object.entries(glossary).map(entry => [entry[0].toLowerCase(), entry[1]]))

  return glossaryMap.get(key)
}

export const tooltipify = (element: HTMLElement): void => {
  const tooltipItems = element.querySelectorAll(`.${OS_RAISE_IB_TOOLTIP_CLASS}`)

  tooltipItems.forEach(elem => {
    const htmlElem = elem as HTMLElement
    const dataStore = htmlElem.dataset.store
    const elementText = htmlElem.textContent
    let elementMatchingData: string | undefined

    if ((dataStore === undefined) || (elementText === null)) {
      // Ignore elements that don't have datastore specified or there is no
      // element text term
      return
    }

    if (dataStore === 'glossary-tooltip') {
      elementMatchingData = glossaryLookup(elementText.toLocaleLowerCase().trim())
    }

    if (elementMatchingData === undefined) {
      return
    }

    createRoot(htmlElem).render(
      <React.StrictMode>
        <TooltipBlock text={elementText} tip={elementMatchingData}/>
      </React.StrictMode>

    )
  })
}
