import { useCallback } from 'react'
import { mathifyElement } from '../lib/math'
import { tooltipify } from '../lib/tooltip'
import { EventControlledContent } from './EventControlledContent'

interface ContentBlockProps {
  content: string
  waitForEvent?: string
}

export const ContentBlock = ({ content, waitForEvent }: ContentBlockProps): JSX.Element => {
  const contentRefCallback = useCallback((node: HTMLDivElement | null): void => {
    if (node != null) {
      mathifyElement(node)
      void tooltipify(node)
    }
  }, [])

  return (
    <EventControlledContent waitForEvent={waitForEvent}>
      <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: content }} />
    </EventControlledContent>
  )
}
