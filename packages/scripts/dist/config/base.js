"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const webpack_1 = require("webpack");
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const node_polyfill_webpack_plugin_1 = __importDefault(require("node-polyfill-webpack-plugin"));
const copy_webpack_plugin_1 = __importDefault(require("copy-webpack-plugin"));
// eslint-disable-next-line import/no-extraneous-dependencies
const terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
const consts_1 = require("./consts");
const createConfig = (options) => {
    const { command, debug, projectConfig } = options;
    const src = path_1.default.resolve(process.cwd(), 'src');
    const fileBaseName = debug ? '[name].[contenthash:8]' : '[contenthash]';
    return {
        mode: command === 'dev' ? 'development' : 'production',
        devtool: command === 'dev' ? 'source-map' : false,
        context: path_1.default.resolve(__dirname, '../../'),
        entry: {
            app: path_1.default.resolve(process.cwd(), 'src/index.ts'),
        },
        output: {
            publicPath: projectConfig.publicPath,
            filename: `${consts_1.jsAssetsPrefix}${fileBaseName}.js`,
            clean: true,
            assetModuleFilename: `assets/${command === 'dev' ? '[name]_' : ''}[hash][ext][query]`,
        },
        resolve: {
            alias: {
                '@': src,
                '@src': src,
            },
            extensions: ['.ts', 'tsx', '.js', '.jsx'],
        },
        plugins: [
            (() => {
                const defines = {};
                Object.entries(process.env).forEach(([key, val]) => {
                    if (key.startsWith('APP_')) {
                        defines[`process.env.${key}`] = JSON.stringify(val);
                    }
                });
                defines['process.env.NODE_ENV'] = JSON.stringify(process.env.NODE_ENV);
                defines['process.env.PUBLIC_PATH'] = JSON.stringify(projectConfig.publicPath);
                return new webpack_1.DefinePlugin(defines);
            })(),
            new html_webpack_plugin_1.default({
                template: path_1.default.resolve(process.cwd(), 'index.html'),
            }),
            // https://github.com/Richienb/node-polyfill-webpack-plugin
            new node_polyfill_webpack_plugin_1.default({
                excludeAliases: ['console'],
            }),
            // https://github.com/webpack-contrib/copy-webpack-plugin
            new copy_webpack_plugin_1.default({
                patterns: [
                    {
                        from: 'public', to: '', context: process.cwd(), noErrorOnMissing: true,
                    },
                ],
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.(png|jpe?g|gif|svg|mp4)$/i,
                    type: 'asset',
                },
            ],
        },
        optimization: {
            nodeEnv: false,
            minimizer: [
                new terser_webpack_plugin_1.default({
                    // 注释不单独提出文件
                    extractComments: false,
                    terserOptions: {
                        format: {
                            comments: false,
                        },
                    },
                }),
            ],
            splitChunks: {
                cacheGroups: {
                    common: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'common',
                        chunks: 'all',
                        filename: `js/${fileBaseName}.js`,
                        priority: 1,
                    },
                },
            },
        },
        // https://webpack.js.org/configuration/stats/
        stats: 'errors-warnings',
    };
};
exports.default = createConfig;
