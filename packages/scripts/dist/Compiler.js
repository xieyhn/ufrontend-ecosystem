"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const webpack_merge_1 = __importDefault(require("webpack-merge"));
const webpack_1 = __importDefault(require("webpack"));
const webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
const webpack_config_1 = require("./webpack.config");
const webpack_devServer_config_1 = require("./webpack.devServer.config");
const logger_1 = require("./logger");
const options_1 = require("./options");
function loadUserProjectConfig() {
    const localProjectConfigPath = path_1.default.resolve(process.cwd(), 'project.config.local.js');
    const projectConfigPath = path_1.default.resolve(process.cwd(), 'project.config.js');
    if (fs_extra_1.default.existsSync(localProjectConfigPath)) {
        // eslint-disable-next-line
        return require(localProjectConfigPath);
    }
    if (fs_extra_1.default.existsSync(projectConfigPath)) {
        // eslint-disable-next-line
        return require(projectConfigPath);
    }
    return {};
}
function transformWebpackConfig(webpackConfig, projectConfig) {
    let config = webpackConfig;
    const { configureWebpack, webpackConfigTransform } = projectConfig;
    if (configureWebpack) {
        config = (0, webpack_merge_1.default)(config, configureWebpack);
    }
    if (webpackConfigTransform) {
        const result = webpackConfigTransform(config);
        if (result)
            config = result;
    }
    return config;
}
function transformWebpackDevServerConfig(devServerConfig, projectConfig) {
    let config = devServerConfig;
    const { configureWebpackDevServer, webpackDevServerConfigTransform } = projectConfig;
    if (configureWebpackDevServer) {
        config = (0, webpack_merge_1.default)(config, configureWebpackDevServer);
    }
    if (webpackDevServerConfigTransform) {
        const result = webpackDevServerConfigTransform(config);
        if (result)
            config = result;
    }
    return config;
}
class Compiler {
    webpackConfig;
    webpackDevServerConfig;
    options;
    constructor(options) {
        const projectConfig = loadUserProjectConfig();
        this.options = (0, options_1.resolveOptions)({
            command: options.command,
            debug: options.debug,
            projectConfig,
        });
        // 校验参数的合法性
        (0, options_1.checkOptions)(this.options);
        // webpackConfig
        this.webpackConfig = transformWebpackConfig((0, webpack_config_1.createWebpackConfig)(this.options), projectConfig);
        // webpackDevServerConfig
        this.webpackDevServerConfig = transformWebpackDevServerConfig((0, webpack_devServer_config_1.createDevServerConfig)(this.options), projectConfig);
    }
    run() {
        (0, logger_1.log)('Debug:', this.options.debug);
        const compiler = (0, webpack_1.default)(this.webpackConfig);
        if (this.options.command === 'dev') {
            new webpack_dev_server_1.default(this.webpackDevServerConfig, compiler).start();
            return;
        }
        compiler.run((err, stats) => {
            if (err) {
                (0, logger_1.error)(err);
                return;
            }
            if (stats) {
                (0, logger_1.log)(stats.toString({ colors: true }));
            }
        });
    }
}
exports.default = Compiler;
