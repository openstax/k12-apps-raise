import React from 'react'
import { createRoot } from 'react-dom/client'
import { TooltipBlock } from '../components/TooltipBlock'
import { ENV } from '../lib/env'

const OS_RAISE_IB_TOOLTIP_CLASS = 'os-raise-ib-tooltip'

export interface GlossaryElement {
  term: string
  definition: string
}

const glossaryLookup = (key: string, data: GlossaryElement): string | undefined => {
  const glossaryMap = new Map<string, string>(Object.entries(data).map(entry => [entry[0].toLowerCase(), entry[1]]))

  return glossaryMap.get(key)
}

export const tooltipify = async (element: HTMLElement): Promise<void> => {
  const tooltipItems = element.querySelectorAll(`.${OS_RAISE_IB_TOOLTIP_CLASS}`)
  const request = new Request('https://k12.openstax.org/contents/raise/efd42eb3/glossary-tooltip.json')
  try {
    const response = await fetch(request)
    if (!response.ok) {
      throw new Error(`Request for content returned ${response.status}`)
    }
    const glossary = await response.json()

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
        elementMatchingData = glossaryLookup(elementText.toLocaleLowerCase().trim(), glossary)
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
  } catch (error) {
  }
}
