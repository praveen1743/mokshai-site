// ESLint for TypeScript, React (the homepage robot island) and Node scripts.
// .astro files are type-checked by `astro check` instead.
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default defineConfig(
  { ignores: ['dist/', '.vercel/', '.astro/', 'node_modules/', 'public/'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['src/components/robot/**/*.tsx'],
    plugins: { 'react-hooks': reactHooks },
    rules: { ...reactHooks.configs.recommended.rules },
  },
  {
    files: ['scripts/**/*.mjs', '*.config.{js,mjs,ts}', 'tests/**/*.ts'],
    languageOptions: { globals: globals.node },
  },
);
