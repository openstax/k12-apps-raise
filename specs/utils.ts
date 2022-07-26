import { Page } from '@playwright/test'
import type { ContentResponse } from '../src/components/ContentLoader'

const TEST_CONTENT_URL_PREFIX = 'http://localhost:8800/contents'

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
  return await page.route(
    `${TEST_CONTENT_URL_PREFIX}/test.json`,
    route => {
      route.fulfill({
        status: 200,
        body: createContentJSON(htmlContent)
      }).catch(() => {})
    }
  )
}
