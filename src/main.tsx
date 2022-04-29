import { renderContentOnlyBlocks } from './lib/blocks'
import { renderContentElements } from './lib/content'
import { tooltipify } from './lib/tooltip'
import './styles/main.scss'

const processPage = (): void => {
  // Load any content that needs to be fetched and inserted into the page
  const contentElements = renderContentElements()

  // If we fetched content elements, we're done
  if (contentElements === 0) {
    // Render blocks for Moodle storage
    tooltipify(document.body)

    renderContentOnlyBlocks(document.body)
  }
}

processPage()
