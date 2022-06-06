import type { RuleSetUseItem, WebpackPluginInstance } from 'webpack'
import { ConfigurationGetter } from '../helper'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import StylelintPlugin from 'stylelint-webpack-plugin'
import autoprefixer from 'autoprefixer'
// @ts-ignore
import pxtorem from 'postcss-pxtorem'
import { postcssPluginCreator } from './plugins/resolvePublicPath'

const createConfig: ConfigurationGetter = (options) => {
  const { command, debug, projectConfig } = options
  const loaders: RuleSetUseItem[] = [
    command === 'dev' ? 'style-loader' : MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        url: {
          filter(url: string) {
            return !url.startsWith('/')
          }
        }
      },

    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            autoprefixer,
            pxtorem,
            postcssPluginCreator(options)
          ]
        }
      }
    }
  ]
  const plugins: WebpackPluginInstance[] = [
    new MiniCssExtractPlugin({
      filename: `css/${debug ? '[name].[contenthash:8]' : '[contenthash]'}.css`
    })
  ]

  if (projectConfig.enableStylelint) {
    plugins.push(
      new StylelintPlugin({
        extensions: ['vue', 'scss', 'sass', 'css'],
        context: process.cwd(),
        fix: false
      })
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
          use: loaders.concat('sass-loader'),
        },
      ]
    }
  }
}

export default createConfig