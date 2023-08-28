import type { Page } from '@playwright/test'
import type { ContentResponse } from '../src/components/ContentLoader'

const TEST_CONTENT_URL_PREFIX = 'http://localhost:8800/contents'

const TOOLTIP_DATA = {
  'absolute value': 'The distance between a number and \\( 0 \\) on the number line',
  binomial: 'A polynomial with exactly two terms.',
  annuity: 'An investment that is a sequence of equal periodic deposits.'
}

const createContentJSON = (htmlContent: string): string => {
  const response: ContentResponse = {
    id: 'test',
    content: [{
      variant: 'main',
      html: htmlContent
    }]
  }

  return JSON.stringify(response)
}

export const mockPageContentRequest = async (page: Page, htmlContent: string): Promise<void> => {
  await page.route(
    `${TEST_CONTENT_URL_PREFIX}/*/test.json`,
    route => {
      route.fulfill({
        status: 200,
        body: createContentJSON(htmlContent)
      }).catch(() => {})
    }
  )

  await page.route(
    `${TEST_CONTENT_URL_PREFIX}/*/glossary-tooltip.json`,
    route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(TOOLTIP_DATA)
      }).catch(() => {})
    }
  )
}

const createVariantContentJSON = (mainContent: string, variantContent: string): string => {
  const response: ContentResponse = {
    id: 'test',
    content: [{
      variant: 'main',
      html: mainContent
    }, {
      variant: 'variant1',
      html: variantContent
    }]
  }

  return JSON.stringify(response)
}

export const mockVariantContentRequest = async (page: Page, mainContent: string, variantContent: string): Promise<void> => {
  await page.route(
    `${TEST_CONTENT_URL_PREFIX}/*/test.json`,
    route => {
      route.fulfill({
        status: 200,
        body: createVariantContentJSON(mainContent, variantContent)
      }).catch(() => {})
    }
  )
}
