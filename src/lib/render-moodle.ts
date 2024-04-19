import { createRoot } from 'react-dom/client'
import {
  OS_RAISE_IB_CONTENT_CLASS,
  OS_RAISE_IB_CTA_CLASS,
  OS_RAISE_IB_INPUT_CLASS,
  OS_RAISE_IB_PSET_CLASS,
  OS_RAISE_IB_DESMOS_CLASS,
  OS_RAISE_SEARCH_CLASS,
  parseContentOnlyBlock,
  parseCTABlock,
  parseUserInputBlock,
  parseProblemSetBlock,
  parseDesmosBlock,
  parseSearchBlock
} from './blocks'

const replaceElementWithBlock = (element: HTMLElement, component: JSX.Element): void => {
  element.innerHTML = ''

  createRoot(element).render(
    component
  )
}

const patchMoodleMathJaxFilterBreakage = (element: HTMLElement): void => {
  // k12-189: This incredibly horrific function is a hacked together work around
  // for buggy behavior in Moodle's MathJax filter plugin implementation where
  // it ends up breaking data attributes in pset problem definitions that may
  // have MathJax math (e.g. multiplechoice and multiselect options). This
  // patching is only exercised on code paths where content is stored in Moodle
  // versus loaded via ContentLoader. It should be removed when we no longer
  // require supporting content preview with Moodle storage.

  const patchContent = (content: string): string => {
    let result = content

    result = result.replaceAll('<span class="nolink">', '')
    result = result.replaceAll('<span class=" nolink"="">', '')
    result = result.replaceAll('</span>', '')
    result = result.replaceAll('&gt;', '>')
    result = result.replaceAll('"[', "'[")
    result = result.replaceAll(']"', "]'")

    return result
  }

  // The way HTML gets broken by the filter transformation causes the content
  // to not be properly parsed, so we have to resort to modifying things as a
  // string
  const originalContent = element.innerHTML
  const patchedContentLines: string[] = []

  // There are potential corner cases where this may not work or may have
  // unintended side effects, but to try and limit the scope of impact we
  // iterate through each line of the string and only try to "patch" those that
  // have data-solution (which includes data-solution-options)

  originalContent.split('\n').forEach((contentLine) => {
    if (contentLine.includes('data-solution')) {
      patchedContentLines.push(patchContent(contentLine))
    } else {
      patchedContentLines.push(contentLine)
    }
  })

  const patchedContent = patchedContentLines.join('\n')

  element.innerHTML = patchedContent
}

const renderContentBlocksByClass = (element: HTMLElement, contentClass: string, parser: (element: HTMLElement) => JSX.Element | null): void => {
  const contentItems = element.querySelectorAll(`.${contentClass}`)

  contentItems.forEach(elem => {
    const htmlElem = elem as HTMLElement

    // Special case moodle storage patching for PSET blocks only
    if (contentClass === OS_RAISE_IB_PSET_CLASS) {
      patchMoodleMathJaxFilterBreakage(htmlElem)
    }
    const maybeContentOnlyBlock = parser(htmlElem)

    if (maybeContentOnlyBlock === null) {
      return
    }
    replaceElementWithBlock(htmlElem, maybeContentOnlyBlock)
  })
}

export const renderCTABlocks = (element: HTMLElement): void => {
  renderContentBlocksByClass(element, OS_RAISE_IB_CTA_CLASS, parseCTABlock)
}

export const renderContentOnlyBlocks = (element: HTMLElement): void => {
  renderContentBlocksByClass(element, OS_RAISE_IB_CONTENT_CLASS, parseContentOnlyBlock)
}

export const renderUserInputBlocks = (element: HTMLElement): void => {
  renderContentBlocksByClass(element, OS_RAISE_IB_INPUT_CLASS, parseUserInputBlock)
}

export const renderProblemSetBlocks = (element: HTMLElement): void => {
  renderContentBlocksByClass(element, OS_RAISE_IB_PSET_CLASS, parseProblemSetBlock)
}
export const renderDesmosBlocks = (element: HTMLElement): void => {
  renderContentBlocksByClass(element, OS_RAISE_IB_DESMOS_CLASS, parseDesmosBlock)
}

export const renderSearchBlocks = (element: HTMLElement): void => {
  renderContentBlocksByClass(element, OS_RAISE_SEARCH_CLASS, parseSearchBlock)
}
