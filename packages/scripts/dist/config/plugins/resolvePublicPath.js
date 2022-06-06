"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vueTransformAssetUrlCreator = exports.postcssPluginCreator = void 0;
function withPublicPath(publicPath, value) {
    return `${publicPath}${value.replace(/^\//, '')}`;
}
const postcssPluginCreator = (options) => {
    const { projectConfig } = options;
    return {
        postcssPlugin: 'postcss-resolve-publicPath',
        Declaration(decl) {
            if (!decl.source?.input.file || /node_modules/.test(decl.source?.input.file))
                return;
            // .+? 关闭贪婪模式
            const value = decl.value.replace(/url\s*\((['"])?(\/.+?)\1\)/g, (exp, _, path) => {
                if (!path.startsWith(projectConfig.publicPath)) {
                    return exp.replace(path, withPublicPath(projectConfig.publicPath, path));
                }
                return exp;
            });
            if (value !== decl.value) {
                // eslint-disable-next-line no-param-reassign
                decl.value = value;
            }
        },
    };
};
exports.postcssPluginCreator = postcssPluginCreator;
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
            if (content.startsWith('/') && !content.startsWith(publicPath)) {
                nodeAttr.value.content = withPublicPath(publicPath, content);
            }
        });
    };
};
exports.vueTransformAssetUrlCreator = vueTransformAssetUrlCreator;
