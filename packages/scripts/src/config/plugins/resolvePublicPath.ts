import type { Plugin } from 'postcss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { NodeTypes, NodeTransform, AttributeNode } from '@vue/compiler-core'
import { Options } from '../../helper'

function withPublicPath(publicPath: string, value: string) {
  return `${publicPath}${value.replace(/^\//, '')}`
}

export const postcssPluginCreator = (options: Options): Plugin => {
  const { projectConfig } = options
  return {
    postcssPlugin: 'postcss-resolve-publicPath',
    Declaration(decl) {
      if (!decl.source?.input.file || /node_modules/.test(decl.source?.input.file)) return
      // .+? 关闭贪婪模式
      const value = decl.value.replace(/url\s*\((['"])?(\/.+?)\1\)/g, (exp: string, _, path: string) => {
        if (!path.startsWith(projectConfig.publicPath!)) {
          return exp.replace(path, withPublicPath(projectConfig.publicPath!, path))
        }
        return exp
      })
      if (value !== decl.value) {
        // eslint-disable-next-line no-param-reassign
        decl.value = value
      }
    },
  }
}

export const vueTransformAssetUrlCreator = (options: Options): NodeTransform => {
  const { projectConfig: { publicPath, transformAssetUrls } } = options
  const { tags } = transformAssetUrls!

  return (node) => {
    if (node.type !== NodeTypes.ELEMENT) return
    if (!(node.tag in tags) || !node.props.length) return
    tags[node.tag].forEach((attrName) => {
      const nodeAttr = node.props.find((i) => i.name === attrName) as AttributeNode
      if (!nodeAttr || !nodeAttr.value) return
      const { content } = nodeAttr.value
      if (content.startsWith('/') && !content.startsWith(publicPath!)) {
        nodeAttr.value.content = withPublicPath(publicPath!, content)
      }
    })
  }
}
