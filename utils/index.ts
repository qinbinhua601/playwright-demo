import type { Locator } from '@playwright/test';

/**
 * Select text range by RegExp.
 *
 * @param locator Element locator
 * @param pattern The pattern to match
 * @param flags RegExp flags
 */
export async function selectTextRe(locator: Locator, pattern: string | RegExp, flags?: string): Promise<void> {
  await locator.evaluate(
    (element, { pattern, flags }) => {
      const textNode = element.childNodes[0];
      const match = textNode.textContent?.match(new RegExp(pattern, flags));
      if (match) {
        const range = document.createRange();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        range.setStart(textNode, match.index!);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        range.setEnd(textNode, match.index! + match[0].length);
        const selection = document.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    },
    { pattern, flags }
  );
}

/**
 * Set cursor position after RegExp match.
 *
 * @param locator Element locator
 * @param pattern The pattern to match
 * @param flags RegExp flags
 */
export async function setCursorAfterRe(locator: Locator, pattern: string | RegExp, flags?: string): Promise<void> {
  await locator.evaluate(
    (element, { pattern, flags }) => {
      const textNode = element.childNodes[0];
      const match = textNode.textContent?.match(new RegExp(pattern, flags));
      if (match) {
        const selection = document.getSelection();
        selection?.removeAllRanges();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        selection?.setPosition(textNode, match.index! + match[0].length);
      }
    },
    { pattern, flags }
  );
}