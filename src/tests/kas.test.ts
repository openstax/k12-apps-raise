import { parse, compare } from '@khanacademy/kas'
import { ComputeEngine } from '@cortex-js/compute-engine'

test('Test kas with compute engine and edge cases', async () => {
  const options = {
    simplify: false,
    form: true
  }
  const ce = new ComputeEngine()

  const consideredEqual = [
    { expr1: ce.serialize(ce.parse('\\frac42')), expr2: ce.serialize(ce.parse('\\frac{4}{2}')) },
    { expr1: 'x>4', expr2: '4<x' },
    { expr1: 'x\\le4', expr2: '4\\gex' },
    { expr1: '|-4|', expr2: '|4|' },
    { expr1: '\\sqrt[3]{27}', expr2: '\\sqrt[3]{27}' },
    { expr1: ce.serialize(ce.parse('y=\\frac{1}{2}x+2')), expr2: ce.serialize(ce.parse('y=\\frac{x}{2}+2')) }
  ]
  // If the options simplify is true the nth root tests fail.
  consideredEqual.forEach((val) => {
    expect(compare(parse(val.expr1).expr, parse(val.expr2).expr, options).equal).toBe(true)
  })
})
