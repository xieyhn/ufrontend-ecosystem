import type { Command } from './Compiler'
import type { Configuration } from 'webpack'
import type { ProjectConfig } from './defineProjectConfig'
import merge from 'webpack-merge'
import { errorExit } from './logger'

const defalutOptions: Options = {
  command: 'dev',
  debug: true,
  projectConfig: {
    publicPath: '/',
    configureWebpack: undefined,
    webpackConfigTransform: undefined,
    enableStylelint: false,
    enableESlint: false,
    transformAssetUrls: {
      tags: {
        video: ['src', 'poster'],
        source: ['src'],
        img: ['src'],
        image: ['xlink:href', 'href'],
        use: ['xlink:href', 'href']
      }
    }
  },
}

/**
 * Webpck Configuration getter options
 */
export interface Options {
  command: Command
  debug: boolean
  projectConfig: ProjectConfig
}

export interface ConfigurationGetter {
  (options: Options): Configuration
}

export function resolveOptions(
  options: Partial<Options>
): Options {
  const marged = merge(
    {}, 
    defalutOptions, 
    options
  ) as Options
  return marged
}

export function checkOptions(options: Options) {
  const { publicPath } = options.projectConfig
  if (!publicPath!.endsWith('/')) {
    errorExit(new Error('publicPath 需要以 / 结尾'))
  }
}