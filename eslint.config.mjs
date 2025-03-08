import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(eslint.configs.recommended, tseslint.configs.recommended, {
  files: ['**/*.{ts,js,mjs}'],
  languageOptions: {
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    globals: {
      ...globals.node,
    },
  },
  plugins: {
    import: importPlugin,
  },
  rules: {
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'index', 'sibling', 'parent'],
        alphabetize: {
          order: 'asc',
        },
      },
    ],
  },
});
