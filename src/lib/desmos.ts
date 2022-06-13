
export const DESMOS_URL = 'https://www.desmos.com/api/v1.7/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6'
export const loadDesmos = async (callback: () => void): Promise<void> => {
  const existingScript = document.getElementById('Desmos')
  let loadedPromise: Promise<void> | null = null
  console.log('Script called from DesmosBlock')
  if (existingScript == null) {
    const script = document.createElement('script')
    script.src = DESMOS_URL
    script.id = 'Desmos'
    document.body.appendChild(script)
    loadedPromise = new Promise<void>(() => {
      script.onload = () => {
        if (callback != null) callback()
      }
    })
  } else {
    const script = existingScript
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
  if ((existingScript != null) && (callback != null)) {
    callback()
  }
}
