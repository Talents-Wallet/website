const SUBSTACK_URL = 'https://talentswallet.substack.com/embed';

// The production embed is owned by Substack and can change independently of
// this repository. Replacing it during tests keeps screenshots deterministic;
// a separate assertion below still protects the real URL and iframe contract.
const SUBSTACK_FIXTURE = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      * { box-sizing: border-box; }
      html, body { width: 100%; height: 100%; }
      body { margin: 0; background: #fff; }
    </style>
  </head>
  <body data-testid="substack-fixture"></body>
</html>`;

export async function openLanding(page) {
  await page.route(SUBSTACK_URL, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/html; charset=utf-8',
      body: SUBSTACK_FIXTURE,
    }),
  );

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => document.fonts.ready);
  await page
    .frameLocator('.substack-embed')
    .locator('[data-testid="substack-fixture"]')
    .waitFor();
}

export async function inspectLayout(page, viewport) {
  return page.evaluate(({ width, height }) => {
    const violations = [];
    const tolerance = 1;

    const rectFor = (selector) => {
      const element = document.querySelector(selector);
      if (!element) {
        violations.push(`${selector} is missing`);
        return null;
      }

      const rect = element.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        violations.push(`${selector} has no rendered area`);
      }

      return rect;
    };

    const assertInsideViewport = (label, rect) => {
      if (!rect) return;
      if (rect.left < -tolerance || rect.right > innerWidth + tolerance) {
        violations.push(
          `${label} escapes horizontally: ${rect.left.toFixed(1)}..${rect.right.toFixed(1)} inside 0..${innerWidth}`,
        );
      }
    };

    const textRectFor = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const range = document.createRange();
      range.selectNodeContents(element);
      return range.getBoundingClientRect();
    };

    const pageWidth = Math.max(
      document.documentElement.scrollWidth,
      document.body.scrollWidth,
    );
    if (pageWidth > innerWidth + tolerance) {
      violations.push(`document width ${pageWidth}px exceeds viewport width ${innerWidth}px`);
    }

    const heading = rectFor('h1');
    const intro = rectFor('.product-lede');
    const phone = rectFor('.phone-frame');
    const signup = rectFor('.signup-lede');
    const signupShell = rectFor('.substack-embed-shell');

    assertInsideViewport('headline box', heading);
    assertInsideViewport('headline text', textRectFor('h1'));
    assertInsideViewport('product description', textRectFor('.product-lede'));
    assertInsideViewport('phone mockup', phone);
    assertInsideViewport('signup prompt', textRectFor('.signup-lede'));
    assertInsideViewport('signup shell', signupShell);

    if (width <= 900 && heading && intro && phone && signup) {
      const isMobileOrder =
        heading.top < intro.top && intro.top < phone.top && phone.top < signup.top;
      if (!isMobileOrder) {
        violations.push('single-column content is not headline → description → phone → signup');
      }

      const phoneHeightRatio = phone.height / height;
      if (phoneHeightRatio > 0.58) {
        violations.push(
          `phone mockup occupies ${(phoneHeightRatio * 100).toFixed(1)}% of viewport height; expected at most 58%`,
        );
      }

      const headingSize = Number.parseFloat(getComputedStyle(document.querySelector('h1')).fontSize);
      if (headingSize < 48 - tolerance || headingSize > 68 + tolerance) {
        violations.push(
          `single-column headline is ${headingSize.toFixed(1)}px; expected the 48px–68px responsive range`,
        );
      }
    }

    return violations.map((message) => `${width}×${height}: ${message}`);
  }, viewport);
}

export async function assertEmbedContract(page, expect) {
  const embed = page.locator('.substack-embed');
  await expect(embed).toHaveAttribute('src', SUBSTACK_URL);
  await expect(embed).toHaveAttribute(
    'title',
    'Subscribe to Talents Wallet updates on Substack',
  );
  await expect(embed).toHaveAttribute('sandbox', /allow-forms/);
}
