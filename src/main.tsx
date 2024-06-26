import {
  renderContentOnlyBlocks,
  renderCTABlocks,
  renderProblemSetBlocks,
  renderUserInputBlocks,
  renderDesmosBlocks,
  renderSearchBlocks
} from './lib/render-moodle'
import { renderContentElements } from './lib/content'
import { tooltipify } from './lib/tooltip'
import './styles/main.scss'
import { stylify } from './lib/styles'

const processPage = (): void => {
  // Load any content that needs to be fetched and inserted into the page
  const contentElements = renderContentElements()

  // If we fetched content elements, we're done
  if (contentElements === 0) {
    // Render blocks for Moodle storage
    tooltipify(document.body).catch((error) => { console.error(error) })
    stylify(document.body)
    renderContentOnlyBlocks(document.body)
    renderCTABlocks(document.body)
    renderUserInputBlocks(document.body)
    renderProblemSetBlocks(document.body)
    renderDesmosBlocks(document.body)
  }

  renderSearchBlocks(document.body)
}

processPage()
