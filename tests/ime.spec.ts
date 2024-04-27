// @ts-check
import { test, expect } from '@playwright/test';
async function getEditorContent(page) {
  return await page.evaluate(() => {
    return window.view.state.doc.toString()
  })
}

async function inputNiByIME(page) {
  const client = await page.context().newCDPSession(page);

  // 打n -> n
  await client.send('Input.imeSetComposition', {
    selectionStart: 1,
    selectionEnd: 1,
    text: 'n',
  });
  await page.evaluate(() => {
    const { view, TextSelection } = window
    console.log(view.state.doc.toString())
  });
  // 打i -> ni
  await client.send('Input.imeSetComposition', {
    selectionStart: 2,
    selectionEnd: 2,
    text: 'ni',
  });
  await page.evaluate(() => {
    const { view, TextSelection } = window
    console.log(view.state.doc.toString())
  });
  // 选字 -> 你
  await client.send('Input.imeSetComposition', {
    selectionStart: 1,
    selectionEnd: 1,
    text: '你',
  });
  await page.evaluate(() => {
    const { view, TextSelection } = window
    console.log(view.state.doc.toString())
  });
  // 空格录入 -> 你
  await client.send('Input.insertText', {
    text: '你',
  });
  await page.evaluate(() => {
    const { view, TextSelection } = window
    console.log(view.state.doc.toString())
  });
}

// 利用cdp的method来测试IME：
// https://chromedevtools.github.io/devtools-protocol/tot/Input/#method-imeSetComposition

test('打字你(ni)，未修复，结果 -> 你n', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium');
  await page.goto('http://localhost:4000');
  // QIN: 在mention之后的位置打字ni -> 你
  await page.evaluate(() => {
    const { view, TextSelection } = window
    const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, 8))
    view.dispatch(tr)
    console.log(view.state.selection.from, view.state.selection.to)
    view.focus()
  })
  await inputNiByIME(page)
  const editorContent = await getEditorContent(page)
  expect(editorContent).toBe('doc(paragraph("123123", strong(mention), "你n--------------------------------------------------------AAA"))')
});

test('打字你(ni)，修复，结果: 你', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium');
  await page.goto('http://localhost:4000/?fixChromeCompositionSolution1=1');
  await page.evaluate(() => {
    const { view, TextSelection } = window
    // const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, 1, 7))
    const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, 8))
    view.dispatch(tr)
    console.log(view.state.selection.from, view.state.selection.to)
    view.focus() 
  })
  await inputNiByIME(page)
  const editorContent = await getEditorContent(page)
  expect(editorContent).toBe('doc(paragraph("123123", strong(mention), "你--------------------------------------------------------AAA"))')
});