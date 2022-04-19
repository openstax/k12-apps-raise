import { createRoot } from 'react-dom/client'
import { renderContentElements } from './lib/content'
import { TooltipBlock } from './components/TooltipBlock'
import './styles/main.scss'

const processPage = async (): Promise<void> => {
  // Load any content that needs to be fetched and inserted into the page
  await renderContentElements()
  await testTooltip()
  // TODO: Insert processing "page type" templates
}

const testTooltip = async (): Promise<void> => {
  const result = document.querySelector('#special')
  if (result === null) {
    return
  }
  createRoot(result).render(
    <TooltipBlock text="my-text" tip="<div><p>\( x=2 \)</p></div>"/>
  )
}

processPage().catch((error) => {
  console.error(error)
})
