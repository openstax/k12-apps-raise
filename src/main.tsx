import { renderContentElements } from './lib/content'
import { dndInteractiveDemo, inputInteractiveDemo } from './demos'
import './styles/main.scss'

const processPage = async (): Promise<void> => {
  // Load any content that needs to be fetched and inserted into the page
  await renderContentElements()
  // TODO: Insert processing "page type" templates
  inputInteractiveDemo()
  dndInteractiveDemo()
}

processPage().catch((error) => {
  console.error(error)
})
