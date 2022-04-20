import { useEffect, useState } from 'react'

interface CTABlockProps {
  contentString: string
  contentPrompt: string
  buttonText: string
  fireEvent?: string
  waitForEvent?: string

}

export const CTABlock = ({ contentString, contentPrompt, buttonText, fireEvent, waitForEvent }: CTABlockProps): JSX.Element => {
  const [clicked, setclicked] = useState<boolean>(false)
  const [shouldRender, setShouldRender] = useState(waitForEvent === undefined)

  const clickHandler = (): void => {
    if (fireEvent !== undefined) {
      const clickEvent = new CustomEvent(fireEvent)
      document.dispatchEvent(clickEvent)
    }
    setclicked(true)
  }
  useEffect(() => {
    if (waitForEvent === undefined) {
      return
    }
    const handleEvent = (): void => {
      console.log('Event fired!')
      setShouldRender(true)
    }

    document.addEventListener(waitForEvent, handleEvent)

    return () => {
      document.removeEventListener(waitForEvent, handleEvent)
    }
  }, [])

  const promptButton = (): JSX.Element => {
    if (!clicked) {
      return (<>
      <div dangerouslySetInnerHTML={{ __html: contentPrompt }} />
      <button onClick={clickHandler} type="button">{buttonText}</button></>)
    } else {
      return <></>
    }
  }
  if (!shouldRender) {
    return (<></>)
  }
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: contentString }} />
    {promptButton()}
    </>
  )
}
