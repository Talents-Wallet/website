import { expect, test } from '@playwright/test';
import { VISUAL_VIEWPORTS } from './responsive-dimensions.js';
import { openLanding } from './test-helpers.js';

for (const viewport of VISUAL_VIEWPORTS) {
  test(`${viewport.id} visual baseline @visual`, async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'represents',
      description: viewport.represents,
    });

    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await openLanding(page);

    await expect(page).toHaveScreenshot(`${viewport.id}.png`, {
      fullPage: true,
      // Substack owns the iframe's pixels and can change them without a commit
      // here. Mask its interior while retaining the shell's size and placement.
      mask: [page.locator('.substack-embed')],
      maskColor: '#ffffff',
    });
  });
}
