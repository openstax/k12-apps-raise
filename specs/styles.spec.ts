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
  })).toBe('8px 16px')
  expect(await table.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('border')
  })).toBe('1px solid rgb(0, 0, 0)')
})

test('Indentation class indents content correctly', async ({ page }) => {
  const htmlContent = '<p class="os-raise-indent">Hello</p>'
  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  const elem = await page.waitForSelector('text=Hello')
  expect(await elem.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('padding-left')
  })).toBe('32px')
})

test('Un-Indentation class for ordered lists unindents content.', async ({ page }) => {
  const htmlContent = `
<ol class="os-raise-noindent">
  <li>First</li>
</ol>`
  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  const elem = await page.waitForSelector('text=First')
  expect(await elem.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('list-style-position')
  })).toBe('inside')
})

test('Graybox class styles content correctly', async ({ page }) => {
  const htmlContent = `
<div class="os-raise-graybox">Hello</div>`
  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  const elem = await page.waitForSelector('text=Hello')
  expect(await elem.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('border')
  })).toBe('1px solid rgb(217, 217, 217)')
  expect(await elem.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('padding')
  })).toBe('16px')
  expect(await elem.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('background-color')
  })).toBe('rgb(245, 245, 245)')
  expect(await elem.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('border-radius')
  })).toBe('5px')
})

test('Test flexbox style', async ({ page }) => {
  const htmlContent = `
<div class="os-raise-d-flex">
<p>P1</p>
<p>P2</p>
</div>`
  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  const elem = await page.waitForSelector('.os-raise-d-flex')
  expect(await elem.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('display')
  })).toBe('flex')

  expect(await elem.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('flex-wrap')
  })).toBe('wrap')
})

test('align items center', async ({ page }) => {
  const htmlContent = `
<div class="os-raise-d-flex os-raise-align-items-center">
<p>P1</p>
<p>P2</p>
</div>`
  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  const elem = await page.waitForSelector('.os-raise-d-flex')
  expect(await elem.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('align-items')
  })).toBe('center')
})

test('justify content center style test', async ({ page }) => {
  const htmlContent = `
<div class="os-raise-d-flex os-raise-justify-content-center">
<p>P1</p>
<p>P2</p>
</div>`
  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  const elem = await page.waitForSelector('.os-raise-d-flex')
  expect(await elem.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('justify-content')
  })).toBe('center')
})

test('justify content between', async ({ page }) => {
  const htmlContent = `
<div class="os-raise-d-flex os-raise-justify-content-between">
<p>P1</p>
<p>P2</p>
</div>`
  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  const elem = await page.waitForSelector('.os-raise-d-flex')
  expect(await elem.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('justify-content')
  })).toBe('space-between')
})

test('justify content evenly', async ({ page }) => {
  const htmlContent = `
<div class="os-raise-d-flex os-raise-justify-content-evenly">
<p>P1</p>
<p>P2</p>
</div>`
  await mockPageContentRequest(page, htmlContent)
  await page.goto('/')
  const elem = await page.waitForSelector('.os-raise-d-flex')
  expect(await elem.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('justify-content')
  })).toBe('space-evenly')
})
