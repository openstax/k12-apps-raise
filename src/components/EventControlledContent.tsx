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
    const waitForUnfireEvent = `${waitForEvent}-unfire`

    const handleEvent = (): void => {
      setShouldRender(true)
    }

    const handleUnfireEvent = (): void => {
      setShouldRender(false)
    }

    document.addEventListener(waitForEvent, handleEvent)
    document.addEventListener(waitForUnfireEvent, handleUnfireEvent)

    return () => {
      document.removeEventListener(waitForEvent, handleEvent)
      document.removeEventListener(waitForUnfireEvent, handleUnfireEvent)
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
