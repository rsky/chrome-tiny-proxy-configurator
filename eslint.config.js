const globals = require('globals')
const pluginRegexp = require('eslint-plugin-regexp')
const pluginJest = require('eslint-plugin-jest')
const js = require('@eslint/js')

module.exports = [
  // Base configuration for all files
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.webextensions,
      },
    },
    plugins: {
      regexp: pluginRegexp,
      jest: pluginJest,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...pluginRegexp.configs.recommended.rules,
    },
  },
  // Configuration for test files
  {
    files: ['tests/**/*.js', '**/*.test.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  // Configuration for config files
  {
    files: ['*.config.js', '.eslintrc.js', 'jest-transformer.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]
