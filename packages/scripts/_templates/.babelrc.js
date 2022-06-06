// @ts-check

/**
 * project devDependencies:
 * + @babel/core
 * + @babel/preset-env
 * 
 * project dependencies:
 * + core-js@3
 */

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: '3'
      }
    ]
  ]
}
