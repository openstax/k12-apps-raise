import { render, screen } from '@testing-library/react'
import { CTABlock } from '../components/CTABlock'
import '@testing-library/jest-dom'

test('CTABlock renders', async () => {
  render(
    <div data-testid="cta-block">
      <CTABlock buttonText="Click me!"/>
    </div>
  )

  expect(screen.getByTestId('cta-block').querySelector('button')).not.toBeNull()
  expect(screen.getByTestId('cta-block')).toHaveTextContent('Click me!')
})
