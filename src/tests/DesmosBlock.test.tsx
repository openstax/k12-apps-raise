import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import { DesmosBlock } from '../components/DesmosBlock'

test('UserInputBlock renders with content, prompt, and form as textarea', async () => {
  render(
      <DesmosBlock width={'500'} height={'500'} equations={'[(1,1)]'} expressions={'true'} scaleTop={'10'} scaleBottom={'-10'} scaleLeft={'-10'} scaleRight={'10'} />
  )

  screen.getByText('(1,1)')
})
