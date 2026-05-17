const tseslint = require('typescript-eslint');
const prettier = require('eslint-plugin-prettier');

module.exports = tseslint.config(
  ...tseslint.configs.recommended,
  {
    plugins: {
      prettier,
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      'no-case-declarations': 'off',
      'prettier/prettier': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [{ regex: '^@mui/[^/]+$' }],
        },
      ],
    },
  },
  {
    ignores: ['build/', 'node_modules/', 'prod/'],
  }
);
