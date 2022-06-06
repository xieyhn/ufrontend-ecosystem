// @ts-check

/**
 * project devDependencies:
 * + eslint
 * + eslint-config-airbnb-base
 * + eslint-plugin-import
 * + eslint-plugin-vue
 * + @typescript-eslint/eslint-plugin
 * + @typescript-eslint/parser
 */

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
  ],
  settings: {
    'import/resolver': {
      node: {},
      webpack: {
        // eslint-import-resolver-webpack
        // config: require('./packages/scripts/webpack.config')
      },
    },
  },
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: [
    'vue',
    '@typescript-eslint',
  ],
  rules: {
    'import/extensions': ['error', 'always', {
      js: 'never',
      mjs: 'never',
      jsx: 'never',
      ts: 'never',
      tsx: 'never',
    }],
    'no-undef': 'off',
  },
}
