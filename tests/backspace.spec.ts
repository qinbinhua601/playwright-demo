import { test, expect, Locator } from '@playwright/test'
import { selectTextRe } from '../utils'

async function getEditorContent(page) {
  return await page.evaluate(() => {
    return window.view.state.doc.toString()
  })
}

test('select the beginning 123, then delete them by Backspace', async ({ page }) => {
  await page.goto('http://localhost:4000/')
  const editor = page.locator('.ProseMirror')
  const p = await page.locator('.ProseMirror p')
  // // const p = await page.getByText('123123@ qinbinhua');
  // const input = await page.locator('#qin-input');
  // input.selectText()
  await selectTextRe(p, '123')
  await page.waitForTimeout(1500)
  await editor.press('Backspace')
  const editorContent = await getEditorContent(page)
  expect(editorContent).toBe('doc(paragraph("123", strong(mention), "--------------------------------------------------------AAA"))')
})


test('select mention, delete by Backspace', async ({ page }) => {
  await page.goto('http://localhost:4000/')
  const editor = page.locator('.ProseMirror')
  await page.getByText('@ qinbinhua').click();
  await editor.press('Backspace')
  const editorContent = await getEditorContent(page)
  expect(editorContent).toBe('doc(paragraph("123123--------------------------------------------------------AAA"))')
})