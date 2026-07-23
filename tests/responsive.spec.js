import { expect, test } from '@playwright/test';
import {
  CROSS_BROWSER_VIEWPORTS,
  HEIGHT_PROFILES,
  WIDTH_RANGES,
  sweepWidths,
} from './responsive-dimensions.js';
import { assertEmbedContract, inspectLayout, openLanding } from './test-helpers.js';

test('private-money heading and metadata are consistent', async ({ page }) => {
  await openLanding(page);

  await expect(page.locator('h1 > span')).toHaveText([
    'Talents.',
    'Private money',
    'made simple.',
  ]);

  // The tab and share titles stay on the bare brand name; only the in-page
  // headline carries the full positioning line.
  await expect(page).toHaveTitle('Talents');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    'Talents',
  );
});

test('social footer links to the official profiles', async ({ page }) => {
  await openLanding(page);

  const links = page.locator('.site-footer a');
  await expect(links).toHaveCount(2);

  const contract = [
    { label: 'Talents on X', href: 'https://x.com/TalentsWallet' },
    { label: 'Talents on GitHub', href: 'https://github.com/Talents-Wallet' },
  ];
  for (const [index, { label, href }] of contract.entries()) {
    const link = links.nth(index);
    await expect(link).toHaveAttribute('href', href);
    await expect(link).toHaveAttribute('aria-label', label);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener');
  }
});

test('dense width and height sweep has no layout violations @responsive-sweep', async ({
  page,
}, testInfo) => {
  test.setTimeout(120_000);
  await openLanding(page);

  const violations = [];
  for (const heightProfile of HEIGHT_PROFILES) {
    for (const width of sweepWidths()) {
      await page.setViewportSize({ width, height: heightProfile.height });
      const viewportViolations = await inspectLayout(page, {
        width,
        height: heightProfile.height,
      });

      const widthRange = WIDTH_RANGES.find(
        ({ from, to }) => width >= from && width <= to,
      );
      violations.push(
        ...viewportViolations.map(
          (message) =>
            `${message} [${widthRange?.label ?? 'critical edge'} width; ${heightProfile.label} height]`,
        ),
      );

      // Keep failure reports useful even if one CSS change causes widespread
      // damage across the sweep.
      if (violations.length >= 50) break;
    }
    if (violations.length >= 50) break;
  }

  testInfo.annotations.push({
    type: 'coverage',
    description:
      `${sweepWidths().length} widths across ${HEIGHT_PROFILES.length} height profiles; ` +
      'see tests/responsive-dimensions.js for represented devices and user groups.',
  });

  expect(violations, violations.join('\n')).toEqual([]);
});

for (const viewport of CROSS_BROWSER_VIEWPORTS) {
  test(`${viewport.id} layout contract @cross-browser`, async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'represents',
      description: viewport.represents,
    });

    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await openLanding(page);

    const violations = await inspectLayout(page, viewport);
    expect(violations, violations.join('\n')).toEqual([]);
    await assertEmbedContract(page, expect);
  });
}
