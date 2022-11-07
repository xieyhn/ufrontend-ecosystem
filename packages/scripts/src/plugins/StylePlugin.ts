import HtmlWebpackPlugin from 'html-webpack-plugin'
import type webpack from 'webpack'

class StylePlugin {
  // eslint-disable-next-line class-methods-use-this
  apply(compiler: webpack.Compiler) {
    compiler.hooks.compilation.tap('StylePlugin', (compilation) => {
      const publicPath = compiler.options.output.publicPath as string

      const hooks = HtmlWebpackPlugin.getHooks(compilation)
      hooks.alterAssetTagGroups.tapAsync('StylePlugin', ({ headTags }, callback) => {
        headTags.forEach((tag) => {
          if (
            tag.tagName === 'link'
            && tag.attributes.rel === 'stylesheet'
            && typeof tag.attributes.href === 'string'
          ) {
            const assetName = publicPath
              ? tag.attributes.href.replace(publicPath, '')
              : tag.attributes.href

            tag.tagName = 'style'
            tag.voidTag = false
            tag.innerHTML = compilation.assets[assetName].source().toString()
            tag.attributes = { type: 'text/css' }

            compilation.deleteAsset(assetName)
          }
        })
        callback(null)
      })
    })
  }
}

export default StylePlugin
