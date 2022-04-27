import { EventControlledContent } from './EventControlledContent'

interface ContentBlockProps {
  content: string
  waitForEvent?: string
}

export const ContentBlock = ({ content, waitForEvent }: ContentBlockProps): JSX.Element => {
  return (
    <EventControlledContent waitForEvent={waitForEvent}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </EventControlledContent>
  )
}
