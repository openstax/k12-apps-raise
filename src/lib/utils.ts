const loadMathJax = async (): Promise<void> => {
  const maybeMoodleYUI = window.Y

  if (maybeMoodleYUI === undefined) {
    // TODO: Load MathJax manually to support things like preview outside of
    // Moodle
  } else {
    return await new Promise((resolve) => {
      maybeMoodleYUI.use('mathjax', () => {
        window.MathJax.Hub.Configured()
        resolve()
      })
    })
  }
}

export const mathifyElement = async (elem: Element): Promise<void> => {
  if (window.MathJax === undefined) {
    await loadMathJax()
  }
  window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, elem])
}
