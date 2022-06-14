"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const stylelint_webpack_plugin_1 = __importDefault(require("stylelint-webpack-plugin"));
const autoprefixer_1 = __importDefault(require("autoprefixer"));
const resolvePublicPath_1 = require("./plugins/resolvePublicPath");
const StylePlugin_1 = __importDefault(require("./plugins/StylePlugin"));
const consts_1 = require("./consts");
const createConfig = (options) => {
    const { command, debug, projectConfig } = options;
    const loaders = [
        command === 'dev' ? 'style-loader' : mini_css_extract_plugin_1.default.loader,
        {
            loader: 'css-loader',
            options: {
                url: {
                    filter(url) {
                        return !resolvePublicPath_1.cssIgnoreUrlMap.get(url);
                    },
                },
            },
        },
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: [
                        autoprefixer_1.default,
                        (0, resolvePublicPath_1.postcssPluginCreator)(options),
                    ],
                },
            },
        },
    ];
    const plugins = [
        new mini_css_extract_plugin_1.default({
            filename: `${consts_1.cssAssetsPrefix}${debug ? '[name].[contenthash:8]' : '[contenthash]'}.css`,
        }),
    ];
    if (projectConfig.css.prodInjectMode === 'style') {
        plugins.push(new StylePlugin_1.default());
    }
    if (projectConfig.enableStylelint) {
        plugins.push(new stylelint_webpack_plugin_1.default({
            extensions: ['vue', 'scss', 'sass', 'css'],
            context: process.cwd(),
            fix: false,
        }));
    }
    return {
        plugins,
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: loaders,
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: loaders.concat('sass-loader'),
                },
            ],
        },
    };
};
exports.default = createConfig;
