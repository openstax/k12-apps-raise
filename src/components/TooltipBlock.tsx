import { Tooltip } from 'bootstrap'
import { useRef, useEffect } from 'react'

export interface TooltipBlockProperties {
  text: string
  tip: string
}

export const TooltipBlock = ({ text, tip }: TooltipBlockProperties): JSX.Element => {
  const anchorEl = useRef<HTMLAnchorElement>(null)
  const wrapperEl = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const maybeAnchor = anchorEl.current
    if (maybeAnchor === null) {
      return
    }
    Tooltip.getOrCreateInstance(maybeAnchor, { container: wrapperEl.current, html: true })
  }, [anchorEl, wrapperEl])
  return (
    <span ref={wrapperEl} className='os-raise-bootstrap'>
      <a href="#" ref={anchorEl} title={tip}>{text}</a>
    </span>
  )
}
