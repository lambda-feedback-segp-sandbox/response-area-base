// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import nextPlugin from '@next/eslint-plugin-next'
import reactPlugin from 'eslint-plugin-react'
import hooksPlugin from 'eslint-plugin-react-hooks'
import * as importPlugin from 'eslint-plugin-import'
// @ts-ignore-next-line
import { fixupPluginRules } from '@eslint/compat'

export default tseslint.config(
  {
    ignores: ['.next/', '.yarn/', 'pages/_error.js', 'out/', 'public/'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      react: reactPlugin,
      'react-hooks': fixupPluginRules(hooksPlugin),
      '@next/next': fixupPluginRules(nextPlugin),
      import: importPlugin,
    },
    // @ts-ignore-next-line
    rules: {
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...hooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      'import/order': [
        'warn',
        {
          groups: [
            ['external', 'builtin', 'internal'],
            'parent',
            'sibling',
            'index',
            'object',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unnecessary-type-constraint': 'off',
      'prefer-const': 'off',
      'no-var': 'off',
      'no-irregular-whitespace': 'off',
      '@typescript-eslint/ban-types': 'off',
      'no-extra-boolean-cast': 'off',
      'no-unsafe-optional-chaining': 'off',
      'no-empty': 'off',
      'no-undef': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      'no-empty-pattern': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-useless-escape': 'off',
    },
  },
  {
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@material-ui/core',
              message: 'no named import from material ui core',
            },
            {
              name: '@material-ui/lab',
              message: 'no named import from material ui lab',
            },
            {
              name: '@mui/material',
              message: 'no named import from mui material',
            },
            {
              name: '@mui/lab',
              message: 'no named import from mui lab',
            },
            {
              name: '@mui/system',
              message: 'no named import from mui system',
            },
          ],
        },
      ],
    },
  },
)
