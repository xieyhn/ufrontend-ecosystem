"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeEntryConfig = void 0;
function removeEntryConfig(webpackConfig) {
    delete webpackConfig.entry;
    webpackConfig.plugins = webpackConfig.plugins.filter(plugin => {
        if (!plugin.constructor)
            return true;
        return plugin.constructor.name !== 'HtmlWebpackPlugin';
    });
}
exports.removeEntryConfig = removeEntryConfig;
