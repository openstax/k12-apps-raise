import { useEffect, useState, useRef } from 'react'
import { mathifyElement } from '../lib/math'

interface EventControlledContentProps {
  waitForEvent?: string
  children: React.ReactNode
}

export const EventControlledContent = ({ waitForEvent, children }: EventControlledContentProps): JSX.Element => {
  const [shouldRender, setShouldRender] = useState(waitForEvent === undefined)
  const contentDiv = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const maybeDiv = contentDiv.current
    if (maybeDiv === null) {
      return
    }
    mathifyElement(maybeDiv)
  }, [shouldRender])

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
  }, [waitForEvent])

  if (!shouldRender) {
    return <></>
  }

  return (
    <>
      { children }
    </>
  )
}
