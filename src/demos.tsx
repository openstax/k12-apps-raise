import React, { useState, CSSProperties } from 'react'
import { Property } from 'csstype'
import { createRoot } from 'react-dom/client'
import { Formik, Field, Form, FormikHelpers } from 'formik'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

interface ProblemProps {
  problem: string
  solution: number
}

interface Values {
  response: string
}

const InteractiveProblem = ({ problem, solution }: ProblemProps): JSX.Element => {
  const [answeredCorrect, setAnsweredCorrect] = useState(false)
  const [feedback, setFeedback] = useState('')

  const handleSubmit = async (values: Values, actions: FormikHelpers<Values>): Promise<void> => {
    if (parseInt(values.response) === solution) {
      setAnsweredCorrect(true)
      setFeedback('Great job!')
    } else {
      setFeedback('Try again!')
    }
  }

  return (
    <div className="container-fluid os-raise-bootstrap">
      <div className="row mb-3 align-items-center">
        <div className="col-1" >
          {problem}
        </div>
        <div className="col">
          <Formik
            initialValues={{
              response: ''
            }}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="d-flex align-items-center">
                  <Field id="response" size="10" name="response" className="os-form-control" placeholder="x=" disabled={isSubmitting || answeredCorrect} />
                  <button type="submit" className="mx-2 btn btn-outline-primary" disabled={isSubmitting || answeredCorrect}>Check</button>
                  <div className={answeredCorrect ? 'mx-3 text-success' : 'mx-3 text-primary'} >{feedback}</div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export const inputInteractiveDemo = (): void => {
  if (document.querySelector('.os-problems') === null) {
    return
  }
  const problems = document.querySelector('.os-problems') as HTMLElement
  problems.querySelectorAll('.os-problem-equation').forEach((elem: Element): void => {
    const htmlElem = elem as HTMLElement
    const solution = parseInt(htmlElem.dataset.solution as string)
    const problem = htmlElem.innerText
    htmlElem.removeAttribute('data-solution')

    createRoot(htmlElem).render(
      <React.StrictMode>
        <InteractiveProblem problem={problem} solution={solution} />
      </React.StrictMode>
    )
  })
}

const draggableType = 'OS-DND-DRAGGABLE'

interface DropBoxProps {
  innerHTML: string
  matches: string
}

interface DraggableProps {
  innerHTML: string
  label: string
}

interface DraggableItem {
  label: string
  innerHTML: string
}

const DropBox = ({ matches, innerHTML }: DropBoxProps): JSX.Element => {
  const [isMatched, setIsMatched] = useState(false)

  const [{ isOver, isCorrect }, drop] = useDrop(() => ({
    accept: draggableType,
    canDrop: (item: DraggableItem, monitor): boolean => {
      return item.label === matches
    },
    drop: (item: DraggableItem, monitor) => {
      setIsMatched(true)
    },
    collect: monitor => {
      return {
        isOver: monitor.isOver(),
        isCorrect: monitor.canDrop()
      }
    }
  }))

  const componentStyling: CSSProperties = {
    height: '100px',
    width: '100px',
    borderWidth: '10px',
    color: 'green'
  }

  if (isOver) {
    if (isCorrect) {
      componentStyling.border = '4px solid lightgreen'
    } else {
      componentStyling.border = '4px solid red'
    }
  }

  if (isMatched) {
    componentStyling.backgroundColor = 'rgb(0 0 0 / 30%)'
    componentStyling.backgroundBlendMode = 'overlay'
  }

  return (
    <div
      className='my-4 d-flex align-items-center justify-content-center'
      style={componentStyling}
      ref={drop}
    >
      <div dangerouslySetInnerHTML={{ __html: innerHTML }} />
      {/* <div className='font-weight-bold'>{isMatched ? 'CORRECT!' : ''}</div> */}
    </div>
  )
}

const Draggable = ({ innerHTML, label }: DraggableProps): JSX.Element => {
  const [isMatched, setIsMatched] = useState(false)
  const [{ isDragging }, drag] = useDrag(() => ({
    type: draggableType,
    item: {
      label: label,
      innerHTML: innerHTML
    },
    canDrag: (monitor): boolean => {
      const draggable = !isMatched
      return draggable
    },
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        setIsMatched(true)
      }
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  }), [isMatched])

  const visibility = isMatched ? 'hidden' : 'visible'

  const componentStyling = {
    visibility: visibility as Property.Visibility,
    height: '100px',
    width: '100px',
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div
      className='my-4 d-flex align-items-center justify-content-center border border-primary'
      style={componentStyling}
      ref={drag}
    >
      <div dangerouslySetInnerHTML={{ __html: innerHTML }} />
    </div>
  )
}

export const dndInteractiveDemo = (): void => {
  const maybeDndDemo = document.querySelector('.os-dnd-demo') as HTMLElement
  if (maybeDndDemo === null) {
    return
  }

  const draggableElems = maybeDndDemo.querySelectorAll('.os-dnd-draggable')
  const draggableComponents: Array<{ label: string, innerHTML: string }> = []
  draggableElems.forEach(elem => {
    const htmlElem = elem as HTMLElement
    draggableComponents.push({
      label: htmlElem.dataset.label as string,
      innerHTML: htmlElem.innerHTML
    }
    )
  })

  const targetElems = maybeDndDemo.querySelectorAll('.os-dnd-target')
  const targetComponents: Array<{ matchingLabel: string, innerHTML: string }> = []
  targetElems.forEach(elem => {
    const htmlElem = elem as HTMLElement
    targetComponents.push({
      matchingLabel: htmlElem.dataset.matchingLabel as string,
      innerHTML: htmlElem.innerHTML
    })
  })

  createRoot(maybeDndDemo).render(
    <React.StrictMode>
      <DndProvider backend={HTML5Backend}>
        <div className='d-flex mx-auto my-4 osx-raise-bootstrap' style={{ maxWidth: '800px' }}>
          <div className='mr-auto'>
            {draggableComponents.map(item => {
              return (
                <Draggable innerHTML={item.innerHTML} label={item.label}></Draggable>
              )
            })}
          </div>
          <div>
            {targetComponents.map(item => {
              return (
                <DropBox innerHTML={item.innerHTML} matches={item.matchingLabel}></DropBox>
              )
            })

            }
          </div>
        </div>
      </DndProvider>
    </React.StrictMode>
  )
}
