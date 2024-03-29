import React from 'react'
import { createRoot } from 'react-dom/client'
import { TooltipBlock } from '../components/TooltipBlock'
import { ENV } from '../lib/env'
import { getVersionId } from './utils'
const OS_RAISE_IB_TOOLTIP_CLASS = 'os-raise-ib-tooltip'

type Definitions = Record<string, string>

const glossaryLookup = (key: string, data: Definitions): string | undefined => {
  const glossaryMap = new Map<string, string>(Object.entries(data).map(entry => [entry[0].toLowerCase(), entry[1]]))

  return glossaryMap.get(key)
}
let glossaryFetchPromise: Promise<Response>
let glossaryJSONPromise: Promise<Definitions>

const getGlossaryData = async (): Promise<Definitions> => {
  const request = new Request(`${ENV.OS_RAISE_CONTENT_URL_PREFIX}/${getVersionId()}/glossary-tooltip.json`)
  glossaryFetchPromise = glossaryFetchPromise ?? fetch(request)
  const response = await glossaryFetchPromise
  if (!response.ok) {
    throw new Error(`Request for glossary-tooltip.json returned ${response.status}`)
  }
  glossaryJSONPromise = glossaryJSONPromise ?? response.json()

  return await glossaryJSONPromise
}

export const tooltipify = async (element: HTMLElement): Promise<void> => {
  const tooltipItems = element.querySelectorAll(`.${OS_RAISE_IB_TOOLTIP_CLASS}`)
  if (tooltipItems.length === 0) {
    return
  }
  const glossary = await getGlossaryData()

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
}
