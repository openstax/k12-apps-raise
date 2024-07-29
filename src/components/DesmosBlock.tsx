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
  tables: string
}

export function DesmosBlock({ width, height, waitForEvent, equations, disableExpressions, scaleTop, scaleBottom, scaleLeft, scaleRight, tables }: DesmosBlockProps): JSX.Element {
  const equationsArray: string[] = JSON.parse(equations)
  const tablesArray = JSON.parse(tables) as Array<Array<{ variable: string, values: string[] }>>
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

    tablesArray.forEach((table) => {
      calculator.setExpression({
        type: 'table',
        columns: table.map((col) => {
          return { latex: col.variable, values: col.values }
        })
      })
    })

    equationsArray.forEach((str: string) => {
      calculator.setExpression({ latex: `${str}` })
    })

    calculator.setMathBounds({
      left: parseFloat(scaleLeft),
      right: parseFloat(scaleRight),
      bottom: parseFloat(scaleBottom),
      top: parseFloat(scaleTop)
    })

    // Set the default state explicitly to what was configured so users can
    // easily reset the graph equations and bounds in the rendered UI
    calculator.setDefaultState(calculator.getState())
  }
  return (
    <EventControlledContent waitForEvent={waitForEvent}>
      <div className="os-raise-bootstrap os-desmos">
        <div ref={contentRefCallback} className="mb-3"/>
      </div>
    </EventControlledContent>
  )
}
