"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vueTransformAssetUrlCreator = exports.postcssPluginCreator = exports.cssIgnoreUrlMap = void 0;
const consts_1 = require("../consts");
function replacePublicPath(value, publicPath, assetsPrefix = '') {
    let prefix = publicPath.startsWith('/')
        ? '/'
        : assetsPrefix.split('/').filter(Boolean).map(() => '../').join('');
    return value.replace(/^\//, `${prefix}${publicPath.replace(/^\//, '')}`);
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
exports.cssIgnoreUrlMap = new Map();
const postcssPluginCreator = (options) => {
    const processed = new WeakMap;
    const { projectConfig: { publicPath } } = options;
    return {
        postcssPlugin: 'postcss-resolve-publicPath',
        Declaration(decl) {
            if (!decl.source?.input.file || /node_modules/.test(decl.source?.input.file))
                return;
            if (processed.get(decl))
                return;
            const newPaths = new Set();
            // Example1:
            // input: background-image: url('/path/a.png')
            // exp: `url('/path/a.png')`
            // path: `/path/a.png`
            // Example2:
            // input: background-image: url('../path/a.png')
            // (mismatch)
            // .+? 关闭贪婪模式
            const value = decl.value.replace(/url\s*\((['"])?(\/.+?)\1\)/g, (exp, _, path) => {
                const newPath = replacePublicPath(path, publicPath, consts_1.cssAssetsPrefix);
                if (newPath !== path) {
                    newPaths.add(newPath);
                    return exp.replace(path, newPath);
                }
                return exp;
            });
            // eslint-disable-next-line no-param-reassign
            if (value !== decl.value) {
                decl.value = value;
                processed.set(decl, true);
                newPaths.forEach(p => exports.cssIgnoreUrlMap.set(p, true));
            }
        },
    };
};
exports.postcssPluginCreator = postcssPluginCreator;
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
const vueTransformAssetUrlCreator = (options) => {
    const { projectConfig: { publicPath, transformAssetUrls } } = options;
    const { tags } = transformAssetUrls;
    return (node) => {
        if (node.type !== 1 /* NodeTypes.ELEMENT */)
            return;
        if (!(node.tag in tags) || !node.props.length)
            return;
        tags[node.tag].forEach((attrName) => {
            const nodeAttr = node.props.find((i) => i.name === attrName);
            if (!nodeAttr || !nodeAttr.value)
                return;
            const { content } = nodeAttr.value;
            if (content.startsWith('/')) {
                nodeAttr.value.content = replacePublicPath(content, publicPath);
            }
        });
    };
};
exports.vueTransformAssetUrlCreator = vueTransformAssetUrlCreator;
