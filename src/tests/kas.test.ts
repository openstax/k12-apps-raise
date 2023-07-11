import * as KAS from '@khanacademy/kas'

test('Test kas comparisons with no options', async () => {
  const consideredEqual = [
    { expr1: 'y=0.5x+2', expr2: 'y=\\frac{x}{2}+2' },
    { expr1: 'y=0.5x+2', expr2: '2y-x=4' },
    { expr1: 'y=0.5x+2', expr2: 'y=\\frac{x}{2}+2' },
    { expr1: 'y=(x+2)(x-3)', expr2: 'y=x^2-x-6' },
    { expr1: 'y=(x+2)(x-4)', expr2: 'y=(x-1)^2-9' }
  ]

  const consideredUnequal = [
    { expr1: 'y=0.5x+2', expr2: 'y=\\frac{x}{2}+3' }
  ]

  consideredEqual.forEach((val) => {
    expect(KAS.compare(KAS.parse(val.expr1).expr, KAS.parse(val.expr2).expr).equal).toBe(true)
  })

  consideredUnequal.forEach((val) => {
    expect(KAS.compare(KAS.parse(val.expr1).expr, KAS.parse(val.expr2).expr).equal).toBe(false)
  })
})

test('Test kas comparisons with form checking enabled', async () => {
  const options = {
    simplify: false,
    form: true
  }

  const consideredEqual = [
    { expr1: 'y=0.5x+2', expr2: 'y=0.5x+2' },
    { expr1: '2y-x=4', expr2: '2y-x=4' },
    { expr1: '2y-x=4', expr2: '2y-1x=4' },
    { expr1: 'y=\\frac{1}{2}x+2', expr2: 'y=\\frac{x}{2}+2' },
    { expr1: 'y=(x+2)(x-3)', expr2: 'y=(x+2)(x-3)' }
  ]

  const consideredUnequal = [
    { expr1: 'y=\\frac{1}{2}x+2', expr2: 'y=0.5x+2' },
    { expr1: 'y=\\frac{1}{2}x+2', expr2: 'y-\\frac{x}{2}=2' },
    { expr1: 'y=0.5x+2', expr2: '2y-x=4' },
    { expr1: '2y-2x=4', expr2: '2(y-x)=4' },
    { expr1: 'y=(x+2)(x-3)', expr2: 'y=x^2-x-6' },
    { expr1: 'y=(x+2)(x-4)', expr2: 'y=(x-1)^2-9' }
  ]

  consideredEqual.forEach((val) => {
    expect(KAS.compare(KAS.parse(val.expr1).expr, KAS.parse(val.expr2).expr, options).equal).toBe(true)
  })

  consideredUnequal.forEach((val) => {
    expect(KAS.compare(KAS.parse(val.expr1).expr, KAS.parse(val.expr2).expr, options).equal).toBe(false)
  })
})

test('Test kas comparisons with simplify checking enabled', async () => {
  const options = {
    simplify: true,
    form: false
  }

  const consideredEqual = [
    { expr1: 'y=0.5x+2', expr2: 'y=0.5x+2' },
    { expr1: '2y-x=4', expr2: '2y-x=4' },
    { expr1: '2y-x=4', expr2: '2y-1x=4' },
    { expr1: 'y=\\frac{1}{2}x+2', expr2: 'y=\\frac{x}{2}+2' },
    { expr1: 'y-x=2', expr2: '2(y-x)=4' },
    { expr1: 'y=0.5x+2', expr2: '2y-x=4' },
    { expr1: 'y=\\frac{1}{2}x+2', expr2: 'y-\\frac{x}{2}=2' },
    { expr1: 'y=\\frac{1}{2}x+2', expr2: 'y=0.5x+2' }
  ]

  const consideredUnequal = [
    { expr1: '2(y-x)=4', expr2: 'y-x=2' },
    { expr1: 'y=(x+2)(x-3)', expr2: 'y=(x+2)(x-3)' }
  ]

  consideredEqual.forEach((val) => {
    expect(KAS.compare(KAS.parse(val.expr1).expr, KAS.parse(val.expr2).expr, options).equal).toBe(true)
  })

  consideredUnequal.forEach((val) => {
    expect(KAS.compare(KAS.parse(val.expr1).expr, KAS.parse(val.expr2).expr, options).equal).toBe(false)
  })
})

test('Test kas comparisons with form and simplification enabled', async () => {
  const options = {
    simplify: true,
    form: true
  }

  const consideredEqual = [
    { expr1: 'y=0.5x+2', expr2: 'y=0.5x+2' },
    { expr1: '2y-x=4', expr2: '2y-x=4' },
    { expr1: '2y-x=4', expr2: '2y-1x=4' },
    { expr1: 'y=\\frac{1}{2}x+2', expr2: 'y=\\frac{x}{2}+2' }
  ]

  const consideredUnequal = [
    { expr1: 'y=\\frac{1}{2}x+2', expr2: 'y=0.5x+2' },
    { expr1: 'y=\\frac{1}{2}x+2', expr2: 'y-\\frac{x}{2}=2' },
    { expr1: 'y=0.5x+2', expr2: '2y-x=4' },
    { expr1: '2y-2x=4', expr2: '2(y-x)=4' },
    { expr1: 'y-x=2', expr2: 'y=x+2' },
    { expr1: 'y=(x+2)(x-3)', expr2: 'y=(x+2)(x-3)' }

  ]

  consideredEqual.forEach((val) => {
    expect(KAS.compare(KAS.parse(val.expr1).expr, KAS.parse(val.expr2).expr, options).equal).toBe(true)
  })

  consideredUnequal.forEach((val) => {
    expect(KAS.compare(KAS.parse(val.expr1).expr, KAS.parse(val.expr2).expr, options).equal).toBe(false)
  })
})
