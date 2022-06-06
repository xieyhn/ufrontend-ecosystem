import { NodeTransform } from '@vue/compiler-core';
import type { Plugin } from 'postcss';
import { Options } from '../../helper';
export declare const postcssPluginCreator: (options: Options) => Plugin;
export declare const vueTransformAssetUrlCreator: (options: Options) => NodeTransform;
