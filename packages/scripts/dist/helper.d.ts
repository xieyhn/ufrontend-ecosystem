import type { Configuration as WebpackConfiguration } from 'webpack';
import type { Command } from './Compiler';
import type { ProjectConfig } from './defineProjectConfig';
export interface Options {
    command: Command;
    debug: boolean;
    projectConfig: ProjectConfig;
}
export interface ConfigurationGetter {
    (options: Options): WebpackConfiguration;
}
export declare function resolveOptions(options: Partial<Options>): Options;
export declare function checkOptions(options: Options): void;
