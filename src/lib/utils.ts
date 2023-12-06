import variantMappings from '../../data/variant-mappings.json'
import type { ContentVariant } from '../components/ContentLoader'
import * as contentVersions from '../../data/content-versions.json'

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

export const getCurrentContext = (): { courseId: number | undefined, location: Location } => {
  return {
    courseId: window.M?.cfg.courseId,
    location: window.location
  }
}

function getVariantMapping(host: string | undefined, courseId: number | undefined): string {
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

  const courseVariant = getVariantMapping(currentContext.location.host, currentContext.courseId)
  const defaultVariant = getVariantMapping(currentContext.location.host, undefined)

  // Try to find content for mapped variant and fall back to trying to find default variant
  const maybeMatch = variants.find(item => item.variant === courseVariant) ?? variants.find(item => item.variant === defaultVariant)

  return maybeMatch
}

export const getVersionId = (): string => {
  const { courseId, location } = getCurrentContext()
  const defaultVersionId = contentVersions.defaultVersion

  if (courseId === undefined) {
    // The context indicates we are not running in a Moodle course. Check for prefix override.
    const maybePrefixOverrides = (contentVersions as any).overrides[location.host]?.prefix

    if (maybePrefixOverrides === undefined) {
      return defaultVersionId
    }

    // We will use the first matching prefix if found
    for (const prefix in maybePrefixOverrides) {
      if (location.pathname.startsWith(prefix)) {
        return maybePrefixOverrides[prefix]
      }
    }

    // No matching prefix found
    return defaultVersionId
  }

  // The context indicates we are running in a Moodle course. Check for course override.
  const maybeCourseOverride = (contentVersions as any).overrides[location.host]?.course?.[courseId]

  return maybeCourseOverride ?? defaultVersionId
}
