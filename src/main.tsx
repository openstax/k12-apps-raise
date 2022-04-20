import { renderContentElements } from './lib/content'
import { tooltipify } from './lib/tooltip'
import { renderCTABlocks, renderContentOnlyBlocks } from './lib/blocks'
import './styles/main.scss'

const processPage = async (): Promise<void> => {
  // Load any content that needs to be fetched and inserted into the page
  await renderContentElements()
  // TODO: Insert processing "page type" templates

  // NOTE: renderContentElements should provide any found elements for us
  // to process, but for now just working with document
  tooltipify(document.body).catch(error => console.error(error))
  renderCTABlocks(document.body).catch(error => console.error(error))
}

processPage().catch((error) => {
  console.error(error)
})
