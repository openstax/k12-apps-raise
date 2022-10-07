import { test, expect } from '@playwright/test'
import { mockVariantContentRequest } from './utils'

test('user input block is rendered with math and tooltip', async ({ page }) => {
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
