"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const minimist_1 = __importDefault(require("minimist"));
const Compiler_1 = __importDefault(require("./Compiler"));
const command = process.argv[2];
const { mode = command === 'dev' ? 'development' : 'production', debug = command === 'dev' } = (0, minimist_1.default)(process.argv);
[`.env.${mode}.local`, `.env.${mode}`, '.env.local', '.env'].forEach((i) => {
    dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), i) });
});
// set NODE_ENV
if (typeof process.env.NODE_ENV === 'undefined') {
    process.env.NODE_ENV = command === 'dev' ? 'development' : 'production';
}
new Compiler_1.default({ command, debug }).run();
