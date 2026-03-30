/**
 * ESLint — shared preset from @alawein/eslint-config (react-vite).
 */
import base from '@alawein/eslint-config/react-vite';
import globals from 'globals';

export default [
  ...base,
  {
    files: [
      '*.{js,mjs,cjs}',
      'config/**/*.{js,mjs,cjs,ts}',
      'scripts/**/*.{js,mjs,cjs,ts}',
      'tools/**/*.{js,mjs,cjs,ts}',
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.cjs', 'scripts/**/*.{js,cjs}', 'tools/**/*.{js,cjs}'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    ignores: [
      'dist/',
      'build/',
      '.next/',
      'node_modules/',
      'coverage/',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
    ],
  },
  {
    rules: {
      eqeqeq: 'warn',
      'jsx-a11y/anchor-has-content': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'jsx-a11y/no-noninteractive-tabindex': 'warn',
      'no-control-regex': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/img-redundant-alt': 'warn',
      'jsx-a11y/label-has-associated-control': 'warn',
      'jsx-a11y/media-has-caption': 'warn',
      'jsx-a11y/no-autofocus': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'no-case-declarations': 'warn',
      'no-constant-binary-expression': 'warn',
      'no-empty': 'warn',
      'no-useless-escape': 'warn',
      'prefer-const': 'warn',
      'react-hooks/rules-of-hooks': 'warn',
    },
  },
];
