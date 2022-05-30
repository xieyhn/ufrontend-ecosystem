import { Configuration, RuleSetUseItem, DefinePlugin } from 'webpack'
import type { Command } from './Compiler'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import { log } from './logger'
import autoprefixer from 'autoprefixer'
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'

export function createWebpackConfig(
  command: Command,
  options?: {
    debug: boolean
  }
): Configuration {
  const development = command === 'dev'
  const { debug = false } = options || {}
  log('Debug:', debug)
  
  const cwd = process.cwd()
  const src = path.resolve(cwd, 'src')
  const fileBaseName = debug ? '[name].[contenthash:8]': '[contenthash]'
  const tsconfigFile = path.resolve(cwd, 'tsconfig.json')

  const cssLoaders: RuleSetUseItem[] = [
    development ? 'style-loader' : MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader'
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            autoprefixer()
          ]
        }
      }
    }
  ]

  return {
    mode: development ? 'development' : 'production',
    devtool: development ? 'source-map' : false,
    context: path.resolve(__dirname, '..'),
    entry: {
      app: path.resolve(cwd, 'src/index.ts')
    },
    output: {
      filename: `js/${fileBaseName}.js`,
      clean: true,
      assetModuleFilename: `assets/${development ? '[name]_' : ''}[hash][ext][query]`
    },
    resolve: {
      alias: {
        '@': src,
        '@src': src
      },
      extensions: ['.ts', 'tsx', '.js', '.jsx'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(cwd, 'index.html')
      }),
      new MiniCssExtractPlugin({
        filename: `css/${fileBaseName}.css`
      }),
      new VueLoaderPlugin(),
      /**
       * 开启独立的进程来检查 ts 文件
       */
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: tsconfigFile
        },
      }),
      new DefinePlugin({
        // https://github.com/vuejs/core/tree/main/packages/vue#bundler-build-feature-flags
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false
      }),
      // https://github.com/Richienb/node-polyfill-webpack-plugin
      new NodePolyfillPlugin({
        excludeAliases: ['console', 'process', 'buffer']
      }),
      // https://github.com/webpack-contrib/copy-webpack-plugin
      new CopyPlugin({
        patterns: [
          { from: 'public', to: 'public', context: cwd, noErrorOnMissing: true }
        ]
      })
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
            configFile: tsconfigFile,
            compilerOptions: {
              sourceMap: development
            },
            /**
             * 关闭类型检检验，校验工作给 ForkTsCheckerWebpackPlugin 插件
             */
            transpileOnly: true,
          }
        },
        {
          test: /\.css$/i,
          use: cssLoaders,
        },
        {
          test: /\.s[ac]ss$/i,
          use: cssLoaders.concat('sass-loader'),
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.(png|jpe?g|gif|svg|mp4)$/i,
          type: 'asset',
        }
      ]
    },
    optimization: {
      minimizer: [
        new TerserWebpackPlugin({
          // 注释不单独提出文件
          extractComments: false
        })
      ],
      splitChunks: {
        cacheGroups: {
          common: {
            test: /[\\/]node_modules[\\/]/,
            name: 'common',
            chunks: 'all',
            filename: `js/${fileBaseName}.js`,
            priority: 1
          }
        }
      }
    },
    // https://webpack.js.org/configuration/stats/
    stats: 'errors-warnings'
  }
}
