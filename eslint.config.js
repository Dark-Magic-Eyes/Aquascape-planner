import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', '.tanstack', '*.gen.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettierConfig,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Allow shared/ui components to export constants (buttonVariants, etc.)
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  // Feature-based architecture enforcement for tank feature
  {
    files: ['src/features/tank/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../log/**', '../insight/**', '**/features/log/**', '**/features/insight/**'],
              message:
                '🚫 Tank feature cannot import from other features. Use shared/ for common code.',
            },
          ],
        },
      ],
    },
  },

  // Feature-based architecture enforcement for log feature
  {
    files: ['src/features/log/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '../tank/**',
                '../insight/**',
                '**/features/tank/**',
                '**/features/insight/**',
              ],
              message:
                '🚫 Log feature cannot import from other features. Use shared/ for common code.',
            },
          ],
        },
      ],
    },
  },

  // Feature-based architecture enforcement for insight feature
  {
    files: ['src/features/insight/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../tank/**', '../log/**', '**/features/tank/**', '**/features/log/**'],
              message:
                '🚫 Insight feature cannot import from other features. Use shared/ for common code.',
            },
          ],
        },
      ],
    },
  },

  // Shared cannot import from features
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/features/**'],
              message: '🚫 Shared code cannot depend on features.',
            },
          ],
        },
      ],
    },
  },
])
