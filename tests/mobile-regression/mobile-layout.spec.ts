import { test, expect, Page } from '@playwright/test';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Mobile layout regression tests.
 *
 * These tests reproduce the original broken mobile layouts / modals that were
 * fixed in commits 0832d37 and bfd32dc ("UX polish – mobile fixes"). Each
 * fixture supports two modes via a `?broken=1` query parameter:
 *
 *   - default (fixed)   – the current, shipped markup
 *   - `?broken=1`       – the pre-fix markup that reproduces the bug
 *
 * Every regression test therefore:
 *   1. loads the fixture with `?broken=1` and asserts that the original bug
 *      still occurs (i.e. the test truly reproduces the broken layout on
 *      a mobile device), and
 *   2. loads the fixture without the flag and asserts that the fix prevents
 *      the bug (i.e. the shipped fix actually works).
 *
 * All tests run against the Pixel 5 mobile viewport configured in
 * `playwright.config.ts` and use the production-built stylesheet from
 * `dist/assets/index-*.css` so they exercise exactly what ships to users.
 */

const distAssets = path.resolve(__dirname, '../../dist/assets');

function resolveBuiltCss(): string {
  const cssFile = readdirSync(distAssets).find((f) => f.endsWith('.css'));
  if (!cssFile) {
    throw new Error(
      `Could not find a compiled CSS bundle in ${distAssets}. `
        + 'Run `npx vite build` before executing the regression tests.',
    );
  }
  return path.join(distAssets, cssFile);
}

function fixtureUrl(name: string, broken = false): string {
  const fixturePath = path.resolve(__dirname, 'fixtures', name);
  const url = new URL(`file://${fixturePath}`);
  if (broken) {
    url.searchParams.set('broken', '1');
  }
  return url.toString();
}

async function openFixture(page: Page, name: string, broken = false): Promise<void> {
  await page.goto(fixtureUrl(name, broken));
  await page.addStyleTag({ path: resolveBuiltCss() });
  // Wait one frame so responsive Tailwind utilities apply before assertions.
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => resolve(null))));
}

