'use strict';

const { FlatCompat } = require('@eslint/eslintrc');
const { configs: jsConfigs } = require('@eslint/js');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: jsConfigs.recommended,
  allConfig: jsConfigs.all,
});

module.exports = [
  {
    ignores: ['dist', 'node_modules', 'build', 'eslint.config.cjs', '.prettierrc.js'],
  },
  ...compat.config({
    parser: '@typescript-eslint/parser',
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'prettier'],
    plugins: ['@typescript-eslint'],
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      project: 'tsconfig.json',
    },
    env: {
      es6: true,
      node: true,
    },
    rules: {
      'no-var': 'error',
      semi: 'error',
      indent: ['error', 2, { SwitchCase: 1 }],
      'no-multi-spaces': 'error',
      'space-in-parens': 'error',
      'no-multiple-empty-lines': 'error',
      'prefer-const': 'error',
      'prettier/prettier': ['error', { singleQuote: false }],
    },
  }),
];
