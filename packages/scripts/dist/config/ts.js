"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fork_ts_checker_webpack_plugin_1 = __importDefault(require("fork-ts-checker-webpack-plugin"));
const eslint_webpack_plugin_1 = __importDefault(require("eslint-webpack-plugin"));
const createConfig = (options) => {
    const { command, projectConfig } = options;
    const tsconfigFile = path_1.default.resolve(process.cwd(), 'tsconfig.json');
    const plugins = [
        /**
         * 开启独立的进程来检查 ts 文件
         */
        new fork_ts_checker_webpack_plugin_1.default({
            typescript: {
                configFile: tsconfigFile
            },
        }),
    ];
    if (projectConfig.enableESlint) {
        plugins.push(new eslint_webpack_plugin_1.default({
            context: process.cwd(),
            extensions: ['vue', 'ts', 'js'],
            fix: true,
            exclude: 'node_modules'
        }));
    }
    return {
        plugins,
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                        },
                        {
                            loader: 'ts-loader',
                            options: {
                                appendTsSuffixTo: [/\.vue$/],
                                configFile: tsconfigFile,
                                compilerOptions: {
                                    sourceMap: command === 'dev'
                                },
                                /**
                                 * 关闭类型检检验，校验工作给 ForkTsCheckerWebpackPlugin 插件
                                 */
                                transpileOnly: true,
                            }
                        }
                    ],
                },
            ]
        }
    };
};
exports.default = createConfig;
