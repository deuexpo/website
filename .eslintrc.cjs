/* eslint-disable quote-props */

module.exports = {
  env: {
    amd: true,
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    babelOptions: {
      parserOpts: {
        plugins: ['importAssertions'],
      },
    },
    ecmaVersion: 7,
    requireConfigFile: false,
    sourceType: 'module',
  },
  plugins: ['eslint-plugin-jest'],
  root: true,
  rules: {
    'camelcase': [
      'error',
      {properties: 'always'},
    ],
    'func-names': [
      'error',
      'never',
    ],
    'generator-star-spacing': [
      'error',
      {'before': true, 'after': false},
    ],
    'import/order': [
      'off',
    ],
    'import/extensions': ['error', 'ignorePackages'], // https://stackoverflow.com/questions/59265981/typescript-eslint-missing-file-extension-ts-import-extensions
    'import/no-unresolved': [2, {'ignore': ['^#.+$']}], // https://github.com/import-js/eslint-plugin-import/issues/1868
    'indent': [
      'error',
      2,
      {'SwitchCase': 1},
    ],
    'lines-between-class-members': [ // https://eslint.org/docs/latest/rules/lines-between-class-members
      'error',
      'always',
      {'exceptAfterSingleLine': true},
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'max-len': [
      'error',
      {
        'code': 1500,
        'ignoreTrailingComments': true,
      },
    ],
    'newline-per-chained-call': [
      'error',
      {'ignoreChainWithDepth': 6},
    ],
    'no-await-in-loop': [
      'off',
    ],
    'no-console': [
      'off',
    ],
    'no-plusplus': [
      'off',
    ],
    'no-prototype-builtins': [
      'off',
    ],
    'no-restricted-syntax': [
      'off',
    ],
    'no-underscore-dangle': [
      'error',
      {'allow': ['_id', '__v']},
    ],
    'object-curly-newline': [
      'error',
      {'consistent': true},
    ],
    'object-curly-spacing': [
      'error',
      'never',
    ],
    'prefer-destructuring': [
      'error', {
        'array': false,
        'object': true,
      }, {
        'enforceForRenamedProperties': false,
      },
    ],
    'quotes': [
      'error',
      'single',
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        // paths: ['.'],
        paths: __dirname,
      },
    },
  },
};
