import React, { useState, useCallback } from 'react'
import { EventControlledContent } from './EventControlledContent'
import { loadDesmos } from '../lib/desmos'
interface DesmosBlockProps {
  width: string
  height: string
  waitForEvent?: string
  equations: string
  disableExpressions: boolean
  scaleTop: string
  scaleBottom: string
  scaleLeft: string
  scaleRight: string
  tables?: string
}

export function DesmosBlock({ width, height, waitForEvent, equations, disableExpressions, scaleTop, scaleBottom, scaleLeft, scaleRight, tables }: DesmosBlockProps): JSX.Element {
  const equationsArray: string[] = JSON.parse(equations)
  const tablesArray: string[] = JSON.parse(tables ?? '[]')
  const [desmosLoaded, setDesmosLoaded] = useState(false)

  const contentRefCallback = useCallback((node: HTMLDivElement | null): void => {
    if (node != null) {
      if (desmosLoaded) {
        renderCalculator(node)
        return
      }
      loadDesmos().then(() => { setDesmosLoaded(true) }).catch((err) => { console.error(err) })
    }
  }, [desmosLoaded])

  const renderCalculator = (calculatorWrapper: HTMLDivElement): void => {
    const options = { expressions: !disableExpressions }
    calculatorWrapper.style.width = `${width}px`
    calculatorWrapper.style.height = `${height}px`

    const calculator = Desmos.GraphingCalculator(calculatorWrapper, options)

    equationsArray.forEach((str: string) => {
      calculator.setExpression({ latex: `${str}` })
    })

    tablesArray.forEach((table: any) => {
      console.log(typeof table)
      calculator.setExpression({
        type: 'table',
        columns: table.map((str: { variable: string, values: string }) => {
          return { latex: str.variable, values: str.values }
        })
      })
    })

    calculator.setMathBounds({
      left: parseFloat(scaleLeft),
      right: parseFloat(scaleRight),
      bottom: parseFloat(scaleBottom),
      top: parseFloat(scaleTop)
    })
  }
  return (
    <EventControlledContent waitForEvent={waitForEvent}>
      <div className="os-raise-bootstrap">
        <div ref={contentRefCallback} className="mb-3"/>
      </div>
    </EventControlledContent>
  )
}
