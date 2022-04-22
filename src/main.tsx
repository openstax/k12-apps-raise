import { renderContentElements } from './lib/content'
import { renderCTABlocks, renderContentOnlyBlocks } from './lib/blocks'
import './styles/main.scss'
import { tooltipify } from './lib/tooltip'
import { createRoot } from 'react-dom/client'
import { SearchBlock } from './components/SearchBlock'
import glossary from '../data/glossary.json'

const processPage = (): void => {
  // Load any content that needs to be fetched and inserted into the page
  const contentElements = renderContentElements()

  // If we found / fetched content elements, we're done. What follows is
  // intended for content that is in Moodle storage
  if (contentElements !== 0) {
    return
  }

  tooltipify(document.body)
  renderCTABlocks(document.body)
  renderContentOnlyBlocks(document.body)
}

processPage()

const specialData = new Map<string, string>(Object.entries(glossary).map(entry => [entry[0].toLowerCase(), entry[1]]))

const specialElement = document.querySelector('#special')
if (specialElement !== null) {
  createRoot(specialElement).render(
    <SearchBlock data={specialData}/>
  )
}
