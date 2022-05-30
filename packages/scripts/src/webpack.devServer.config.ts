import type { Configuration } from 'webpack-dev-server'

export function createDevServerConfig(): Configuration {
  return {
    // 处理 vue-router history 模式页面刷新
    // https://github.com/bripkens/connect-history-api-fallback
    historyApiFallback: true,
    static: false
  }
}
