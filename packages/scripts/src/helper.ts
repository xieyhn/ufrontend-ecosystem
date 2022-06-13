import type { Configuration as WebpackConfiguration } from 'webpack'
import merge from 'webpack-merge'
import type { Command } from './Compiler'
import type { ProjectConfig } from './defineProjectConfig'
import { errorExit } from './logger'

export interface Options {
  command: Command
  debug: boolean
  projectConfig: ProjectConfig
}

/**
 * Webpack/WebpackDevServer Configuration getter options
 */
const defalutOptions: Options = {
  command: 'dev',
  debug: true,
  projectConfig: {
    publicPath: '',
    configureWebpack: undefined,
    webpackConfigTransform: undefined,
    enableStylelint: false,
    enableESlint: false,
    css: {
      injectMode: 'link'
    }
  },
}

export interface ConfigurationGetter {
  (options: Options): WebpackConfiguration
}

export function resolveOptions(
  options: Partial<Options>,
): Options {
  const marged = merge(
    {},
    defalutOptions,
    options,
  ) as Options
  return marged
}

export function checkOptions(options: Options) {
  const { publicPath } = options.projectConfig
  if (publicPath && !publicPath!.endsWith('/')) {
    errorExit(new Error('publicPath 需要以 / 结尾'))
  }
}
