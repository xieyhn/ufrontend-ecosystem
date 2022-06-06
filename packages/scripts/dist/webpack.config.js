"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebpackConfig = void 0;
const webpack_merge_1 = __importDefault(require("webpack-merge"));
const base_1 = __importDefault(require("./config/base"));
const scss_1 = __importDefault(require("./config/scss"));
const ts_1 = __importDefault(require("./config/ts"));
const vue_1 = __importDefault(require("./config/vue"));
const createWebpackConfig = options => {
    return (0, webpack_merge_1.default)([base_1.default, scss_1.default, ts_1.default, vue_1.default].map(config => {
        if (typeof config === 'function')
            return config(options);
        return config;
    }));
};
exports.createWebpackConfig = createWebpackConfig;
