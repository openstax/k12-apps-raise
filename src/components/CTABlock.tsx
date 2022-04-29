import { useState } from 'react'
import { EventControlledContent } from './EventControlledContent'

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

  const promptButton = (): JSX.Element => {
    if (!clicked) {
      return (<>
      <div dangerouslySetInnerHTML={{ __html: contentPrompt }} />
      <button onClick={clickHandler} type="button" className="btn btn-outline-primary">{buttonText}</button></>)
    } else {
      return <></>
    }
  }

  return (
    <EventControlledContent waitForEvent={waitForEvent}>
      <div className="os-raise-bootstrap">
        <div dangerouslySetInnerHTML={{ __html: contentString }} />
      {promptButton()}
      </div>
    </EventControlledContent>
  )
}
