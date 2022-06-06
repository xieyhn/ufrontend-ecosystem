"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { projectConfig } = process.env.compiler.options;
const transformAssetUrl = node => {
    if (node.type !== 1 /* NodeTypes.ELEMENT */)
        return;
    if (!node.props.length)
        return;
    if (node.tag === 'img') {
        const srcProp = node.props.find(i => i.name === 'src');
        if (!srcProp || !srcProp.value)
            return;
        const { content } = srcProp.value;
        if (content.startsWith('/') && !content.startsWith(projectConfig.publicPath)) {
            srcProp.value.content = `${projectConfig.publicPath}${content.replace(/^\//, '')}`;
        }
    }
};
exports.default = transformAssetUrl;
