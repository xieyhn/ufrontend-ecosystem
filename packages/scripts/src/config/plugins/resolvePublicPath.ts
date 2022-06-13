// 已内置
import type { Plugin, Declaration } from 'postcss'
// eslint-disable-next-line import/no-extraneous-dependencies
import { NodeTypes, NodeTransform, AttributeNode } from '@vue/compiler-core'
import { Options } from '../../helper'
import { cssAssetsPrefix } from '../consts'

const transformAssetUrls: {
  tags: Record<string, string[]>
} = {
  tags: {
    video: ['src', 'poster'],
    source: ['src'],
    img: ['src'],
    image: ['xlink:href', 'href'],
    use: ['xlink:href', 'href'],
  },
}

function replacePublicPath(value: string, publicPath: string, assetsPrefix: string = '') {
  const prefix = publicPath.startsWith('/')
    ? '/'
    : assetsPrefix.split('/').filter(Boolean).map(() => '../').join('')
  return value.replace(/^\//, `${prefix}${publicPath.replace(/^\//, '')}`)
}

/**
 * Example1: (publicPath: '')
 * url('/a.png') => url('a.png')
 *
 * Example2: (publicPath: './')
 * url('/a.png') => url('./a.png')
 *
 * Example3: (publicPath: '/path')
 * url('/a.png') => url('/path/a.png')
 *
 * 后续通过 css-loader 忽略对匹配该规则的 url 函数解析
 */
export const cssIgnoreUrlMap = new Map<string, true>()
export const postcssPluginCreator = (options: Options): Plugin => {
  const processed = new WeakMap<Declaration, true>()
  const { projectConfig: { publicPath, css: cssOptions } } = options
  return {
    postcssPlugin: 'postcss-resolve-publicPath',
    Declaration(decl) {
      if (!decl.source?.input.file || /node_modules/.test(decl.source?.input.file)) return
      if (processed.get(decl)) return
      const newPaths = new Set<string>()
      // Example1:
      // input: background-image: url('/path/a.png')
      // exp: `url('/path/a.png')`
      // path: `/path/a.png`

      // Example2:
      // input: background-image: url('../path/a.png')
      // (mismatch)
      // .+? 关闭贪婪模式
      const value = decl.value.replace(/url\s*\((['"])?(\/.+?)\1\)/g, (exp: string, _, path: string) => {
        const newPath = replacePublicPath(
          path,
          publicPath!,
          cssOptions!.injectMode === 'link' ? cssAssetsPrefix: ''
        )
        if (newPath !== path) {
          newPaths.add(newPath)
          return exp.replace(path, newPath)
        }
        return exp
      })
      if (value !== decl.value) {
        // eslint-disable-next-line no-param-reassign
        decl.value = value
        processed.set(decl, true)
        newPaths.forEach((p) => cssIgnoreUrlMap.set(p, true))
      }
    },
  }
}

/**
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
export const vueTransformAssetUrlCreator = (options: Options): NodeTransform => {
  const { projectConfig: { publicPath } } = options
  const { tags } = transformAssetUrls

  return (node) => {
    if (node.type !== NodeTypes.ELEMENT) return
    if (!(node.tag in tags) || !node.props.length) return
    tags[node.tag].forEach((attrName) => {
      const nodeAttr = node.props.find((i) => i.name === attrName) as AttributeNode
      if (!nodeAttr || !nodeAttr.value) return
      const { content } = nodeAttr.value
      if (content.startsWith('/')) {
        nodeAttr.value.content = replacePublicPath(content, publicPath!)
      }
    })
  }
}
