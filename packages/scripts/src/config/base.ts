import path from 'path'
import { DefinePlugin } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
// eslint-disable-next-line import/no-extraneous-dependencies
import TerserWebpackPlugin from 'terser-webpack-plugin'
import { ConfigurationGetter } from '../helper'

const createConfig: ConfigurationGetter = (options) => {
  const { command, debug, projectConfig } = options
  const src = path.resolve(process.cwd(), 'src')
  const fileBaseName = debug ? '[name].[contenthash:8]' : '[contenthash]'

  return {
    mode: command === 'dev' ? 'development' : 'production',
    devtool: command === 'dev' ? 'source-map' : false,
    context: path.resolve(__dirname, '../../'),
    entry: {
      app: path.resolve(process.cwd(), 'src/index.ts'),
    },
    output: {
      publicPath: projectConfig.publicPath,
      filename: `js/${fileBaseName}.js`,
      clean: true,
      assetModuleFilename: `assets/${command === 'dev' ? '[name]_' : ''}[hash][ext][query]`,
    },
    resolve: {
      alias: {
        '@': src,
        '@src': src,
      },
      extensions: ['.ts', 'tsx', '.js', '.jsx'],
    },
    plugins: [
      (() => {
        const defines: Record<string, string | undefined> = {}
        Object.entries(process.env).forEach(([key, val]) => {
          if (key.startsWith('APP_')) {
            defines[`process.env.${key}`] = JSON.stringify(val)
          }
        })
        defines['process.env.NODE_ENV'] = JSON.stringify(process.env.NODE_ENV)
        defines['process.env.PUBLIC_PATH'] = JSON.stringify(projectConfig.publicPath)
        return new DefinePlugin(defines)
      })(),
      new HtmlWebpackPlugin({
        template: path.resolve(process.cwd(), 'index.html'),
      }),
      // https://github.com/Richienb/node-polyfill-webpack-plugin
      new NodePolyfillPlugin({
        excludeAliases: ['console'],
      }),
      // https://github.com/webpack-contrib/copy-webpack-plugin
      new CopyPlugin({
        patterns: [
          {
            from: 'public', to: '', context: process.cwd(), noErrorOnMissing: true,
          },
        ],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|svg|mp4)$/i,
          type: 'asset',
        },
      ],
    },
    optimization: {
      nodeEnv: false,
      minimizer: [
        new TerserWebpackPlugin({
          // 注释不单独提出文件
          extractComments: false,
        }),
      ],
      splitChunks: {
        cacheGroups: {
          common: {
            test: /[\\/]node_modules[\\/]/,
            name: 'common',
            chunks: 'all',
            filename: `js/${fileBaseName}.js`,
            priority: 1,
          },
        },
      },
    },
    // https://webpack.js.org/configuration/stats/
    stats: 'errors-warnings',
  }
}

export default createConfig
