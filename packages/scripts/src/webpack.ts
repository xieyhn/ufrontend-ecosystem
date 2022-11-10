/* eslint-disable no-underscore-dangle */
import type { Configuration as WebpackConfiguration, RuleSetUseItem } from 'webpack'
import type { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'
import type { CompilerOptions as VueCompilerOptions } from '@vue/compiler-sfc'
import type { Plugin as PostcssPlugin, Declaration as PostcssDeclaration } from 'postcss'

import path from 'node:path'
import { DefinePlugin } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import autoprefixer from 'autoprefixer'
import { VueLoaderPlugin } from 'vue-loader'
import type { Command, ProjectConfig } from './compile'
import { jsPrefix, cssPrefix, transformAssetUrls } from './constants'
import { isPublicPath, replacePublicPath, withQuery } from './helper'

export function createWebpackConfig(command: Command, projectConfig: ProjectConfig): WebpackConfiguration {
  const devCommand = command === 'dev'
  const src = path.resolve(process.cwd(), 'src')
  const tsconfigFile = path.resolve(process.cwd(), 'tsconfig.json')
  const { publicPath, css } = projectConfig

  const cssLoaders: RuleSetUseItem[] = [
    devCommand ? 'style-loader' : MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        url: {
          filter(url: string) {
            return !isPublicPath(url)
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
            (() => {
              const processed = new WeakMap<PostcssDeclaration, true>()

              return {
                postcssPlugin: 'postcss-resolve-public-path',
                Declaration(decl) {
                  if (!decl.source?.input.file || /node_modules/.test(decl.source?.input.file)) return
                  if (processed.get(decl)) return

                  // Example1:
                  // input: background-image: url('/path/a.png')
                  // exp: `url('/path/a.png')`
                  // path: `/path/a.png`

                  // Example2:
                  // input: background-image: url('../path/a.png')
                  // (mismatch)

                  // .+? 关闭贪婪模式
                  const value = decl.value.replace(/url\s*\((['"])?(\/.+?)\1\)/g, (exp: string, _, p: string) => {
                    const newPath = replacePublicPath(
                      p,
                      publicPath,
                      (command === 'release' && (!(css?.inject) || css.inject === 'link')) ? cssPrefix : '',
                    )
                    if (newPath !== p) return exp.replace(p, withQuery(newPath, 'public'))
                    return exp
                  })
                  if (value !== decl.value) {
                    // eslint-disable-next-line no-param-reassign
                    decl.value = value
                    processed.set(decl, true)
                  }
                },
              }
            })() as PostcssPlugin,
          ],
        },
      },
    },
  ]

  return {
    mode: devCommand ? 'development' : 'production',
    devtool: devCommand ? 'source-map' : false,
    context: path.resolve(__dirname, '..'),
    entry: {
      app: path.resolve(src, 'index.ts'),
    },
    output: {
      publicPath,
      filename: `${jsPrefix}${devCommand ? '[name].[contenthash:8]' : '[contenthash]'}.js`,
      clean: true,
      assetModuleFilename() {
        // TODO
        return `assets/${devCommand ? '[name]_' : ''}[hash][ext][query]`
      },
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

        // https://github.com/vuejs/core/tree/main/packages/vue#bundler-build-feature-flags
        defines.__VUE_OPTIONS_API__ = 'true'
        defines.__VUE_PROD_DEVTOOLS__ = 'false'

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
      /**
       * 开启独立的进程来检查 ts 文件
       */
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: tsconfigFile,
        },
      }),
      // css
      new MiniCssExtractPlugin({
        filename: `${cssPrefix}${devCommand ? '[name].[contenthash:8]' : '[contenthash]'}.css`,
      }),
      // vue
      new VueLoaderPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|svg|mp4)$/i,
          type: 'asset',
        },
        // js
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
        // ts && tsx
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
            },
            {
              loader: 'ts-loader',
              options: {
                appendTsSuffixTo: [/\.vue$/],
                configFile: tsconfigFile,
                compilerOptions: {
                  sourceMap: devCommand,
                },
                // 关闭类型检检验，校验工作给 ForkTsCheckerWebpackPlugin 插件
                transpileOnly: true,
              },
            },
          ],
        },
        // css
        {
          test: /\.css$/i,
          use: cssLoaders,
        },
        // scss
        {
          test: /\.s[ac]ss$/i,
          use: cssLoaders.concat({
            loader: 'sass-loader',
            options: projectConfig.css?.sassLoaderOptions,
          }),
        },
        // vue
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            transformAssetUrls,
            compilerOptions: {
              nodeTransforms: [
                /**
                 * 处理 publicPath
                 *
                 * Example1: (publicPath: '')
                 * <img src="/a.png" /> => <img src="a.png" />
                 * <video src="/a.mp4" /> => <video src="a.mp4" />
                 *
                 * Example2: (publicPath: './')
                 * <img src="/a.png" /> => <img src="./a.png" />
                 * <video src="/a.mp4" /> => <video src="./a.mp4" />
                 *
                 * Example3: (publicPath: '/path')
                 * <img src="/a.png" /> => <img src="/path/a.png" />
                 * <video src="/a.mp4" /> => <video src="/path/a.mp4" />
                 *
                 */
                (node) => {
                  if (node.type !== /** NodeTypes.ELEMENT */ 1) return
                  const { tags } = transformAssetUrls
                  if (!(node.tag in tags) || !node.props.length) return

                  tags[node.tag].forEach((attrName) => {
                    const nodeAttr = node.props.find((i) => i.name === attrName)
                    if (!nodeAttr || nodeAttr.type !== /** NodeTypes.ATTRIBUTE */ 6 || !nodeAttr.value) return

                    const { content } = nodeAttr.value
                    if (content.startsWith('/')) {
                      nodeAttr.value.content = replacePublicPath(content, publicPath!)
                    }
                  })
                },
              ],
            } as VueCompilerOptions,
          },
        },
      ],
    },
    optimization: {
      nodeEnv: false,
      minimizer: [
        new TerserWebpackPlugin({
          // 注释不单独提出文件
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            },
          },
        }),
      ],
      splitChunks: {
        cacheGroups: {
          common: {
            test: /[\\/]node_modules[\\/]/,
            name: 'common',
            chunks: 'all',
            filename: `js/${devCommand ? '[name].[contenthash:8]' : '[contenthash]'}.js`,
            priority: 1,
          },
        },
      },
    },
    // https://webpack.js.org/configuration/stats/
    stats: 'errors-warnings',
  }
}

export function createWebpackDevServerConfig(projectConfig: ProjectConfig): WebpackDevServerConfiguration {
  return {
    // 处理 vue-router history 模式页面刷新
    // https://github.com/bripkens/connect-history-api-fallback
    historyApiFallback: {
      index: projectConfig.publicPath,
    },
    static: false,
  }
}
