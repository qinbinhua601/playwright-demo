// @ts-check
import { test, expect } from '@playwright/test';
import { setCursorAfterRe,selectTextRe } from '../utils';
test('选中文本12312', async ({ page }) => {
  await page.goto('http://localhost:4000');

  // QIN: 原生选中
  const p = await page.locator('.ProseMirror p');
  await selectTextRe(p, '12312')

  const [from, to] = await page.evaluate(() => {
    return [view.state.selection.from, view.state.selection.to]
  })

  expect([from, to]).toEqual([1, 6])

  // 选中
  // const p = await page.locator('.ProseMirror p strong');
  // await p.click()

  // QIN: 用view选中选区
  // await page.evaluate(() => {
  //   // dom.focus();
  //   const { view, TextSelection } = window
  //   const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, 1, 7))
  //   view.dispatch(tr)
  //   console.log(view.state.selection.from, view.state.selection.to)
  //   view.focus()
  // })

  // QIN: NodeSelection
  // await page.evaluate(() => {
  // const { view, NodeSelection } = window
  // const tr = view.state.tr.setSelection(NodeSelection.create(view.state.doc, 7, 8))
  // view.dispatch(tr)
  // console.log(view.state.selection.from, view.state.selection.to)
  // view.focus()
  // })
});

test('选中mention节点, 判断是否是NodeSelection', async ({ page }) => {
  await page.goto('http://localhost:4000');

  // QIN: 选中mention节点
  const p = await page.locator('.ProseMirror p strong');
  await p.click()

  // QIN: NodeSelection
  const isNodeSelection = await page.evaluate(() => {
    return window.view.state.selection instanceof window.NodeSelection
  })

  expect(isNodeSelection).toBeTruthy()
});