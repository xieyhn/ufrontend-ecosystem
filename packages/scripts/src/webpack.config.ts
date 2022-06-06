import merge from 'webpack-merge'
import { ConfigurationGetter } from './helper'
import baseConfig from './config/base'
import scssConfig from './config/scss'
import tsConfig from './config/ts'
import vueConfig from './config/vue'

export const createWebpackConfig: ConfigurationGetter = (options) => merge([baseConfig, scssConfig, tsConfig, vueConfig].map((config) => {
  if (typeof config === 'function') return config(options)
  return config
}))
