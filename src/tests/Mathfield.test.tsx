import { render, screen, fireEvent, act } from '@testing-library/react'
import { Mathfield } from '../components/Mathfield'
import '@testing-library/jest-dom'

test('InputProblem renders with content, input and button', async () => {
  render(
          <Mathfield
          className='class'
          disabled={false}
          onChange={() => { }}
        />
  )
  // find a way to check if component renders calculator and mathfield component after on focus.
  // could not figure out how to see calculator using react testing library.🤔
  // Alot of the heavy lifting for Mathfield tests can be done in Playwright.
})
