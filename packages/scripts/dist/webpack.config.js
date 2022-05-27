"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebpackConfig = void 0;
const path_1 = __importDefault(require("path"));
const webpack_1 = require("webpack");
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const vue_loader_1 = require("vue-loader");
const fork_ts_checker_webpack_plugin_1 = __importDefault(require("fork-ts-checker-webpack-plugin"));
const terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
const logger_1 = require("./logger");
const autoprefixer_1 = __importDefault(require("autoprefixer"));
function createWebpackConfig(command, options) {
    const development = command === 'dev';
    const { debug = false } = options || {};
    (0, logger_1.log)('Debug:', debug);
    const cwd = process.cwd();
    const src = path_1.default.resolve(cwd, 'src');
    const fileBaseName = debug ? '[name].[contenthash:8]' : '[contenthash]';
    const tsconfigFile = path_1.default.resolve(cwd, 'tsconfig.json');
    const cssLoaders = [
        development ? 'style-loader' : mini_css_extract_plugin_1.default.loader,
        'css-loader',
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: [
                        (0, autoprefixer_1.default)()
                    ]
                }
            }
        }
    ];
    return {
        mode: command === 'dev' ? 'development' : 'production',
        context: path_1.default.resolve(__dirname, '..'),
        entry: {
            app: path_1.default.resolve(cwd, 'src/index.ts')
        },
        output: {
            filename: `js/${fileBaseName}.js`,
            clean: true,
            assetModuleFilename: `assets/${development ? '[name]_' : ''}[hash][ext][query]`
        },
        resolve: {
            alias: {
                '@': src,
                '@src': src,
            },
            extensions: ['.ts', 'tsx', '.js', '.jsx'],
        },
        plugins: [
            new html_webpack_plugin_1.default({
                template: path_1.default.resolve(cwd, 'index.html')
            }),
            new mini_css_extract_plugin_1.default({
                filename: `css/${fileBaseName}.css`
            }),
            new vue_loader_1.VueLoaderPlugin(),
            /**
             * 开启独立的进程来检查 ts 文件
             */
            new fork_ts_checker_webpack_plugin_1.default({
                typescript: {
                    configFile: tsconfigFile
                },
            }),
            new webpack_1.DefinePlugin({
                // https://github.com/vuejs/core/tree/main/packages/vue#bundler-build-feature-flags
                __VUE_OPTIONS_API__: true,
                __VUE_PROD_DEVTOOLS__: false
            })
        ],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    options: {
                        appendTsSuffixTo: [/\.vue$/],
                        configFile: tsconfigFile,
                        compilerOptions: {
                            sourceMap: development
                        },
                        /**
                         * 关闭类型检检验，校验工作给 ForkTsCheckerWebpackPlugin 插件
                         */
                        transpileOnly: true,
                    }
                },
                {
                    test: /\.css$/i,
                    use: cssLoaders,
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: cssLoaders.concat('sass-loader'),
                },
                {
                    test: /\.vue$/,
                    loader: 'vue-loader'
                },
                {
                    test: /\.(png|jpe?g|gif|svg|mp4)$/i,
                    type: 'asset/resource'
                }
            ]
        },
        optimization: {
            minimizer: [
                new terser_webpack_plugin_1.default({
                    // 注释不单独提出文件
                    extractComments: false
                })
            ],
            splitChunks: {
                cacheGroups: {
                    common: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'common',
                        chunks: 'all',
                        filename: `js/${fileBaseName}.js`,
                        priority: 1
                    }
                }
            }
        },
        // https://webpack.js.org/configuration/stats/
        stats: 'errors-warnings'
    };
}
exports.createWebpackConfig = createWebpackConfig;
