import { useEffect, useState } from 'react'

interface EventControlledContentProps {
  waitForEvent?: string
  children: React.ReactNode
}

export const EventControlledContent = ({ waitForEvent, children }: EventControlledContentProps): JSX.Element => {
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
    <>
      { children }
    </>
  )
}
