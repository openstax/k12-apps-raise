import { useState, useCallback } from 'react'
import { EventControlledContent } from './EventControlledContent'
import { mathifyElement } from '../lib/math'

interface CTABlockProps {
  contentString: string
  contentPrompt: string
  buttonText: string
  fireEvent?: string
  waitForEvent?: string

}

export const CTABlock = ({ contentString, contentPrompt, buttonText, fireEvent, waitForEvent }: CTABlockProps): JSX.Element => {
  const [clicked, setclicked] = useState<boolean>(false)

  const clickHandler = (): void => {
    if (fireEvent !== undefined) {
      const clickEvent = new CustomEvent(fireEvent)
      document.dispatchEvent(clickEvent)
    }
    setclicked(true)
  }

  const contentRefCallback = useCallback((node: HTMLDivElement | null): void => {
    if (node != null) {
      mathifyElement(node)
    }
  }, [])

  const maybePromptAndButton = (): JSX.Element => {
    if (!clicked) {
      return (<>
      <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: contentPrompt }} />
      <button onClick={clickHandler} type="button" className="btn btn-outline-primary">{buttonText}</button></>)
    } else {
      return <></>
    }
  }

  return (
    <EventControlledContent waitForEvent={waitForEvent}>
      <div className="os-raise-bootstrap">
        <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: contentString }} />
      {maybePromptAndButton()}
      </div>
    </EventControlledContent>
  )
}
