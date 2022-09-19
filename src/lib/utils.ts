import * as variantMappings from '../../data/variant-mapping.json'
import type { ContentVariant } from '../components/ContentLoader'

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

export const getUserVariables = (): {userId: string, courseId: string, instance: string} | null => {
  const userId = '2'
  const courseId = window.M?.cfg.courseId
  const instance = window.location.host
  if (userId === undefined || courseId === undefined || instance === undefined) {
    return null
  }
  return {
    userId,
    courseId,
    instance
  }
}

function getVariantMappings(host: string, courseid: string): string {
  const mappingData = variantMappings as any
  const maybeDataMapping = mappingData.default[host]?.courses[courseid]
  if (maybeDataMapping !== undefined) {
    return maybeDataMapping
  } else {
    return 'main'
  }
}

export const getVariant = (variants: ContentVariant[]): string => {
  const userValues = getUserVariables()
  let varName = 'main'
  if (userValues != null) {
    varName = getVariantMappings(userValues.instance, userValues.courseId)
    console.log('VarName: ' + varName)
  }

  let html
  variants.forEach(item => {
    if (item.variant === varName) {
      html = item.html
    }
  })
  if (html === undefined) {
    html = variants[0].html // return whatever variant exists
  }
  return html
}