test.describe('Mobile layout regressions (fixed in 0832d37 / bfd32dc)', () => {
  test.describe('Customers list – no horizontal page scroll on mobile', () => {
    test('pre-fix markup reproduces the horizontal overflow bug', async ({ page }) => {
      await openFixture(page, 'customers-list.html', true);

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      // Pre-fix: the wide desktop table renders on mobile and the main
      // content wrapper is missing `overflow-x-hidden`, so the page
      // horizontally overflows the viewport.
      expect(
        overflow.scrollWidth,
        'pre-fix markup should cause horizontal page overflow on mobile',
      ).toBeGreaterThan(overflow.clientWidth);
    });

    test('fix prevents horizontal page scroll on mobile', async ({ page }) => {
      await openFixture(page, 'customers-list.html', false);

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      expect(
        overflow.scrollWidth,
        'fixed markup must not overflow the mobile viewport horizontally',
      ).toBeLessThanOrEqual(overflow.clientWidth);
    });

    test('fix renders mobile card view and hides the desktop table on mobile', async ({ page }) => {
      await openFixture(page, 'customers-list.html', false);

      await expect(
        page.locator('#mobile-cards'),
        'mobile card list should be visible on narrow viewports',
      ).toBeVisible();

      await expect(
        page.locator('#desktop-table-wrapper'),
        'desktop table must be hidden on narrow viewports',
      ).toBeHidden();
    });
  });

  test.describe('Add-customer modal – fits inside mobile viewport', () => {
    test('pre-fix markup reproduces the "modal flush against viewport edges" bug', async ({ page }) => {
      await openFixture(page, 'add-customer-modal.html', true);

      const viewport = page.viewportSize()!;
      const dialogBox = await page.locator('#modal-dialog').boundingBox();
      expect(dialogBox).not.toBeNull();

      // Pre-fix: with the `p-4` padding dropped, the dialog spans the full
      // viewport width with zero horizontal gutter on a phone.
      expect(
        dialogBox!.x,
        'pre-fix modal should be flush against the left viewport edge',
      ).toBeLessThanOrEqual(1);
      expect(
        dialogBox!.x + dialogBox!.width,
        'pre-fix modal should be flush against the right viewport edge',
      ).toBeGreaterThanOrEqual(viewport.width - 1);
    });

    test('fix keeps the modal within the viewport and applies edge padding', async ({ page }) => {
      await openFixture(page, 'add-customer-modal.html', false);

      const viewport = page.viewportSize()!;
      const dialogBox = await page.locator('#modal-dialog').boundingBox();
      expect(dialogBox).not.toBeNull();

      expect(
        dialogBox!.x,
        'fixed modal must have horizontal gutter from the left viewport edge',
      ).toBeGreaterThan(0);
      expect(
        dialogBox!.x + dialogBox!.width,
        'fixed modal must have horizontal gutter from the right viewport edge',
      ).toBeLessThan(viewport.width);
    });

    test('pre-fix markup reproduces the "modal taller than screen" bug', async ({ page }) => {
      await openFixture(page, 'add-customer-modal.html', true);

      const viewport = page.viewportSize()!;
      const dialogBox = await page.locator('#modal-dialog').boundingBox();
      expect(dialogBox).not.toBeNull();

      // Pre-fix: without `max-h-[90vh] overflow-y-auto`, the long form
      // expands the dialog beyond the viewport height so the submit
      // button at the bottom is unreachable on a phone.
      expect(
        dialogBox!.height,
        'pre-fix dialog should be taller than the mobile viewport',
      ).toBeGreaterThan(viewport.height);

      const submitInViewport = await page.locator('#modal-submit').evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
      });
      expect(
        submitInViewport,
        'pre-fix submit button should be off-screen on mobile',
      ).toBe(false);
    });

    test('fix caps the dialog at 90vh and keeps the submit button reachable via scroll', async ({ page }) => {
      await openFixture(page, 'add-customer-modal.html', false);

      const viewport = page.viewportSize()!;
      const dialogBox = await page.locator('#modal-dialog').boundingBox();
      expect(dialogBox).not.toBeNull();

      expect(
        dialogBox!.height,
        'fixed dialog must not exceed 90vh',
      ).toBeLessThanOrEqual(Math.ceil(viewport.height * 0.9) + 1);

      const scrollInfo = await page.locator('#modal-dialog').evaluate((el) => ({
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
        overflowY: getComputedStyle(el).overflowY,
      }));
      expect(
        scrollInfo.scrollHeight,
        'dialog content must actually be scrollable (tall form inside)',
      ).toBeGreaterThan(scrollInfo.clientHeight);
      expect(
        ['auto', 'scroll'],
        'dialog must scroll its own overflow on mobile',
      ).toContain(scrollInfo.overflowY);
    });
  });

  test.describe('Header – full-screen mobile search overlay', () => {
    test('pre-fix markup: tapping the search icon does not open a full-screen overlay', async ({ page }) => {
      await openFixture(page, 'header-search.html', true);

      await page.locator('#mobile-search-btn').click();

      // Pre-fix: no overlay is rendered at all, so no fixed fullscreen
      // search input is visible.
      await expect(page.locator('#mobile-search-overlay')).toHaveCount(0);
    });

    test('fix: tapping the search icon opens a full-screen overlay that covers the viewport', async ({ page }) => {
      await openFixture(page, 'header-search.html', false);

      await page.locator('#mobile-search-btn').click();

      const overlay = page.locator('#mobile-search-overlay');
      await expect(overlay).toBeVisible();

      const viewport = page.viewportSize()!;
      const box = await overlay.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x, 'overlay must start at x=0').toBeLessThanOrEqual(0);
      expect(box!.y, 'overlay must start at y=0').toBeLessThanOrEqual(0);
      expect(box!.width, 'overlay must span the full viewport width').toBeGreaterThanOrEqual(viewport.width);
      expect(box!.height, 'overlay must span the full viewport height').toBeGreaterThanOrEqual(viewport.height);

      // The overlay's input must be focusable so the user can actually type.
      await expect(page.locator('#mobile-search-input')).toBeFocused();
    });
  });

  test.describe('Settings tabs – horizontal scroll with hidden scrollbar on mobile', () => {
    test('fix renders tabs as a horizontal scrollable row on mobile', async ({ page }) => {
      await openFixture(page, 'settings-tabs.html', false);

      const flexDirection = await page
        .locator('#tabs-nav')
        .evaluate((el) => getComputedStyle(el).flexDirection);
      expect(
        flexDirection,
        'tabs must lay out horizontally on mobile (flex-row)',
      ).toBe('row');

      const scrollInfo = await page.locator('#tabs-nav').evaluate((el) => ({
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
      }));
      expect(
        scrollInfo.scrollWidth,
        'tabs content must overflow horizontally so the nav is scrollable',
      ).toBeGreaterThan(scrollInfo.clientWidth);
    });

    test('fix applies .scrollbar-hide so the horizontal nav scrollbar is invisible', async ({ page }) => {
      await openFixture(page, 'settings-tabs.html', false);

      const scrollbarStyles = await page.locator('#tabs-nav').evaluate((el) => {
        const cs = getComputedStyle(el);
        return {
          scrollbarWidth: cs.scrollbarWidth,
          msOverflowStyle: (cs as unknown as Record<string, string>).msOverflowStyle,
        };
      });
      expect(
        scrollbarStyles.scrollbarWidth,
        '.scrollbar-hide must set scrollbar-width: none on the nav',
      ).toBe('none');
    });

    test('pre-fix markup leaves the scrollbar visible (scrollbar-width is not "none")', async ({ page }) => {
      await openFixture(page, 'settings-tabs.html', true);

      const scrollbarWidth = await page
        .locator('#tabs-nav')
        .evaluate((el) => getComputedStyle(el).scrollbarWidth);

      expect(
        scrollbarWidth,
        'pre-fix nav should not have the scrollbar-hide class applied',
      ).not.toBe('none');
    });

    test('fix replaces the desktop right border with a bottom border on mobile', async ({ page }) => {
      await openFixture(page, 'settings-tabs.html', false);

      const borders = await page.locator('#tabs-container').evaluate((el) => {
        const cs = getComputedStyle(el);
        return {
          right: cs.borderRightWidth,
          bottom: cs.borderBottomWidth,
        };
      });

      // On mobile (Pixel 5) only the bottom border should render.
      expect(
        parseFloat(borders.bottom),
        'mobile tabs container must have a visible bottom border',
      ).toBeGreaterThan(0);
      expect(
        parseFloat(borders.right),
        'mobile tabs container must not have a stray right border',
      ).toBe(0);
    });
  });
});
