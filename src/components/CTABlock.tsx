import { useState } from 'react'

interface CTABlockProps {
  contentString: string
  contentPrompt: string
  buttonText: string
  firesEvent?: string

}

export const CTABlock = ({ contentString, contentPrompt, buttonText, firesEvent }: CTABlockProps): JSX.Element => {
  const [clicked, setclicked] = useState<boolean>(false)

  const clickHandler = (): void => {
    if (firesEvent !== undefined) {
      const clickEvent = new CustomEvent(firesEvent)
      document.dispatchEvent(clickEvent)
    }
    setclicked(true)
  }

  const promptButton = (): JSX.Element => {
    if (!clicked) {
      return (<>
      <div dangerouslySetInnerHTML={{ __html: contentPrompt }} />
      <button onClick={clickHandler} type="button">{buttonText}</button></>)
    } else {
      return <></>
    }
  }

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: contentString }} />
    {promptButton()}
    </>
  )
}
