"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
class StylePlugin {
    // eslint-diable-next-line class-methods-use-this
    apply(compiler) {
        compiler.hooks.compilation.tap('StylePlugin', (compilation) => {
            let { publicPath } = compiler.options.output;
            if (publicPath && typeof publicPath !== 'string') {
                console.error(`output.publicPath 不支持非 string 类型`);
                process.exit(1);
            }
            if (publicPath && !publicPath.endsWith('/'))
                publicPath += '/';
            const hooks = html_webpack_plugin_1.default.getHooks(compilation);
            hooks.alterAssetTagGroups.tapAsync('StylePlugin', ({ headTags }, callback) => {
                headTags.forEach(tag => {
                    if (tag.tagName === 'link'
                        && tag.attributes.rel === 'stylesheet'
                        && typeof tag.attributes.href == 'string') {
                        const assetName = publicPath
                            ? tag.attributes.href.replace(publicPath, '')
                            : tag.attributes.href;
                        tag.tagName = 'style';
                        tag.voidTag = false;
                        tag.innerHTML = compilation.assets[assetName].source().toString();
                        tag.attributes = { type: 'text/css' };
                        compilation.deleteAsset(assetName);
                    }
                });
                callback(null);
            });
        });
    }
}
exports.default = StylePlugin;
