"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDevServerConfig = void 0;
function createDevServerConfig(options) {
    return {
        // 处理 vue-router history 模式页面刷新
        // https://github.com/bripkens/connect-history-api-fallback
        historyApiFallback: {
            index: options.projectConfig.publicPath
        },
        static: false
    };
}
exports.createDevServerConfig = createDevServerConfig;
