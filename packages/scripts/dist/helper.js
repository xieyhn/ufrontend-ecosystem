"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOptions = exports.resolveOptions = void 0;
const webpack_merge_1 = __importDefault(require("webpack-merge"));
const logger_1 = require("./logger");
/**
 * Webpack/WebpackDevServer Configuration getter options
 */
const defalutOptions = {
    command: 'dev',
    debug: true,
    projectConfig: {
        publicPath: '',
        configureWebpack: undefined,
        webpackConfigTransform: undefined,
        enableStylelint: false,
        enableESlint: false,
        transformAssetUrls: {
            tags: {
                video: ['src', 'poster'],
                source: ['src'],
                img: ['src'],
                image: ['xlink:href', 'href'],
                use: ['xlink:href', 'href'],
            },
        },
    },
};
function resolveOptions(options) {
    const marged = (0, webpack_merge_1.default)({}, defalutOptions, options);
    return marged;
}
exports.resolveOptions = resolveOptions;
function checkOptions(options) {
    const { publicPath } = options.projectConfig;
    if (publicPath && !publicPath.endsWith('/')) {
        (0, logger_1.errorExit)(new Error('publicPath 需要以 / 结尾'));
    }
}
exports.checkOptions = checkOptions;
