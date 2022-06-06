import type { Configuration } from 'webpack-dev-server'
import { Options } from './helper'

export function createDevServerConfig(options: Options): Configuration {
  return {
    // 处理 vue-router history 模式页面刷新
    // https://github.com/bripkens/connect-history-api-fallback
    historyApiFallback: {
      index: options.projectConfig.publicPath
    },
    static: false
  }
}
