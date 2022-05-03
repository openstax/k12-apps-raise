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
  const head = document.getElementsByTagName('head')[0]
  const maybeMathJaxScript = head.querySelector(`script[src="${MATHJAX_URL}"]`)
  let loadedPromise: Promise<void> | null = null

  // Check if the script is already populated
  if (maybeMathJaxScript === null) {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = MATHJAX_URL
    head.appendChild(script)

    loadedPromise = new Promise<void>((resolve) => {
      const configureCallback = (): void => {
        configureMathJax()
        resolve()
      }
      script.onload = configureCallback
    })
  } else {
    // Chain callbacks so we have something to await on
    const script = maybeMathJaxScript as HTMLScriptElement
    const oldOnloadCallback = script.onload as () => void

    loadedPromise = new Promise<void>((resolve) => {
      const chainedCallback = (): void => {
        if (oldOnloadCallback !== null) {
          oldOnloadCallback()
        } else {
          configureMathJax()
        }
        resolve()
      }

      script.onload = chainedCallback
    })
  }

  await loadedPromise
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
