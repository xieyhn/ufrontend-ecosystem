import { Configuration } from 'webpack'
import { ConfigurationGetter } from './helper'

export interface ProjectConfig {
  publicPath?: string
  configureWebpack?: Configuration | ConfigurationGetter
  webpackConfigTransform?: (webpackConfig: Configuration) => Configuration | void
  // Enable stylelint
  enableStylelint?: boolean
  // Enable eslint
  enableESlint?: boolean
  transformAssetUrls?: {
    tags: Record<string, string[]>
  }
}

export function defineProjectConfig(config: ProjectConfig) {
  return config
}
