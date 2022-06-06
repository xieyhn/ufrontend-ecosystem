import { Configuration } from 'webpack';
import { ProjectConfig } from './defineProjectConfig';
import { Options } from './helper';
export declare type Command = 'dev' | 'release';
interface CompilerOptions {
    command?: Command;
    debug?: boolean;
}
declare class Compiler {
    webpackConfig: Configuration;
    options: Options;
    constructor(options: CompilerOptions);
    run(): void;
    /**
     * 加载用户项目配置
     */
    loadUserProjectConfig(): ProjectConfig;
    /**
     * 根据项目配置，最后调整 webpack config
     */
    transformConfig(projectConfig: ProjectConfig): void;
}
export default Compiler;
