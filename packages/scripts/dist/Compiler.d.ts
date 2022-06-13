import { Configuration as Configuration } from 'webpack';
import { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import { Options } from './helper';
export declare type Command = 'dev' | 'release';
interface CompilerOptions {
    command?: Command;
    debug?: boolean;
}
declare class Compiler {
    webpackConfig: Configuration;
    webpackDevServerConfig: DevServerConfiguration;
    options: Options;
    constructor(options: CompilerOptions);
    run(): void;
}
export default Compiler;
