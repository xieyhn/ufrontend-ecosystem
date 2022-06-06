"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorExit = exports.error = exports.log = void 0;
exports.log = console.log;
exports.error = console.error;
const errorExit = (...args) => {
    (0, exports.error)(...args);
    process.exit(1);
};
exports.errorExit = errorExit;
