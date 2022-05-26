"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDevServerConfig = void 0;
function createDevServerConfig() {
    return {
        // 处理 vue-router history 模式页面刷新
        // https://github.com/bripkens/connect-history-api-fallback
        historyApiFallback: true
    };
}
exports.createDevServerConfig = createDevServerConfig;
