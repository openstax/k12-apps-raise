export const loadScriptTag = async (srcValue: string): Promise<void> => {
  const head = document.getElementsByTagName('head')[0]
  const maybeExistingScript = head.querySelector(`script[src="${srcValue}"]`)
  let loadedPromise: Promise<void> | null = null

  // Check if the script is already populated
  if (maybeExistingScript === null) {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = srcValue
    head.appendChild(script)

    loadedPromise = new Promise<void>((resolve) => {
      script.onload = () => {
        resolve()
      }
    })
  } else {
    // Chain callbacks so we have something to await on
    const script = maybeExistingScript as HTMLScriptElement
    const oldOnloadCallback = script.onload as () => void

    loadedPromise = new Promise<void>((resolve) => {
      const chainedCallback = (): void => {
        if (oldOnloadCallback !== null) {
          oldOnloadCallback()
        }
        resolve()
      }

      script.onload = chainedCallback
    })
  }

  await loadedPromise
}
