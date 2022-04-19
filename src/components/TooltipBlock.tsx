import { Tooltip } from 'bootstrap'
import { useRef, useEffect } from 'react'
import { mathifyElement } from '../lib/math'
export interface TooltipBlockProperties {
  text: string
  tip: string
}

export const TooltipBlock = ({ text, tip }: TooltipBlockProperties): JSX.Element => {
  const anchorEl = useRef<HTMLAnchorElement>(null)
  const wrapperEl = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const maybeAnchor = anchorEl.current
    const maybeWrapper = wrapperEl.current
    if (maybeAnchor === null || maybeWrapper === null) {
      return
    }

    Tooltip.getOrCreateInstance(maybeAnchor, { container: maybeWrapper, html: true, popperConfig: { onFirstUpdate: () => { mathifyElement(maybeWrapper).catch((e) => {}) } } })
  }, [anchorEl, wrapperEl])
  return (
    <span ref={wrapperEl} className='os-raise-bootstrap'>
      <a href="#" ref={anchorEl} title={tip}>{text}</a>
    </span>
  )
}
