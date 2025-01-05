import globals from 'globals';
import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

export default tseslint.config(eslint.configs.recommended, tseslint.configs.recommended, {
  files: ['**/*.{ts,js}'],
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
