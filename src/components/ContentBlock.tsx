import { useCallback } from 'react'
import { mathifyElement } from '../lib/math'
import { tooltipify } from '../lib/tooltip'
import { EventControlledContent } from './EventControlledContent'
import { stylify } from '../lib/styles'
interface ContentBlockProps {
  content: string
  waitForEvent?: string
}

export const ContentBlock = ({ content, waitForEvent }: ContentBlockProps): JSX.Element => {
  const contentRefCallback = useCallback((node: HTMLDivElement | null): void => {
    if (node != null) {
      mathifyElement(node)
      tooltipify(node).catch((error) => { console.error(error) })
      stylify(node).catch((error) => { console.error(error) })
    }
  }, [])

  return (
    <EventControlledContent waitForEvent={waitForEvent}>
      <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: content }} />
    </EventControlledContent>
  )
}
