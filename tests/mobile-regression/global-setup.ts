import { execSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Ensures the production CSS bundle exists before the regression tests run.
 *
 * The mobile regression fixtures load `dist/assets/index-*.css` so the tests
 * exercise the same stylesheet that ships to users (Tailwind utilities +
 * the custom mobile fixes from `src/index.css`). If the bundle is missing or
 * stale we trigger a `vite build` with placeholder env vars – the build does
 * not need real Firebase credentials, it only needs the variables to be set.
 */
export default async function globalSetup(): Promise<void> {
  const distAssets = path.resolve(__dirname, '../../dist/assets');
  const hasCss = existsSync(distAssets)
    && readdirSync(distAssets).some((f) => f.endsWith('.css'));

  if (hasCss) {
    return;
  }

  // Minimal env so vite build doesn't fail on missing variables.
  const buildEnv = {
    ...process.env,
    VITE_FIREBASE_API_KEY: process.env.VITE_FIREBASE_API_KEY ?? 'test',
    VITE_FIREBASE_AUTH_DOMAIN: process.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'test.firebaseapp.com',
    VITE_FIREBASE_PROJECT_ID: process.env.VITE_FIREBASE_PROJECT_ID ?? 'test',
    VITE_FIREBASE_STORAGE_BUCKET: process.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'test.firebasestorage.app',
    VITE_FIREBASE_MESSAGING_SENDER_ID: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '123',
    VITE_FIREBASE_APP_ID: process.env.VITE_FIREBASE_APP_ID ?? '1:123:web:abc',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? 'test',
  };

  execSync('npx vite build', {
    cwd: path.resolve(__dirname, '../..'),
    stdio: 'inherit',
    env: buildEnv,
  });
}
