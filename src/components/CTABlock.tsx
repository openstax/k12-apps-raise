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
  ctaStyleTheme?: string
}

export const CTABlock = ({ content, prompt, buttonText, fireEvent, waitForEvent, ctaStyleTheme }: CTABlockProps): JSX.Element => {
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
    if (!clicked) {
      return (
        <>
          <button
            onClick={clickHandler}
            type="button"
            className={ctaStyleTheme === "green" ? "os-submit-button-style-theme" : "os-submit-button-default-theme"}>
            {buttonText}
          </button>
        </>
      )
    } else {
      return (
        <>
          <button
            onClick={clickHandler}
            type="button"
            className={ctaStyleTheme === "green" ? "os-submit-button-style-theme" : "os-submit-button-default-theme"}
            disabled={true}>
            {buttonText}
          </button>
        </>
      )
    }
  }

  return (
    <EventControlledContent waitForEvent={waitForEvent}>
      <div className={ctaStyleTheme === "green" ? "os-cta-container-style-theme" : "os-cta-container-default-theme"}>
        <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: content }} />
        <div ref={contentRefCallback} dangerouslySetInnerHTML={{ __html: prompt }} />
        {maybeButton()}
      </div>
    </EventControlledContent>
  )
}
