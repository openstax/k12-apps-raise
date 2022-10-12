import { test, expect } from '@playwright/test'
import { mockVariantContentRequest, mockPageContentRequest } from './utils'

test('variant content is shown when course ID is switched to variant course', async ({ page }) => {
  const mainContent = '<p>Main content</p>'
  const variantContent = '<p>Variant content</p>'

  await mockVariantContentRequest(page, mainContent, variantContent)
  await page.addInitScript({ content: 'window.M = {cfg: {courseId: 2}} ' })
  await page.goto('/')
  await expect(page.locator('text=Variant content')).toBeVisible()

  await page.addInitScript({ content: 'window.M = {cfg: {courseId: 1}} ' })
  await page.goto('/')
  await expect(page.locator('text=Main content')).toBeVisible()
})

test('default content is shown when course has defined variant but no corresponding content', async ({ page }) => {
  const mainContent = '<p>Main content</p>'

  await mockPageContentRequest(page, mainContent)
  await page.addInitScript({ content: 'window.M = {cfg: {courseId: 2}} ' })
  await page.goto('/')
  await expect(page.locator('text=Main content')).toBeVisible()
})
