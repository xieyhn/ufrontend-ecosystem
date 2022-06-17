import type { Plugin } from 'postcss';
import { NodeTransform } from '@vue/compiler-core';
import { Options } from '../../options';
export declare const transformAssetUrls: {
    tags: Record<string, string[]>;
};
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
export declare const cssIgnoreUrlMap: Map<string, true>;
export declare const postcssPluginCreator: (options: Options) => Plugin;
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
export declare const vueTransformAssetUrlCreator: (options: Options) => NodeTransform;
