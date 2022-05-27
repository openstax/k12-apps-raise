import React, { useEffect, useRef } from 'react'
import { GraphingCalculator } from 'desmos'

import { EventControlledContent } from './EventControlledContent'

interface DesmosBlockProps {
  width: string
  height: string
  waitForEvent?: string
  equations: string
  expressions?: string
  scaleTop: string
  scaleBottom: string
  scaleLeft: string
  scaleRight: string
}
export function DesmosBlock({ width, height, waitForEvent, equations, expressions, scaleTop, scaleBottom, scaleLeft, scaleRight }: DesmosBlockProps): JSX.Element {
  const wrapperEl = useRef<HTMLDivElement | null>(null)
  const equationsArray: string[] = JSON.parse(equations)

  useEffect(() => {
    const maybeWrapper = wrapperEl.current
    if (maybeWrapper === null) {
      return
    }
    const options = { expressions: expressions?.toLocaleLowerCase().trim() === 'true' }
    maybeWrapper.style.width = `${width}px`
    maybeWrapper.style.height = `${height}px`
    const calculator = GraphingCalculator(maybeWrapper, options)
    console.log(scaleTop)

    equationsArray.forEach((str: string) => {
      calculator.setExpression({ latex: `${str}` })
    })
    calculator.setMathBounds({
      left: parseFloat(scaleLeft),
      right: parseFloat(scaleRight),
      bottom: parseFloat(scaleBottom),
      top: parseFloat(scaleTop)
    })
  }, [])

  return (
    <EventControlledContent waitForEvent={waitForEvent}>
      <div className="os-raise-bootstrap">
        <div ref={wrapperEl} />
      </div>
    </EventControlledContent>
  )
}
