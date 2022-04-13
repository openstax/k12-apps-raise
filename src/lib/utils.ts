export const loadMathJax = async (): Promise<boolean> => {
  const maybeMoodleYUI = window.Y

  if (maybeMoodleYUI === undefined) {
    // TODO: Load MathJax manually to support things like preview outside of
    // Moodle
    return false
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

export const mathifyElement = async (elem: Element): Promise<void> => {
  let mathjaxLoaded = window.MathJax !== undefined

  if (!mathjaxLoaded) {
    mathjaxLoaded = await loadMathJax()
  }

  if (mathjaxLoaded) {
    window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, elem])
  }
}
