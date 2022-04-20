import { useEffect, useState } from 'react'

interface ContentBlockProps {
  content: string
  waitForEvent?: string
}

export const ContentBlock = ({ content, waitForEvent }: ContentBlockProps): JSX.Element => {
  const [shouldRender, setShouldRender] = useState(waitForEvent === undefined)

  useEffect(() => {
    if (waitForEvent === undefined) {
      return
    }
    const handleEvent = (): void => {
      setShouldRender(true)
    }

    document.addEventListener(waitForEvent, handleEvent)

    return () => {
      document.removeEventListener(waitForEvent, handleEvent)
    }
  }, [])

  if (!shouldRender) {
    return <></>
  }

  return (
    <>{content}</>
  )
}
