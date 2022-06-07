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
const helper_1 = require("./helper");
function loadUserProjectConfig() {
    const projectConfigPath = path_1.default.resolve(process.cwd(), 'project.config.js');
    if (!fs_extra_1.default.existsSync(projectConfigPath))
        return {};
    // eslint-disable-next-line
    return require(projectConfigPath);
}
class Compiler {
    webpackConfig;
    options;
    constructor(options) {
        const projectConfig = loadUserProjectConfig();
        this.options = (0, helper_1.resolveOptions)({
            command: options.command,
            debug: options.debug,
            projectConfig,
        });
        // 校验参数的合法性
        (0, helper_1.checkOptions)(this.options);
        // 生成内置 webpack 配置
        this.webpackConfig = (0, webpack_config_1.createWebpackConfig)(this.options);
        // 通过项目配置，修改 webpack 配置
        this.transformConfig(projectConfig);
    }
    run() {
        (0, logger_1.log)('Debug:', this.options.debug);
        const compiler = (0, webpack_1.default)(this.webpackConfig);
        if (this.options.command === 'dev') {
            const server = new webpack_dev_server_1.default((0, webpack_devServer_config_1.createDevServerConfig)(this.options), compiler);
            server.start();
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
    /**
     * 根据项目配置，最后调整 webpack config
     */
    transformConfig(projectConfig) {
        const { configureWebpack, webpackConfigTransform } = projectConfig;
        if (configureWebpack) {
            this.webpackConfig = (0, webpack_merge_1.default)(this.webpackConfig, configureWebpack);
        }
        if (webpackConfigTransform) {
            const config = webpackConfigTransform(this.webpackConfig);
            if (config)
                this.webpackConfig = config;
        }
    }
}
exports.default = Compiler;
