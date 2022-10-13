import type { RuleSetUseItem, WebpackPluginInstance } from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import StylelintPlugin from 'stylelint-webpack-plugin'
import autoprefixer from 'autoprefixer'
import { ConfigurationGetter } from '../options'
import { cssIgnoreUrlMap, postcssPluginCreator } from './plugins/resolvePublicPath'
import StylePlugin from './plugins/StylePlugin'
import { cssAssetsPrefix } from './consts'

const createConfig: ConfigurationGetter = (options) => {
  const { command, debug, projectConfig } = options
  const loaders: RuleSetUseItem[] = [
    command === 'dev' ? 'style-loader' : MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        url: {
          filter(url: string) {
            return !cssIgnoreUrlMap.get(url)
          },
        },
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            autoprefixer,
            postcssPluginCreator(options),
          ],
        },
      },
    },
  ]
  const plugins: WebpackPluginInstance[] = [
    new MiniCssExtractPlugin({
      filename: `${cssAssetsPrefix}${debug ? '[name].[contenthash:8]' : '[contenthash]'}.css`,
    }),
  ]

  if (projectConfig.css!.prodInjectMode === 'style') {
    plugins.push(new StylePlugin())
  }

  if (projectConfig.enableStylelint) {
    plugins.push(
      new StylelintPlugin({
        extensions: ['vue', 'scss', 'sass', 'css'],
        context: process.cwd(),
        fix: false,
      }),
    )
  }

  return {
    plugins,
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: loaders,
        },
        {
          test: /\.s[ac]ss$/i,
          use: loaders.concat({
            loader: 'sass-loader',
            options: projectConfig.css?.sassLoaderOptions
          }),
        },
      ],
    },
  }
}

export default createConfig
