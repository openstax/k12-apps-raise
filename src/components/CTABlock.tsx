import { useState, useCallback } from 'react'
import { EventControlledContent } from './EventControlledContent'
import { mathifyElement } from '../lib/math'
import { tooltipify } from '../lib/tooltip'

interface CTABlockProps {
  content: string
  prompt: string
  buttonText: string
  fireEvent?: string
  waitForEvent?: string
  styleTheme?: string
}

export const CTABlock = ({ content, prompt, buttonText, fireEvent, waitForEvent, styleTheme }: CTABlockProps): JSX.Element => {
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
      tooltipify(node).catch((error) => { console.error(error) })
    }
  }, [])

  const maybeButton = (): JSX.Element => {
    return (
      <button
        onClick={clickHandler}
        type="button"
        className={styleTheme === "green" ? "os-submit-button-green-theme" : "os-submit-button-default-theme"}
        disabled={clicked}>
        {buttonText}
      </button>
    )
  }

  return (
    <EventControlledContent waitForEvent={waitForEvent}>
      <div className={styleTheme === "green" ? "os-cta-container-green-theme" : "os-cta-container-default-theme"}>
        <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: content }} />
        <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: prompt }} />
        {maybeButton()}
      </div>
    </EventControlledContent>
  )
}
