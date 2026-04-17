import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for mobile layout regression tests.
 *
 * These tests reproduce the broken mobile/modal layouts that were fixed in
 * the recent CRM UX polish commits (0832d37 + bfd32dc) and verify the fixes
 * prevent regressions. They run against a Pixel 5 mobile viewport using the
 * production CSS build (dist/assets/index-*.css).
 */
export default defineConfig({
  testDir: './tests/mobile-regression',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  // Build the production CSS before running tests. The fixtures load
  // dist/assets/index-*.css to exercise the exact stylesheet shipped to users.
  globalSetup: './tests/mobile-regression/global-setup.ts',
});
