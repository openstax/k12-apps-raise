import { renderContentElements } from './lib/content'
import { renderCTABlocks, renderContentOnlyBlocks } from './lib/blocks'
import './styles/main.scss'
import { tooltipify } from './lib/tooltip'

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
