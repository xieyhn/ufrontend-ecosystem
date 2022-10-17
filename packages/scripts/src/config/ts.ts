import path from 'path'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import { WebpackPluginInstance } from 'webpack'
import { ConfigurationGetter } from '../options'

const createConfig: ConfigurationGetter = (options) => {
  const { command } = options
  const tsconfigFile = path.resolve(process.cwd(), 'tsconfig.json')

  const plugins: WebpackPluginInstance[] = [
    /**
     * 开启独立的进程来检查 ts 文件
     */
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: tsconfigFile,
      },
    }),
  ]

  return {
    plugins,
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
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
                  sourceMap: command === 'dev',
                },
                /**
                 * 关闭类型检检验，校验工作给 ForkTsCheckerWebpackPlugin 插件
                 */
                transpileOnly: true,
              },
            },
          ],
        },
      ],
    },
  }
}

export default createConfig
