import type webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import postcss, { Declaration as PostcssDeclaration } from 'postcss'
import { sources } from 'webpack'
import type { ProjectConfig } from '../compile'

import { cssPrefix } from '../constants'
import { isExternalUrl } from '../helper'

class CSSPlugin {
  // eslint-disable-next-line
  constructor(private projectConfig: ProjectConfig) {}

  // eslint-disable-next-line class-methods-use-this
  apply(compiler: webpack.Compiler) {
    const { publicPath, css } = this.projectConfig

    compiler.hooks.compilation.tap('CSSPlugin', (compilation) => {
      const hooks = HtmlWebpackPlugin.getHooks(compilation)
      hooks.alterAssetTagGroups.tapPromise('CSSPlugin', async (data) => {
        await Promise.all(
          data.headTags
            .filter((tag) => tag.tagName === 'link' && tag.attributes.rel === 'stylesheet' && typeof tag.attributes.href === 'string')
            .map((tag) => {
              // 找到资源名称
              const assetName = (tag.attributes.href as string).replace(new RegExp(`^${publicPath}`), '')
              const content = compilation.assets[assetName].source().toString()

              return new Promise<void>((resolve) => {
                if (css?.inject === 'style') {
                  tag.tagName = 'style'
                  tag.voidTag = false
                  tag.innerHTML = content
                  tag.attributes = { type: 'text/css' }
                  resolve()
                } else if (publicPath === '') {
                  // TODO 是否可以移除 processed
                  const processed = new WeakMap<PostcssDeclaration, true>()
                  postcss([
                    {
                      postcssPlugin: 'postcss-css-plugin',
                      Declaration(decl) {
                        if (processed.get(decl)) return
                        const value = decl.value.replace(/url\s*\((['"])?(.+?)\1\)/g, (exp: string, _, p: string) => {
                          if (isExternalUrl(p) || p.startsWith('/')) return exp
                          return exp.replace(
                            p,
                            cssPrefix.split('/').filter(Boolean).map(() => '../').join('') + p,
                          )
                        })
                        if (value !== decl.value) {
                          // eslint-disable-next-line no-param-reassign
                          decl.value = value
                          processed.set(decl, true)
                        }
                      },
                    },
                  ]).process(content)
                    .then((result) => {
                      compilation.updateAsset(assetName, new sources.RawSource(result.css))
                      resolve()
                    })
                } else {
                  resolve()
                }
              })
            }),
        )

        return data
      })
    })
  }
}

export default CSSPlugin
