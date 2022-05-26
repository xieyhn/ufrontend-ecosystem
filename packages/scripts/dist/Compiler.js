"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = __importDefault(require("webpack"));
const webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
const webpack_config_1 = require("./webpack.config");
const webpack_devServer_config_1 = require("./webpack.devServer.config");
class Compiler {
    run(command, debug) {
        const compiler = (0, webpack_1.default)((0, webpack_config_1.createWebpackConfig)(command, { debug }));
        if (command === 'dev') {
            const server = new webpack_dev_server_1.default((0, webpack_devServer_config_1.createDevServerConfig)(), compiler);
            server.start();
            return;
        }
        compiler.run((err, stats) => {
            if (err) {
                console.error(err);
                return;
            }
            if (stats) {
                console.log(stats.toString({ colors: true }));
            }
        });
    }
}
exports.default = Compiler;
