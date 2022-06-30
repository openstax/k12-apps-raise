import { loadScriptTag } from './utils'
export const MATHJAX_URL = 'https://cdn.jsdelivr.net/npm/mathjax@2.7.9/MathJax.js?delayStartupUntil=configured'
const configureMathJax = (): void => {
  MathJax.Hub.Config({
    config: ['Accessible.js', 'Safe.js'],
    errorSettings: { message: ['!'] },
    skipStartupTypeset: true,
    messageStyle: 'none'
  })
  window.MathJax.Hub.processSectionDelay = 0
  MathJax.Hub.Configured()
}

const loadMathJaxScript = async (): Promise<void> => {
  await loadScriptTag(MATHJAX_URL)
  configureMathJax()
}

export const loadMathJax = async (): Promise<boolean> => {
  const maybeMoodleYUI = window.Y

  if (maybeMoodleYUI === undefined) {
    await loadMathJaxScript()

    return true
  } else {
    await new Promise<void>((resolve) => {
      maybeMoodleYUI.use('mathjax', () => {
        window.MathJax.Hub.Configured()
        resolve()
      })
    })
    return true
  }
}

export const mathifyElement = (elem: Element): void => {
  const mathjaxLoaded = window.MathJax !== undefined
  const innerText = elem.textContent

  // Only try to mathify if content includes expected delimiters
  // including \( , $$ , or \[
  if (innerText === null || !/\\\(|\$\$|\\\[/.test(innerText)) {
    return
  }

  const queueMathJax = (elem: Element): void => {
    window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, elem])
  }

  if (!mathjaxLoaded) {
    loadMathJax().then(loadSuccess => {
      if (loadSuccess) {
        queueMathJax(elem)
      }
    }).catch(error => console.error(error))
  } else {
    queueMathJax(elem)
  }
}
