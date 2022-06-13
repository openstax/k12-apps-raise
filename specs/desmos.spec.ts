import { test, expect } from '@playwright/test'
import { mockPageContentRequest } from './utils'
import { DESMOS_URL } from '../src/lib/desmos'

test('Desmos script loads and displays graph without expressions panel', async ({ page }) => {
  const htmlDesmosContent = '<div class="os-raise-ib-desmos" data-expressions="false" data-width="600" data-top="50" data-bottom="-50" data-left="-50" data-right="50" data-height="500" data-equations=\'["(1,2)", "x=5"]\'></div>'
  await mockPageContentRequest(page, htmlDesmosContent)
  await page.goto('/')
  expect(await page.locator(`script[src="${DESMOS_URL}"]`).count()).toBe(1)
  await page.waitForSelector('.dcg-grapher')
})
test('Desmos has equations and shows all in expressions panel.', async ({ page }) => {
  const htmlDesmosContent = '<div class="os-raise-ib-desmos" data-expressions="true" data-width="600" data-top="50" data-bottom="-50" data-left="-50" data-right="50" data-height="500" data-equations=\'["(1,2)", "x=5"]\'></div>'
  await mockPageContentRequest(page, htmlDesmosContent)
  await page.goto('/')
  await page.waitForSelector('.dcg-grapher')
  await page.waitForSelector('text=x=5')
  await page.waitForSelector('text=(1,2)')
})
