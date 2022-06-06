import { VueLoaderPlugin } from 'vue-loader'
import { DefinePlugin } from 'webpack'
import { ConfigurationGetter } from '../helper'
import { vueTransformAssetUrlCreator } from './plugins/resolvePublicPath'

const createConfig: ConfigurationGetter = (options) => ({
  plugins: [
    new VueLoaderPlugin(),
    new DefinePlugin({
      // https://github.com/vuejs/core/tree/main/packages/vue#bundler-build-feature-flags
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          transformAssetUrls: options.projectConfig.transformAssetUrls,
          compilerOptions: {
            nodeTransforms: [
              vueTransformAssetUrlCreator(options),
            ],
          },
        },
      },
    ],
  },
})

export default createConfig
