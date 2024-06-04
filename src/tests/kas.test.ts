import { parse, compare } from '@khanacademy/kas'
import { vi, test, expect } from 'vitest'

test('Test kas', async () => {
  const options = {
    simplify: false,
    form: true
  }

  const consideredEqual = [
    { expr1: 'x>4', expr2: '4<x' },
    { expr1: 'x\\le4', expr2: '4\\gex' },
    { expr1: 'x\\lt4', expr2: '4\\gtx' },
    { expr1: 'x\\gt4', expr2: '4\\ltx' },
    { expr1: '|-4|', expr2: '|4|' },
    { expr1: '\\sqrt[3]{27}', expr2: '\\sqrt[3]{27}' }
  ]
  // If the options simplify is true the nth root tests fail.
  consideredEqual.forEach((val) => {
    expect(compare(parse(val.expr1).expr, parse(val.expr2).expr, options).equal).toBe(true)
  })
})
