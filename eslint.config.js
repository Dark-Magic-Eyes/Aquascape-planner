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

  // 🔥 UNIVERSAL RULE: Any feature cannot import from other features
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              // Block any ../other-feature/** pattern
              group: ['../*/!(index).{ts,tsx}', '../*/**'],
              message:
                '🚫 Features cannot import from other features. Use @/shared/* for common code, or import via feature public API (index.ts).',
            },
            {
              // Block absolute imports to other features (except via index)
              group: ['**/features/*/!(index).{ts,tsx}', '**/features/*/**'],
              message:
                '🚫 Features cannot import from other features. Use @/shared/* for common code, or import via feature public API (index.ts).',
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
              group: ['**/features/**', '@/features/**'],
              message: '🚫 Shared code cannot depend on features.',
            },
          ],
        },
      ],
    },
  },

  // Routes: Only orchestration, no business logic
  {
    files: ['src/routes/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          // Prevent Zustand store creation in routes
          selector: 'CallExpression[callee.name="create"] > ArrowFunctionExpression',
          message: '🚫 Routes should not create stores. Move business logic to features/',
        },
        {
          // Prevent complex state logic in routes
          selector:
            'VariableDeclarator[init.callee.name="useState"] ~ VariableDeclarator[init.callee.name="useState"] ~ VariableDeclarator[init.callee.name="useState"]',
          message: '🚫 Too much state in route component. Extract to feature component.',
        },
      ],
    },
  },

  // Shared/UI: Only presentational components, no business logic
  {
    files: ['src/shared/ui/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['zustand', 'jotai', '@tanstack/react-query'],
              message:
                '🚫 Shared UI components should not use state management. Keep them pure/presentational.',
            },
          ],
        },
      ],
    },
  },
])
