import webpack from 'webpack'

export function removeEntryConfig(webpackConfig: webpack.Configuration) {
  delete webpackConfig.entry
  webpackConfig.plugins = webpackConfig.plugins!.filter((plugin) => {
    if (!plugin.constructor) return true
    return plugin.constructor.name !== 'HtmlWebpackPlugin'
  })
}
