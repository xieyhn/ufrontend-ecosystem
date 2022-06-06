"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_loader_1 = require("vue-loader");
const webpack_1 = require("webpack");
const resolvePublicPath_1 = require("./plugins/resolvePublicPath");
const createConfig = (options) => {
    return {
        plugins: [
            new vue_loader_1.VueLoaderPlugin(),
            new webpack_1.DefinePlugin({
                // https://github.com/vuejs/core/tree/main/packages/vue#bundler-build-feature-flags
                __VUE_OPTIONS_API__: true,
                __VUE_PROD_DEVTOOLS__: false
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        transformAssetUrls: options.projectConfig.transformAssetUrls,
                        compilerOptions: {
                            nodeTransforms: [
                                (0, resolvePublicPath_1.vueTransformAssetUrlCreator)(options)
                            ]
                        }
                    }
                },
            ]
        }
    };
};
exports.default = createConfig;
