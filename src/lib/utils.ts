import variantMappings from '../../data/variant-mappings.json'
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

export const getCurrentContext = (): { courseId: string | undefined, host: string | undefined } => {
  const courseId = window.M?.cfg.courseId
  const host = window.location.host
  return {
    courseId,
    host
  }
}

function getVariantMapping(host: string | undefined, courseId: string | undefined): string {
  const defaultVariant = 'main'
  if (courseId === undefined || host === undefined) {
    return defaultVariant
  }

  const mappingData = variantMappings as any
  const maybeDataMapping = mappingData[host]?.courses[courseId]
  if (maybeDataMapping !== undefined) {
    return maybeDataMapping
  }
  return defaultVariant
}

export const getVariant = (variants: ContentVariant[]): ContentVariant | undefined => {
  const currentContext = getCurrentContext()

  const courseVariant = getVariantMapping(currentContext.host, currentContext.courseId)
  const defaultVariant = getVariantMapping(currentContext.host, undefined)

  // Try to find content for mapped variant and fall back to trying to find default variant
  const maybeMatch = variants.find(item => item.variant === courseVariant) ?? variants.find(item => item.variant === defaultVariant)

  return maybeMatch
}

export const collectCourseID = (): number => {
  const courseID = window.M?.cfg.courseId
  if (courseID === undefined) {
    return -1
  }
  return parseInt(courseID)
}
