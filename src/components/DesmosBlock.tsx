import React, { useEffect, useRef } from 'react'
import Desmos from 'desmos'

interface DesmosBlockProps {
  width: string
  height: string
}
export function DesmosBlock({ width, height }: DesmosBlockProps): JSX.Element {
  const wrapperEl = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const maybeWrapper = wrapperEl.current
    if (maybeWrapper === null) {
      return
    }
    maybeWrapper.style.width = '600px'
    maybeWrapper.style.height = '400px'
    const calculator = Desmos.GraphingCalculator(wrapperEl)
    calculator.setExpression({ id: 'graph1', latex: 'y=x^2' })
  }, [])

  return (
    <div className="os-raise-bootstrap">
      <div ref={wrapperEl}/>

    </div>
  )
}
