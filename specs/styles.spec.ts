import { test, expect } from '@playwright/test'
import { mockPageContentRequest } from './utils'

test('Table using os-raise-standardtable has border and padding style', async ({ page }) => {
  const htmlContent = `
    <table class="os-raise-standardtable">
    <tr>
      <th>Company</th>
      <th>Contact</th>
      <th>Country</th>
    </tr>
    <tr>
      <td>Alfreds Futterkiste</td>
      <td>Maria Anders</td>
      <td>Germany</td>
    </tr>
    <tr>
      <td>Centro comercial Moctezuma</td>
      <td>Francisco Chang</td>
      <td>Mexico</td>
    </tr>
  </table>
    `
  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')

  const table = await page.waitForSelector('text=Company')
  expect(await table.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('padding')
  })).toBe('5px')
  expect(await table.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('border')
  })).toBe('1px solid rgb(0, 0, 0)')
})
